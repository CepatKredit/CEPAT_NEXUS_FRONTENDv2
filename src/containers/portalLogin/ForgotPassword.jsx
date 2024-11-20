import * as React from 'react'
import { viewForgotPasswordModal } from '@hooks/ModalController';
import { Input, Button, ConfigProvider, notification } from 'antd'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

function ForgotPassword() {

    const [api, contextHolder] = notification.useNotification()
    const [getUsername, setUsername] = React.useState('')
    const setForgotStatus = viewForgotPasswordModal((state) => state.setStatus)
    const onClickForgot = useMutation({
        mutationFn: async () => {
            await axios.post(`/api/POST/P91FP/${getUsername}`)
                .then((result) => {
                    setUsername('')
                    setForgotStatus(false)
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    })
                })
                .catch((error) => {
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
        }
    })

    return (
        <div className='h-[200px] pt-[15px]'>
            {contextHolder}
            <span>
                Please provide your email, and we’ll email you a link to reset your password.
            </span>
            <div className='w-full pt-3'>
                <div>
                    <label className='font-bold'>Email</label>
                </div>
                <div>
                    <Input style={{ width: '100%' }}
                        size='large'
                        value={getUsername}
                        onChange={(e) => { setUsername(e.target.value) }}
                        allowClear
                    />
                </div>
            </div>
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button onClick={() => { onClickForgot.mutate() }} className='bg-[#3b0764] mt-5 w-full'
                    disabled={!getUsername} loading={onClickForgot.isPending} size='large' type='primary'>Submit</Button>
            </ConfigProvider>
        </div>
    )
}

export default ForgotPassword