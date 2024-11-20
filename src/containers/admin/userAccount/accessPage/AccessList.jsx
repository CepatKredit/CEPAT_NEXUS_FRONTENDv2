import * as React from 'react'
import { ConfigProvider, Button, Space, Popconfirm, Tabs, notification } from 'antd'
import LabeledSelect from '@components/global/LabeledSelect'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST, POST_DATA } from '@api/base-api/BaseApi';
import DefaultAccessList from './DefaultAccessList';
import CustomAccessList from './CustomAccessList';
import { useMutation } from '@tanstack/react-query';
import { toUpperText } from '@utils/Converter';
import axios from 'axios';

function AccessList({ DataList }) {

    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient()
    const [getData, setData] = React.useState({
        Id: '',
        Department: '',
        Role: ''
    })

    React.useEffect(() => {
        setData({
            ...getData,
            Id: DataList.Id,
            Department: DataList.Department,
            Role: DataList.Role
        })
        DepartmentListQuery.refetch()
        RoleListQuery.refetch()
    }, [DataList])

    const [getDeptList, setDeptList] = React.useState()
    const [getRoleList, setRoleList] = React.useState()

    const DepartmentListQuery = useQuery({
        queryKey: ['DepartmentList'],
        queryFn: async () => {
            const result = await GET_LIST('/api/v1/GET/G41DL')
            setDeptList(result.list)
            return result.list
        },
        enabled: false
    })

    function GetDeptId() {
        let dataHolder = getDeptList
        const DeptHolder = dataHolder.find((x) => x.departmentName === getData.Department || x.deptId === getData.Department)
        return DeptHolder.deptId
    }

    const RoleListQuery = useQuery({
        queryKey: ['RoleList'],
        queryFn: async () => {
            const result = await GET_LIST(`/api/v1/GET/G42RL/${GetDeptId()}`)
            setRoleList(result.list)
            return result.list
        },
        enabled: false
    })

    function GetRoleId() {
        let dataHolder = getRoleList
        const RoleID = dataHolder.find((x) => x.description === getData.Role || x.roleId === getData.Role)
        return RoleID.roleId
    }

    const [getEdit, setEdit] = React.useState()
    function onChangeRole(e) {
        setData({ ...getData, Role: e })
        if (DataList.RoleID !== e) { setEdit('NOT EQUAL') }
        else { setEdit('') }
    }

    React.useEffect(() => {
        RoleListQuery.refetch()
        DefaultAccessListQuery.refetch()
        CustomAccessListQuery.refetch()
    }, [getData.Role, getData.Department])

    const DefaultAccessListQuery = useQuery({
        queryKey: ['DefaultAccessList'],
        queryFn: async () => {
            const data = {
                Id: DataList.Id,
                RoleId: GetRoleId().toString()
            }
            const result = await POST_DATA('/api/v1/POST/P78GDAL', data)
            return result.list
        },
        enabled: !!DataList.Id
    })

    const CustomAccessListQuery = useQuery({
        queryKey: ['CustomAccessList'],
        queryFn: async () => {
            const data = {
                Id: DataList.Id,
                RoleId: DataList.RoleID.toString()
            }
            const result = await POST_DATA('/api/v1/POST/P79GCAL', data)
            return result.list
        },
        enabled: !!DataList.Id
    })

    const onClickUpdateRole = useMutation({
        mutationFn: async () => {
            const data = {
                Id: toUpperText(DataList.Id),
                RoleId: GetRoleId().toString(),
                Department: GetDeptId()
            }
            setEdit('')
            await axios.post('/api/v1/POST/P80UR', data)
                .then((result) => {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    })
                    queryClient.invalidateQueries({ queryKey: ['UserListQuery'] }, { exact: true })
                    queryClient.invalidateQueries({ queryKey: ['UserInfo'] }, { exact: true })
                })
                .catch((error) => {
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
        }
    })

    const items = [
        {
            key: '1',
            label: 'Default Access',
            children: (<DefaultAccessList List={DefaultAccessListQuery.data} isLoading={DefaultAccessListQuery.isLoading} isEdit={getEdit} />)
        },
        {
            key: '2',
            label: 'Custom Access',
            children: (<CustomAccessList List={CustomAccessListQuery.data} isLoading={DefaultAccessListQuery.isLoading} isEdit={getEdit} />)
        }
    ]

    return (
        <>
            {contextHolder}
            <Space>
                <LabeledSelect className={'w-[320px]'} label={'Department'} data={DepartmentListQuery.data?.map((x) => ({
                    value: x.deptId,
                    label: x.departmentName,
                }))} value={getData.Department || undefined}
                    receive={(e) => { setData({ ...getData, Department: e, Role: '' }) }}
                />
                <LabeledSelect className={'w-[320px]'} label={'Role'} data={RoleListQuery.data?.map((x) => ({
                    value: x.roleId,
                    label: x.description,
                }))} value={getData.Role}
                    receive={(e) => { onChangeRole(e) }}
                />
            </Space>
            <center>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Popconfirm title="Are you sure you want to save this access list?"
                        onConfirm={() => { onClickUpdateRole.mutate() }}>
                        <Button className='bg-[#3b0764] mt-4 w-[100px]' loading={onClickUpdateRole.isPending} size='large' type='primary'>Update</Button>
                    </Popconfirm>
                </ConfigProvider>
            </center>
            <div className='mt-4'>
                <Tabs defaultActiveKey='1' items={items} />
            </div>
        </>
    )
}

export default AccessList