import { Button, Input, Radio, Tabs } from 'antd'
import React from 'react'

function Generation() {
    return (
        <div className='w-full flex flex-row'>
            <Tabs
                tabPosition="top"
                type="card"
                size="small"
                items={[
                    {
                        label: "Create Batch",
                        key: "create-batch",
                        children: ( <div className='flex flex-row'>
                            <Input className='w-[200px]' placeholder='Loan Application Number' />
                            <div className='ml-2 pt-1'>
                                <Radio.Group>
                                    <Radio value={"INSTAPAY"}>
                                        <span className="font-bold">INSTAPAY</span>
                                    </Radio>
                                    <Radio value={"PESONET"}>
                                        <span className="font-bold">PESONET</span>
                                    </Radio>
                                </Radio.Group>
                            </div>
                            <Input className='w-[200px]' placeholder='Recipient Name' />
                            <Input className='ml-2 w-[200px]' placeholder='Bank' />
                            <Input className='ml-2 w-[200px]' placeholder='Bank Account Number' />
                            <Input className='ml-2 w-[200px]' placeholder='Purpose' />
                            <Input className='ml-2 w-[200px]' placeholder='Amount to Credit' />
                            <Button className='ml-2' type='primary'>Add</Button>
                        </div>),
                    },
                    {
                        label: "Generate",
                        key: "generate",
                        children: 'test',
                    },
                    {
                        label: "History",
                        key: "history",
                        children: 'test',
                    },
                ]}
            />
        </div>
    )
}

export default Generation