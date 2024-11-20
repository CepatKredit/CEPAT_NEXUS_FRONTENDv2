import LabeledDatePicker from '@components/global/LabeledDatePicker';
import LabeledInput from '@components/global/LabeledInput'
import LabeledSelect from '@components/global/LabeledSelect';
import MultiSelect from '@components/global/MultiSelect';
import { Space, ConfigProvider, Button, notification, Tabs } from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import * as React from 'react'
import { Suffix } from '@utils/FixedData';
import { StatusDrop } from '@utils/FixedData';
import { GET_LIST } from '@api/base-api/BaseApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mmddyy, toDecrypt } from '@utils/Converter';
import { SessionTimeoutList } from '@utils/FixedData';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AccessList from './accessPage/AccessList';

function EditUser() {

    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient()
    const token = localStorage.getItem('UTK');
    const [getData, setData] = React.useState({
        Id: '',
        FirstName: '',
        MiddleName: '',
        LastName: '',
        Suffix: '',
        Birthdate: '',
        Username: '',
        Department: '',
        Role: 0,
        RoleID: 0,
        Branch: [],
        Stat: '',
        SessionTimeout: 0,
    })

    const UserInfoQuery = useQuery({
        queryKey: ['UserInfo'],
        queryFn: async () => {
            var result = await axios.get(`/GET/G39UI/${toDecrypt(localStorage.getItem('EUSD'))}`)
            console.log(result.data)
            setData({
                Id: toDecrypt(localStorage.getItem('EUSD')),
                FirstName: result.data?.firstName,
                MiddleName: result.data?.middleName,
                LastName: result.data?.lastName,
                Suffix: result.data?.suffix,
                Birthdate: dayjs(mmddyy(result.data?.birthdate), 'MM-DD-YYYY'),
                Username: result.data?.username,
                Department: result.data?.department,
                Role: result.data?.role,
                RoleID: result.data?.roleID,
                Branch: GetBranchName(result.data?.branch?.split(',')),
                Stat: result.data?.stat === 1
                    ? 'ENABLE'
                    : result.data?.stat === 2
                        ? 'DISABLE'
                        : result.data?.stat === 3
                            ? 'FOR APPROVAL'
                            : result.data?.stat === 4
                                ? 'REJECT'
                                : 'RESET PASSWORD',
                SessionTimeout: result.data?.sessionTimeout
            })

            return result.data
        },
        enabled: true,
    })

    React.useEffect(() => {
        UserInfoQuery.refetch()
        BranchListQuery.refetch()
        queryClient.invalidateQueries({ queryKey: ['UserLDefaultAccessLististQuery'] }, { exact: true })
        console.log(getData)
    }, [localStorage.getItem('EUSD')])

    function GetBranchName(data) {
        let code = []
        data?.map((x) => {
            if (x.toString() === 'ALL' || x.toString() === '00') {
                code.push('ALL')
            }
            else {
                let dataHolder = getBranch
                const CityHolder = dataHolder.find((value) => value.name === x || value.code.toString() === x)
                code.push(CityHolder.name)
            }
        })
        return code
    }

    const [getBranch, setBranch] = React.useState()
    const BranchListQuery = useQuery({
        queryKey: ['BranchList'],
        queryFn: async () => {
            const result = await GET_LIST('/GET/G40BL')
            setBranch(result.list)
            return result.list
        },
        enabled: false
    })

    function BranchList() {
        let holder = [
            {
                value: 'ALL',
                label: 'ALL'
            }
        ]

        BranchListQuery.data?.map((x) => {
            holder.push({
                value: x.name,
                label: x.name,
            })
        })
        return holder;
    }

    function GetBranchCode() {
        let code = []
        getData.Branch.map((x) => {
            if (x.toString() === 'ALL' || x.toString() === '00') {
                code = []
                code.push('00')
            }
            else {
                let dataHolder = getBranch
                const CityHolder = dataHolder.find((value) => value.name === x || value.code.toString() === x)
                code.push(CityHolder.code)
            }
        })
        return code
    }

    const onClickUpdateUser = useMutation({
        mutationFn: async () => {
            const dataHolder = {
                Id: getData.Id,
                FirstName: getData.FirstName,
                MiddleName: getData.MiddleName,
                LastName: getData.LastName,
                Suffix: getData.Suffix,
                Birthdate: mmddyy(getData.Birthdate),
                Username: getData.Username,
                Branch: GetBranchCode().toString(),
                Stat: getData.Stat === 'ENABLE'
                    ? 1
                    : getData.Stat === 'DISABLE'
                        ? 2
                        : getData.Stat === 'FOR APPROVAL'
                            ? 3
                            : getData.Stat === 'REJECT'
                                ? 4
                                : 5,
                SessionTimeout: getData.SessionTimeout,
                ModUser: jwtDecode(token).USRID,
            }

            await axios.post('/GroupPost/P84UU', dataHolder)
                .then((result) => {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    })
                    if (result.data.status === 'success') {
                        queryClient.invalidateQueries({ queryKey: ['UserListQuery'] }, { exact: true })
                    }
                })
                .catch((error) => {
                    console.log(error)
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
            label: 'User Info',
            children: (<div className='pt-[15%]'>
                <Space>
                    {contextHolder}
                    <LabeledInput className={'w-[320px]'} label={'Username'} value={getData.Username}
                        receive={(e) => { setData({ ...getData, Username: e }) }} readOnly={true} />

                    <LabeledSelect className={'w-[320px]'} label={'Status'} data={StatusDrop()} value={getData.Stat || undefined}
                        receive={(e) => { setData({ ...getData, Stat: e }) }} />
                </Space>
                <Space>
                    <LabeledInput className={'w-[320px]'} label={'First Name'} value={getData.FirstName}
                        receive={(e) => { setData({ ...getData, FirstName: e }) }} />

                    <LabeledInput className={'w-[320px]'} label={'Middle Name'} value={getData.MiddleName}
                        receive={(e) => { setData({ ...getData, MiddleName: e }) }} />
                </Space>
                <Space>
                    <LabeledInput className={'w-[320px]'} label={'Last Name'} value={getData.LastName}
                        receive={(e) => { setData({ ...getData, LastName: e }) }} />

                    <LabeledSelect className={'w-[320px]'} label={'Suffix'} data={Suffix()} value={getData.Suffix || undefined}
                        receive={(e) => { setData({ ...getData, Suffix: e }) }} />
                </Space>
                <Space>
                    <LabeledDatePicker className={'w-[320px]'} label={'Birth Date'} value={getData.Birthdate}
                        receive={(e) => { setData({ ...getData, Birthdate: e }) }} />
                    <MultiSelect className={'w-[320px]'} label={'Branch'} count={1} data={BranchList()}
                        value={getData.Branch}
                        receive={(e) => {
                            setData({ ...getData, Branch: e })
                        }} />
                </Space>
                <LabeledSelect className={'w-full'} label={'Session Timeout'}
                    value={getData.SessionTimeout || undefined} data={SessionTimeoutList()}
                    receive={(e) => {
                        setData({ ...getData, SessionTimeout: e })
                    }} />
                <center>
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button className='bg-[#3b0764] mt-9 w-[100px]' onClick={() => { onClickUpdateUser.mutate() }}
                            loading={onClickUpdateUser.isPending} size='large' type='primary'>Update</Button>
                    </ConfigProvider>
                </center>
            </div>)
        },
        {
            key: '2',
            label: 'Access List',
            children: (<AccessList DataList={getData} />)
        }
    ]

    return (
        <Tabs defaultActiveKey='1' items={items} />
    )
}

export default EditUser