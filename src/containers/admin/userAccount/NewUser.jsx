import LabeledDatePicker from '@components/global/LabeledDatePicker';
import LabeledInput from '@components/global/LabeledInput'
import LabeledSelect from '@components/global/LabeledSelect';
import MultiSelect from '@components/global/MultiSelect';
import axios from 'axios';
import { Space, ConfigProvider, Input, Button, notification, Tooltip } from 'antd'
import * as React from 'react'
import { generatePassword } from '@utils/Generate';
import { SessionTimeoutList, Suffix } from '@utils/FixedData';
import { jwtDecode } from 'jwt-decode';
import { GET_LIST } from '@api/base-api/BaseApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mmddyy } from '@utils/Converter';
import { RefreshRole } from '@hooks/RefresherState';
import { useMutation } from '@tanstack/react-query';
import LabeledInputEmail from '@components/global/LabeledInputEmail';
import { code } from '@utils/Secure';

function NewUser() {

    const queryClient = useQueryClient()
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification();
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [getData, setData] = React.useState({
        FirstName: '',
        MiddleName: '',
        LastName: '',
        Suffix: '',
        Birthdate: '',
        Username: '',
        Password: '',
        Department: '',
        Role: '',
        Branch: [],
        RecBy: '',
        SessionTimeout: 0,
    })

    function onChangePassword(e) {
        setData({
            ...getData,
            Password: e.target.value
        })
    }

    function GeneratePassword() {
        setData({
            ...getData,
            Password: generatePassword()
        })
    }

    const [getBranch, setBranch] = React.useState()
    const BranchListQuery = useQuery({
        queryKey: ['BranchList'],
        queryFn: async () => {
            const result = await GET_LIST('/GroupGet/G40BL')
            setBranch(result.list)
            return result.list
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    })

    const DepartmentListQuery = useQuery({
        queryKey: ['DepartmentList'],
        queryFn: async () => {
            const result = await GET_LIST('/GroupGet/G41DL')
            return result.list
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    })

    const setRefresher = RefreshRole((state) => state.storeValue)
    const getRefresher = RefreshRole((state) => state.refreshValue)
    const RoleListQuery = useQuery({
        queryKey: ['RoleList'],
        queryFn: async () => {
            const result = await GET_LIST(`/GroupGet/G42RL/${getData.Department}`);
            const counter = getRefresher + 1
            setRefresher(counter)
            return result.list
        },
        refetchInterval: () => {
            if (getRefresher >= 3) {
                return false
            }
            else {
                return 500
            }
        },
        enabled: true,
        retryDelay: 1000,
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
            if (x === 'ALL') {
                code = []
                code.push('00')
            }
            else {
                let dataHolder = getBranch
                const CityHolder = dataHolder.find((value) => value.name === x || value.code === x)
                code.push(CityHolder.code)
            }
        })
        return code
    }

    const onClickAddNewUser = useMutation({
        mutationFn: async () => {
            const dataHolder = {
                FirstName: getData.FirstName,
                MiddleName: getData.MiddleName,
                LastName: getData.LastName,
                Suffix: getData.Suffix,
                Birthdate: mmddyy(getData.Birthdate),
                Username: getData.Username,
                Password: code(getData.Password),
                Department: getData.Department,
                Role: getData.Role,
                Branch: GetBranchCode().toString(),
                RecBy: jwtDecode(token).USRID,
                SessionTimeout: getData.SessionTimeout
            }

           await axios.post('/GroupPost/P83R', dataHolder)
                .then(result => {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    })
                    if (result.data.status === 'success') {
                        queryClient.invalidateQueries({ queryKey: ['UserListQuery'] }, { exact: true })
                        setData({
                            FirstName: '',
                            MiddleName: '',
                            LastName: '',
                            Suffix: '',
                            Birthdate: '',
                            Username: '',
                            Password: '',
                            Department: '',
                            Role: '',
                            Branch: [],
                            RecBy: '',
                            SessionTimeout: ''
                        })
                    }
                })
                .catch(error => {
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
        }
    })

    return (
        <div className='pt-5'>
            {contextHolder}
            <Space>
                <LabeledInputEmail className={'w-[320px]'} label={'Username'}
                    value={getData.Username}
                    receive={(e) => {
                        setData({
                            ...getData, Username: e
                        })
                    }} />
                <Space.Compact>
                    <div className={'w-[220px]'}>
                        <div>
                            <label className='font-bold'>Password</label>
                        </div>
                        <div>
                            <Input.Password style={{ width: '100%' }}
                                name='Password'
                                size='large'
                                maxLength={15}
                                showCount
                                value={getData.Password}
                                onChange={onChangePassword}
                                allowClear
                                visibilityToggle={{
                                    visible: passwordVisible,
                                    onVisibleChange: setPasswordVisible,
                                }}
                            />
                        </div>
                    </div>
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button className='bg-[#3b0764] mt-[6.7%] w-[100px]' onClick={() => { GeneratePassword() }}
                            size='large' type='primary'>Generate</Button>
                    </ConfigProvider>
                </Space.Compact>
            </Space>
            <Space>
                <LabeledInput className={'w-[320px]'} label={'First Name'}
                    value={getData.FirstName}
                    receive={(e) => {
                        setData({ ...getData, FirstName: e })
                    }} />
                <LabeledInput className={'w-[320px]'} label={'Middle Name'}
                    value={getData.MiddleName}
                    receive={(e) => {
                        setData({ ...getData, MiddleName: e })
                    }} />
            </Space>
            <Space>
                <LabeledInput className={'w-[320px]'} label={'Last Name'}
                    value={getData.LastName}
                    receive={(e) => {
                        setData({ ...getData, LastName: e })
                    }} />
                <LabeledSelect className={'w-[320px]'} label={'Suffix'} data={Suffix()}
                    value={getData.Suffix || undefined}
                    receive={(e) => {
                        setData({ ...getData, Suffix: e })
                    }} />
            </Space>
            <Space>
                <LabeledDatePicker className={'w-[320px]'} label={'Birth Date'}
                    value={getData.Birthdate} receive={(e) => {
                        setData({ ...getData, Birthdate: e })
                    }} />
                <MultiSelect className={'w-[320px]'} label={'Branch'} count={1}
                    data={BranchList()}
                    value={getData.Branch}
                    receive={(e) => {
                        setData({ ...getData, Branch: e })
                    }} />
            </Space>
            <Space>
                <LabeledSelect className={'w-[320px]'} label={'Department'} data={DepartmentListQuery.data?.map((x) => ({
                    value: x.deptId,
                    label: x.departmentName,
                }))}
                    value={getData.Department || undefined}
                    receive={(e) => { setData({ ...getData, Department: e, Role: '' }); setRefresher(0) }} />

                <LabeledSelect className={'w-[320px]'} label={'Role'} data={RoleListQuery.data?.map((x) => ({
                    value: x.roleId,
                    label: x.description,
                }))}
                    value={getData.Role}
                    receive={(e) => {
                        setData({ ...getData, Role: e })
                    }} />
            </Space>
            <LabeledSelect className={'w-full'} label={'Session Timeout'}
                value={getData.SessionTimeout || undefined} data={SessionTimeoutList()}
                receive={(e) => {
                    setData({ ...getData, SessionTimeout: e })
                }} />
            <center>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Button onClick={() => { onClickAddNewUser.mutate() }} className='bg-[#3b0764] mt-5 w-[100px]'
                        size='large' loading={onClickAddNewUser.isPending} type='primary'>Register</Button>
                </ConfigProvider>
            </center>
        </div>
    )
}

export default NewUser