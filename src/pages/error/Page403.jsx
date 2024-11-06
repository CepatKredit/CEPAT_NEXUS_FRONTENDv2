import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

function Page403() {

    const navigate = useNavigate()
    function onClickBack() {
        navigate('/')
    }

    return (
        <div className='absolute inset-0 content-center'>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary" onClick={onClickBack}>Back to login</Button>}
            />
        </div>
    )
}

export default Page403