import React from 'react'
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom'

function Page404() {

    const navigate = useNavigate()
    function onClickBack() {
        navigate('/')
    }

    return (
        <div className='absolute inset-0 content-center'>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button className='bg-[#1677ff]'
                    onClick={onClickBack}
                    type="primary">Back</Button>}
            />
        </div>
    )
}

export default Page404