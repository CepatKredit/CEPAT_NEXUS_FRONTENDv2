import * as React from 'react'
import { Card, Input, Button, ConfigProvider, notification, Spin } from 'antd'
import { LockOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { FcExpired } from "react-icons/fc";
import { useMutation } from '@tanstack/react-query';
import { code, decode } from '@utils/Secure';
import axios from 'axios';

function ResetPassword() {

    const navigate = useNavigate()
    const { id } = useParams();

    React.useEffect(() => {
        checkURLValidity()
    }, [id])

    const [getAccount, setAccount] = React.useState({
        Id: '',
        Username: ''
    })
    const [getStatus, setStatus] = React.useState(1)
    async function checkURLValidity() {
        await axios.post(`/POST/P93VU/${id}`)
            .then((result) => {
                setStatus(result.data.status)
                if (result.data.status === 1) {
                    setAccount({
                        ...getAccount,
                        Id: result.data.id,
                        Username: result.data.username
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

    const [api, contextHolder] = notification.useNotification();
    const [passwordVisiblePass, setPasswordVisiblePass] = React.useState(false);
    const [passwordVisibleRetype, setPasswordVisibleRetype] = React.useState(false);
    const [getData, setData] = React.useState({
        password: '',
        rePassword: ''
    })

    let hasMinPass = getData.password.length >= 10
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

    function handleChange(e) {
        setData({ ...getData, [e.target.name]: e.target.value })
    }

    const onClickForgot = useMutation({
        mutationFn: async () => {
            const data = {
                UserId: getAccount.Id,
                Username: getAccount.Username,
                Password: code(getData.password),
                Stat: 1
            }

            let ctr_password = 0;
            await axios.post(`/POST/P94CP/${getAccount.Id}`)
                .then((result) => {
                    result.data.list?.map((x) => { if (decode(x.password) === getData.password) { ctr_password += 1 } })
                })
                .catch((error) => {
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
            if (ctr_password === 0) {
                await axios.post('/POST/P97RP', data)
                    .then((result) => {
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
                        })
                        navigate('/', {
                            state: {
                                status: result.data.status,
                                message: result.data.message,
                                description: result.data.description
                            }
                        })
                        setAccount({ ...getAccount, Id: '', Username: '' })
                        setData({ ...getData, password: '', rePassword: '' })
                    })
                    .catch((error) => {
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
    })

    return (
        <div>
            {contextHolder}
            <Spin indicator={<LoadingOutlined style={{ fontSize: 100, color: 'white' }} spin />} spinning={onClickForgot.isPending} fullscreen />
            {
                getStatus === 1
                    ? (
                        <div className='h-[100vh] w-[100vw]'>
                            <div className='flex h-screen'>
                                <Card title={'Reset Your Password'} className='w-[600px] h-[450px] shadow-xl m-auto'>
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

                                                        <CheckOutlined /> be at least minimum of 10 and maximum of 15 characters long.
                                                    </small> :
                                                    <small className='text-rose-500'>
                                                        <CloseOutlined /> be at least minimum of 10 and maximum of 15 characters long.

                                                    </small>}
                                            </div>
                                        </div>
                                    </div>
                                    <center>
                                        <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                            <Button className='bg-[#3b0764] mt-5 w-[100px]' size='large' type='primary' onClick={() => { onClickForgot.mutate() }}
                                                disabled={!getData.password || !getData.rePassword || getData.password !== getData.rePassword}>Submit</Button>
                                        </ConfigProvider>
                                    </center>
                                </Card>
                            </div>
                        </div>
                    )
                    : (
                        <div className='flex h-screen'>
                            <div className='h-[500px] w-[500px] m-auto'>
                                <center>
                                    <div className='mt-[80px]'>
                                        <FcExpired style={{ fontSize: '100px' }} />
                                    </div>
                                    <div className='mt-[20px]'>
                                        <span className='font-bold text-4xl'>This link is no longer valid</span>
                                    </div>
                                    <div className='mt-[10px]'>
                                        <span>This link is no longer valid, please go to the
                                            login page and select 'Forgot Password?' to generate a new
                                            one.</span>
                                    </div>
                                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                        <Button className='bg-[#3b0764] mt-5 w-[150px]' size='large' type='primary'
                                            onClick={() => { navigate('/') }}>Go to Login</Button>
                                    </ConfigProvider>
                                </center>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default ResetPassword