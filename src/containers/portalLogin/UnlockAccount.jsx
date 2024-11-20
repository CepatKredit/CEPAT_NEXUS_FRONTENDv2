import * as React from 'react'
import { viewUnlockAccountModal } from '@hooks/ModalController';
import { Input, Button, ConfigProvider, notification } from 'antd'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

function UnlockAccount() {

    const [api, contextHolder] = notification.useNotification()
    const [getUsername, setUsername] = React.useState('')
    const setUnlockStatus = viewUnlockAccountModal((state) => state.setStatus)

    const onClickUnlock = useMutation({
        mutationFn: async () => {
            await axios.post(`/api/v1/POST/P92UA/${getUsername}`)
                .then((result) => {
                    setUsername('')
                    setUnlockStatus(false)
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
                Please provide your email, and we’ll email you a link to unlock your account.
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
                <Button onClick={() => { onClickUnlock.mutate() }} className='bg-[#3b0764] mt-5 w-full'
                    disabled={!getUsername} loading={onClickUnlock.isPending} size='large' type='primary'>Submit</Button>
            </ConfigProvider>
        </div>
    )
}

export default UnlockAccount