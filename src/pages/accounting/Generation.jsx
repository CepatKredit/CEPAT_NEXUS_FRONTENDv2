import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useDataContainer } from '@context/PreLoad';
import { useQueryClient } from '@tanstack/react-query';
import { Button, ConfigProvider, Input, Popconfirm, Radio, Space, Table, Tabs, Tooltip } from 'antd'
import axios from 'axios';
import React from 'react'
import { MdEditSquare } from 'react-icons/md';

function Generation({data}) {
    const { getBank, getPurpose, GET_TOTAL_AMOUNT, GET_REFRESH_LAN, SET_REFRESH_LAN } = useDataContainer()
    const queryClient = useQueryClient()

    // const isEditing = (record) => record.key === editingKey;
    // const edit = (record) => {
    //     form.setFieldsValue({
    //         key: '',
    //         firstName: '',
    //         lastName: '',
    //         paymentType: '',
    //         bankName: '',
    //         bankAcctNo: '',
    //         amount: '',
    //         purpose: '',
    //         status: '',
    //         traceId: '',
    //         batchId: '',
    //         ...record,
    //     });
    //     SET_AMOUNT(removeCommas(record.amount))
    //     setEditingKey(record.key);
    // };

    // const cancel = () => {
    //     setEditingKey('');
    // };

    // const token = localStorage.getItem('UTK');
    // async function Save(key) {
    //     try {
    //         const row = await form.validateFields();
    //         const container = {
    //             PaymentType: row.paymentType,
    //             FirstName: row.firstName,
    //             LastName: row.lastName,
    //             BankName: GetBankDetails(row.bankName, 'CODE'),
    //             BankAcctNo: row.bankAcctNo,
    //             Amount: parseFloat(removeCommas(row.amount)),
    //             Purpose: GetPurposeDetails(row.purpose, 'CODE'),
    //             Status: row.status,
    //             ModUser: jwtDecode(token).USRID,
    //             ID: key
    //         }

    //         await axios.post('/POST/P123UD', container)
    //             .then((result) => {
    //                 queryClient.invalidateQueries({ queryKey: ['DisbursementListQuery', LAN, type] }, { exact: true })
    //                 if (type === 'NP') {
    //                     SET_REFRESH_LAN(1);
    //                 }
    //                 api[result.data.status]({
    //                     message: result.data.message,
    //                     description: result.data.description
    //                 })
    //                 setEditingKey('');
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //                 api['error']({
    //                     message: 'Something went wrong',
    //                     description: error.message
    //                 })
    //             })
    //     } catch (errInfo) {
    //         console.log('Validate Failed:', errInfo);
    //     }
    // }

    // async function Delete(key) {
    //     await axios.post(`/POST/P124DD/${key}`)
    //         .then((result) => {
    //             queryClient.invalidateQueries({ queryKey: ['DisbursementListQuery', LAN] }, { exact: true })
    //             if (type === 'NP') {
    //                 SET_REFRESH_LAN(1);
    //             }
    //             api[result.data.status]({
    //                 message: result.data.message,
    //                 description: result.data.description
    //             })
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             api['error']({
    //                 message: 'Something went wrong',
    //                 description: error.message
    //             })
    //         })
    // }

    // const columns = [
    //     {
    //         title: 'Control No.',
    //         dataIndex: 'cn',
    //         align: 'center',
    //         width: '100px',
    //         fixed: 'left',
    //     },
    //     {
    //         title: 'First Name',
    //         dataIndex: 'firstName',
    //         align: 'center',
    //         width: '200px',
    //         editable: true,
    //     },
    //     {
    //         title: 'Last Name',
    //         dataIndex: 'lastName',
    //         align: 'center',
    //         width: '200px',
    //         editable: true,
    //     },
    //     {
    //         title: 'Payment Type',
    //         dataIndex: 'paymentType',
    //         align: 'center',
    //         width: '100px',
    //         editable: true,
    //     },
    //     {
    //         title: 'Bank Name',
    //         dataIndex: 'bankName',
    //         align: 'center',
    //         width: '250px',
    //         editable: true,
    //         ellipsis: true,
    //     },
    //     {
    //         title: 'Bank Account Number',
    //         dataIndex: 'bankAcctNo',
    //         align: 'center',
    //         width: '150px',
    //         editable: true,
    //     },
    //     {
    //         title: 'Purpose',
    //         dataIndex: 'purpose',
    //         align: 'center',
    //         width: '150px',
    //         editable: true,
    //     },
    //     {
    //         title: 'Amount',
    //         dataIndex: 'amount',
    //         align: 'center',
    //         width: '80px',
    //         fixed: 'right',
    //         editable: true,
    //     },
    //     {
    //         title: 'Status',
    //         dataIndex: 'status',
    //         align: 'center',
    //         width: '150px',
    //         fixed: 'right',
    //         editable: true,
    //     },
    //     {
    //         title: 'Action',
    //         dataIndex: 'action',
    //         width: '80px',
    //         align: 'center',
    //         fixed: 'right',
    //         render: (_, record) => {
    //             const editable = isEditing(record);
    //             return editable ? (
    //                 <Space>
    //                     <Tooltip title="Save">
    //                         <Button onClick={() => { Save(record.key) }} icon={<SaveOutlined />} type='primary' />
    //                     </Tooltip>
    //                     <Tooltip title="Cancel">
    //                         <Popconfirm
    //                             title="Are you sure you want to cancel the edit?"
    //                             onConfirm={() => { cancel() }}
    //                             okText="Yes"
    //                             cancelText="Cancel"
    //                         >
    //                             <Button icon={<CloseOutlined />} type='primary' danger />
    //                         </Popconfirm>
    //                     </Tooltip>
    //                 </Space>
    //             ) : (<>
    //                 {
    //                     record.status === 'POSTED'
    //                         ? (<></>)
    //                         : (<Space>
    //                             <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
    //                                 <Tooltip title='Edit'>
    //                                     <Button className='bg-[#3b0764]' disabled={editingKey !== '' || record.status === 'PENDING'} onClick={() => edit(record)} type='primary' icon={<MdEditSquare />} />
    //                                 </Tooltip>
    //                             </ConfigProvider>
    //                             {
    //                                 record.status === 'PENDING' || record.status === 'FOR BANK APPROVAL' || record.status === 'FOR CONFIRMATION' ||
    //                                     record.status === 'SUSPECT' || record.status === 'REJECTED' || record.status === 'DISAPPROVED' || 'QUEUED'
    //                                     ? (<></>)
    //                                     : (<Tooltip title='Delete'>
    //                                         <Popconfirm
    //                                             title="Are you sure you want to delete this record?"
    //                                             onConfirm={() => {
    //                                                 Delete(record.key)
    //                                             }}
    //                                             okText="Yes"
    //                                             cancelText="Cancel"
    //                                         >
    //                                             <Button disabled={editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
    //                                         </Popconfirm>
    //                                     </Tooltip>)
    //                             }
    //                         </Space>)
    //                 }
    //             </>);
    //         },
    //     },
    // ];

    return (
        <div className='w-full flex flex-row'>
            <Tabs
                tabPosition="top"
                type="card"
                size="small"
                items={[
                    {
                        label: "Create Batch",
                        key: 1,
                        children:  
                        <>
                        <div className='flex flex-row'>
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
                        </div>
                        <Table/>
                        </>
                    },
                    {
                        label: "Generate",
                        key: 2,
                        children: <div>HII</div>,
                    },
                    {
                        label: "History",
                        key: 3,
                        children: <div>HII</div>,
                    },
                ]}
            />
        </div>
    )
}

export default Generation