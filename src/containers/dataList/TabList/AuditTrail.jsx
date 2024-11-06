import * as React from 'react'
import { Button, Typography, Input, ConfigProvider } from 'antd'
import { SearchOutlined, ToolTwoTone } from '@ant-design/icons';
import LabeledInput from '@components/validation/LabeledInput'
import ResponsiveTable from '@components/validation/ResponsiveTable';

function AuditTrail() {

    const [getGenerate, setGenerate] = React.useState(false)

    const columns = [
        {
            title: '#',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'Activity',
            dataIndex: 'activity',
            key: 'activity',
        },
        {
            title: 'Changes Made By',
            dataIndex: 'changesMade',
            key: 'changesMade',
        },
        {
            title: 'Date',
            dataIndex: 'dt',
            key: 'dt',
        },
    ]
    let val = 0;
    return (
        <div>
            {
                val === 0
                    ? (<div className='pt-[7rem]'>
                        <center>
                            <div className='pt-[80px]'>
                                <ToolTwoTone style={{ fontSize: '80px' }} />
                            </div>
                            <div className='pt-[20px]'>
                                <span className='font-bold text-4xl'>Under Development</span>
                            </div>
                        </center>
                    </div>)
                    : (<div className='h-[500px] overflow-y-auto'>
                        <div className='flex flex-row justify-center'>
                            <div className='w-[48%]'>
                                <center>
                                    <Typography.Title level={2}>Loan Details</Typography.Title>
                                </center>
                                <div className='flex flex-wrap gap-2'>
                                    <LabeledInput className={'mt-5 w-[300px]'} label={'Loan Application ID'} disabled={true} />
                                    <LabeledInput className={'mt-5 w-[300px]'} label={'Date of Application'} disabled={true} />
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    <LabeledInput className={'mt-5 w-[300px]'} label={'Loan Application Status'} disabled={true} />
                                    <LabeledInput className={'mt-5 w-[300px]'} label={'Created By'} disabled={true} />
                                </div>
                            </div>
                        </div>
                        <center className='mt-[2%]'>
                            <Button type='primary' onClick={() => { setGenerate(!getGenerate) }} size='large'>
                                Generate Audit Trail
                            </Button>
                        </center>
                        {
                            getGenerate
                                ? (<div className='mt-[2%]'>
                                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                        <Button className='bg-[#3b0764]'
                                            size='large' type='primary'>Export Report</Button>
                                    </ConfigProvider>
                                    <div className='pb-2 pr-2 min-w-[25%] float-end'>
                                        <Input size='large' addonAfter={<SearchOutlined />} placeholder='Search' />
                                    </div>
                                    <div className='h-[300px]'>
                                        <ResponsiveTable columns={columns} height={300} width={700} />
                                    </div>
                                </div>)
                                : (<></>)
                        }
                    </div>)
            }
        </div>
    )
}

export default AuditTrail