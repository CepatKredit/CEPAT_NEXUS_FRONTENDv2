import React from 'react'
import { ConfigProvider, Input, Button, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { DisplayOTP } from '@hooks/OTPController';
import { useCookies } from 'react-cookie';
import { PageKey } from '@hooks/PageController';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toEncrypt } from '@utils/Converter';

function ValidationOTP({ username, accessList }) {
    const navigate = useNavigate()
    const [cookies, setCookie] = useCookies(['SESSION_ID'])
    const [api, contextHolder] = notification.useNotification()
    const setOTPStatus = DisplayOTP((state) => state.setStatus)
    const getOTPStatus = DisplayOTP((state) => state.modalStatus)
    const setPageAccess = PageKey((state) => state.setPageAccess)
    const [isLocked, setIsLocked] = React.useState(false);

    function maskEmail(email) {
        const [localPart, domain] = email.split('@')
        const maskedLocalPart = localPart.slice(0, 2) + '*'.repeat(localPart.length - 2)
        return `${maskedLocalPart}@${domain}`
    }

    const [time, setTime] = React.useState(300)
    const [startTime, setStartTime] = React.useState(Date.now())

    React.useEffect(() => {
        const interval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
            const remainingTime = Math.max(300 - elapsedTime, 0)
            setTime(remainingTime)
            if (remainingTime <= 0) clearInterval(interval)
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime])

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }

    const [getOTP, setOTP] = React.useState('')
    function onChangeOTP(e) {
        setOTP(e)
    }

    function keydown(e) {
        if (e.key === 'Enter') onClickValidate.mutate();
        if (e.key === 'Tab') e.preventDefault();

    }

    React.useEffect(() => {
        setTime(300)
        setStartTime(Date.now())
    }, [getOTPStatus])

    const onClickValidate = useMutation({
        mutationFn: async () => {
            const dataHolder = {
                Username: username,
                Otp: getOTP.toString()
            }
            if (time === 0) {
                await axios.post(`/cancelOtp/${username}`)
                    .then((result) => {
                        if (result.data.status === 'info') {
                            api.info({
                                message: 'OTP Session Expired',
                                description: 'Please Resend OTP and Try Again.'
                            })
                        }
                    })
                    .catch(error => {
                        api.error({
                            message: 'Something went wrong',
                            description: error.message
                        })
                    })
            } else {
                try {
                    const result = await axios.post('/verifyOtp', dataHolder);
                    const { status, message, description } = result.data;
                    if (status === 'success') {
                        // Reset OTPLock on success
                        localStorage.setItem('UTK', result.data.eeyyy);
                        localStorage.setItem('UPTH', toEncrypt(accessList));
                        localStorage.setItem('SP', '/ckfi/dashboard');
                        localStorage.setItem('USRFN', toEncrypt(result.data.fn));
                        localStorage.setItem('USRDT', toEncrypt(`${result.data.department}?${result.data.role}?${result.data.branch}`));
                        navigate('/ckfi/dashboard');
                        setCookie('SESSION_ID', result.data.eeyyy, { secure: true, sameSite: 'strict' });
                        api.success({ message, description });
                        setOTPStatus(false);
                    } else if (status === 'error' && description === 'Too many OTP attempts. Your account is locked.') {
                        // Account locked
                        setIsLocked(true);
                        api.error({ message, description });
                    } else {
                        // Incorrect OTP
                        api.warning({ message, description });
                    }
                } catch (error) {
                    api.error({ message: 'Something went wrong', description: error.message });
                }
            }
        }
    });

    async function onClickResendOTP() {
        await axios.post(`/resendOtp/${username}`)
            .then((result) => {
                setTime(300)
                setStartTime(Date.now())
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })
            })
            .catch(error => {
                api.error({
                    message: 'Something went wrong',
                    description: error.message
                })
            })
    }

    return (
        <div className='h-[14rem]'>
            {contextHolder}
            <div className='pt-6'>
                <center>

                    <div>
                        {isLocked && (
                            <div className="text-red-500 font-bold mb-4">
                                TOO MANY ATTEMPTS, YOUR ACCOUNT HAS BEEN LOCKED
                            </div>
                        )}

                        <span className='text-2xl font-bold'>OTP Verification</span>
                    </div>
                    <div className='pb-4'>
                        <span className='text-sm'>Enter the OTP sent to your&nbsp;
                            <span className='font-bold'>{maskEmail(username)}</span>f
                        </span>
                    </div>
                    <Input.OTP
                        value={getOTP}
                        formatter={(str) => str.replace(/[^0-9]/g, '')}
                        onChange={(e) => onChangeOTP(e)}
                        disabled={isLocked}
                        onKeyDown={(e) => {
                            if ((e.key && !/[0-9]/.test(e.key) && e.key !== 'Backspace')|| e.key === 'Tab') {
                                e.preventDefault();
                            }else if(e.key === 'Enter'){
                                onClickValidate.mutate();
                            }
                            keydown(e);
                        }}
                    />
                    <div className='pt-1'>
                        {
                            time === 0
                                ? (<Button type='link' onClick={() => { onClickResendOTP() }} disabled={isLocked}>Resend OTP</Button>)
                                : (<span>
                                    Resend OTP after&nbsp;
                                    <span className='font-bold'>{formatTime(time)}</span>
                                </span>)
                        }
                    </div>
                    <div className='pt-1'>
                        <ConfigProvider theme={{ token: { colorPrimary: '#31b234', borderRadius: 100, borderRadiusLG: 100, borderRadiusSM: 100 } }}>
                            <Button className='text-lg font-semibold w-[150px] h-[40px] bg-[#31b234]'
                                size='large' type='primary' loading={onClickValidate.isPending} onKeyUp={(e) => { if (e.key === 'Enter') onClickValidate.mutate() }}
                                onClick={() => onClickValidate.mutate()} disabled={isLocked}>Submit
                            </Button>
                        </ConfigProvider>
                    </div>

                </center>
            </div>
        </div>
    )
}

export default ValidationOTP