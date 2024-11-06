import { Space, ConfigProvider, Input, Button, notification } from 'antd'
import * as React from 'react'
import { generatePassword } from '@utils/Generate';
import LabeledInput from '@components/global/LabeledInput';
import { viewResetPasswordUserModal } from '@hooks/ModalAdminController';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { code, decode } from '@utils/Secure';


function ChangePassword() {

    const getDataList = viewResetPasswordUserModal((state) => state.dataCollection)
    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [getData, setData] = React.useState({
        Id: '',
        Username: '',
        Password: '',
        RegStat: 0,
    })

    React.useEffect(() => {
        setData({
            ...getData,
            Id: getDataList.id,
            Username: getDataList.username,
        })
    }, [getDataList])

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

    const setPasswordModalStatus = viewResetPasswordUserModal((state) => state.setStatus)
    const onClickReset = useMutation({
        mutationFn: async () => {
            const resetPasword = {
                Id: getData.Id,
                Username: getData.Username,
                Password: code(getData.Password),
                Stat: 5,
            }

            await axios.post('/user-management/resetPassword', resetPasword)
                .then(result => {
                    if (result.data.status === 'success') {
                        queryClient.invalidateQueries({ queryKey: ['UserListQuery'] }, { exact: true })
                        setPasswordModalStatus(false)
                        setData({
                            ...getData,
                            Id: '',
                            Username: '',
                            Password: '',
                            RegStat: 0,
                        })
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
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
        <>
            <LabeledInput className={'w-[100%]'} label={'Username'} value={getData.Username} disabled={true} />
            {contextHolder}
            <Space.Compact>
                <div className={'w-[250px]'}>
                    <div>
                        <label className='font-bold'>Password</label>
                    </div>
                    <div>
                        <Input.Password style={{ width: '100%' }}
                            name='password'
                            size='large'
                            value={getData.Password}
                            onChange={onChangePassword}
                            allowClear
                            maxLength={15}
                            showCount
                            visibilityToggle={{
                                visible: passwordVisible,
                                onVisibleChange: setPasswordVisible,
                            }}
                        />
                    </div>
                </div>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Button className='bg-[#3b0764] mt-[6.3%] w-[100px]' onClick={() => { GeneratePassword() }}
                        size='large' type='primary'>Generate</Button>
                </ConfigProvider>
            </Space.Compact>
            <center>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Button className='bg-[#3b0764] mt-5 w-[100px]' disabled={!getData.Password || getData.Password.length <= 9}
                        onClick={() => { onClickReset.mutate() }}
                        loading={onClickReset.isPending}
                        size='large' type='primary'>Update</Button>
                </ConfigProvider>
            </center>
        </>
    )
}

export default ChangePassword