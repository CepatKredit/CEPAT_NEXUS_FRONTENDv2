import * as React from 'react'
import axios from 'axios'
import { ConfigProvider, Input, Button, notification, Spin } from 'antd'
import { LockOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { viewResetPasswordModal } from '@hooks/ModalController';
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query';
import { code, decode } from '@utils/Secure';
import { toUpperText } from '@utils/Converter';

function ResetPassword() {

    const navigate = useNavigate()
    const [api, contextHolder] = notification.useNotification();
    const AccountId = viewResetPasswordModal((state) => state.AccountId)
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [passwordVisiblePass, setPasswordVisiblePass] = React.useState(false);
    const [passwordVisibleRetype, setPasswordVisibleRetype] = React.useState(false);
    const [getData, setData] = React.useState({
        tempPassword: '',
        password: '',
        rePassword: ''
    })

    const getStatus = viewResetPasswordModal((state) => state.modalStatus)
    const setModalResetStatus = viewResetPasswordModal((state) => state.setStatus)

    React.useEffect(() => {
        setData({
            tempPassword: '',
            password: '',
            rePassword: ''
        })
    }, [getStatus])

    function handleChange(e) {
        setData({ ...getData, [e.target.name]: e.target.value })
    }

    let hasMinPass = getData.password.length >= 8
    let hasLowerChar = /(.*[a-z].*)/.test(getData.password)
    let hasUpperChar = /(.*[A-Z].*)/.test(getData.password)
    let hasNumberChar = /(.*[0-9].*)/.test(getData.password)
    let hasSpecialChar = /(.*[^a-zA-Z0-9].*)/.test(getData.password)

    let dispNumSym;
    if (hasNumberChar === true &&
        hasSpecialChar === true) {
        dispNumSym = <small className='text-green-500'>
            <CheckOutlined /> include at least one number and symbol. </small>
    } else {
        dispNumSym = <small className='text-rose-500'>
            <CloseOutlined /> include at least one number and symbol. </small>
    }

    let dispUpLow;
    if (hasUpperChar === true &&
        hasLowerChar == true) {
        dispUpLow = <small className='text-green-500'>
            <CheckOutlined /> include both lower and upper case character. </small>
    } else {
        dispUpLow = <small className='text-rose-500'>
            <CloseOutlined /> include both lower and upper case character. </small>
    }

    const onClickResetPassword = useMutation({
        mutationFn: async () => {
            if (AccountId.password !== getData.tempPassword) {
                api['warning']({
                    message: 'Password Error',
                    description: 'Invalid Temporary Password.'
                })
            }
            else if (getData.tempPassword !== getData.password) {
                const passwordData = {
                    userId: toUpperText(AccountId.id),
                    username: AccountId.username,
                    password: code(getData.password),
                    stat: 1,
                }

                let ctr_password = 0;
                console.log("IDD", AccountId.id)
                await axios.post(`/POST/P94CP/${toUpperText(AccountId.id)}`)
                    .then((result) => {
                        console.log(result)
                        result.data.list?.map((x) => { if (decode(x.password) === getData.password) { ctr_password += 1 } })
                    })
                    .catch((error) => {
                        api['error']({
                            message: 'Something went wrong',
                            description: error.message
                        })
                    })

                if (ctr_password === 0) {
                    console.log("Password Data",passwordData)
                    await axios.post('/POST/P96SP', passwordData)
                    await axios.post('/POST/P97RP', passwordData)
                        .then(result => {
                            console.log("success", result)
                            if (result.data.status === 'success') {
                                setModalResetStatus(false);
                                navigate('/')
                                api[result.data.status]({
                                    message: result.data.message,
                                    description: result.data.description
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            api['error']({
                                message: 'Something went wrong',
                                description: error.message
                            })
                        })
                }
                else {
                    api['warning']({
                        message: 'Password already used.',
                        description: 'You already used that password, please try again.'
                    })
                }
            }
            else {
                api['warning']({
                    message: 'Password Error',
                    description: 'Temporary password and new password should not be the same. Try other password.'
                })
            }
        }
    })

    return (
        <div className='mx-[1%] my-[2%]'>
            {contextHolder}
            <div className={'w-full pt-2'}>
                <div>
                    <label className='font-bold'>Temporary Password</label>
                </div>
                <div>
                    <Input.Password style={{ width: '100%' }}
                        name='tempPassword'
                        size='large'
                        allowClear
                        value={getData.tempPassword}
                        onChange={handleChange}
                        visibilityToggle={{
                            visible: passwordVisible,
                            onVisibleChange: setPasswordVisible,
                        }}
                    />
                </div>
            </div>
            <div className={'w-full py-3'}>
                <div>
                    <label className='font-bold'>Password</label>
                </div>
                <div>
                    <Input.Password style={{ width: '100%' }}
                        name='password'
                        size='large'
                        allowClear
                        maxLength={15}
                        showCount
                        value={getData.password}
                        onChange={handleChange}
                        visibilityToggle={{
                            visible: passwordVisiblePass,
                            onVisibleChange: setPasswordVisiblePass,
                        }}
                        status={
                            getData.password === getData.rePassword
                                ? ''
                                : 'error'
                        }
                    />
                </div>
            </div>
            <div className={'w-full'}>
                <div>
                    <label className='font-bold'>Retype Password</label>
                </div>
                <div>
                    <Input.Password style={{ width: '100%' }}
                        name='rePassword'
                        size='large'
                        allowClear
                        maxLength={15}
                        showCount
                        value={getData.rePassword}
                        onChange={handleChange}
                        visibilityToggle={{
                            visible: passwordVisibleRetype,
                            onVisibleChange: setPasswordVisibleRetype,
                        }}
                        status={
                            getData.password === getData.rePassword
                                ? ''
                                : 'error'
                        }
                    />
                </div>
            </div>
            <div className='text-lg mt-2'>
                <small >
                    <LockOutlined /> Your password needs to:
                </small>
                <div className='container ml-1' style={{ marginLeft: '2%' }}>
                    <div>
                        {dispUpLow}
                    </div>
                    <div>
                        {dispNumSym}
                    </div>
                    <div>
                        {hasMinPass ?
                            <small className='text-green-500'>

                                <CheckOutlined /> be at least minimum of 8 and maximum of 15 characters long.
                            </small> :
                            <small className='text-rose-500'>
                                <CloseOutlined /> be at least minimum of 8 and maximum of 15 characters long.

                            </small>}
                    </div>
                </div>
            </div>
            <center>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Button className='bg-[#3b0764] mt-5 w-[100px]' size='large' type='primary'
                        loading={onClickResetPassword.isPending} onClick={() => { onClickResetPassword.mutate() }}
                        disabled={!getData.tempPassword || !getData.password || !getData.rePassword || getData.password !== getData.rePassword}>Submit</Button>
                </ConfigProvider>
            </center>
        </div>
    )
}

export default ResetPassword