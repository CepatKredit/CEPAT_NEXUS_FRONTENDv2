import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { GET_LIST } from '@api/base-api/BaseApi';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import { useDataContainer } from '@context/PreLoad';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, ConfigProvider, Form, Input, Popconfirm, Radio, Select, Space, Table, Tabs, Tooltip } from 'antd'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { MdEditSquare } from 'react-icons/md';
import BatchList from './bankGeneration/BatchList';
import { toDecrypt } from '@utils/Converter';
import NetProceedsGeneration from './NetProceedsGeneration';
import LCComissionGeneration from './LCComissionGeneration';
import DisbursementList from './disbursement/DisbursementList';

function Generation({data}) {
    const { getBank, getPurpose, GET_TOTAL_AMOUNT, GET_REFRESH_LAN, SET_REFRESH_LAN } = useDataContainer();
    const queryClient = useQueryClient();
    const [getDisburse, setDisburse] = React.useState({})
    const [editingKey, setEditingKey] = React.useState('');
    const [form] = Form.useForm();
    const { api } = React.useContext(LoanApplicationContext)
    const [GET_AMOUNT, SET_AMOUNT] = React.useState('')

    function formatNumberWithCommas(num) {
        if (!num) return '0.00';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    function GetPurposeDetails(container, command) {
        let data_container = ''
        getPurpose?.map((x) => {
            if (x.code === container || x.description === container) { data_container = x }
        })
        switch (command) {
            case 'CODE':
                return data_container.code
            default:
                return data_container.description
        }
    }

    function GetBankDetails(container, command) {
        let data_container = ''
        getBank?.map((x) => {
            if (x.code === container || x.description === container) { data_container = x }
        })
        switch (command) {
            case 'CODE':
                return data_container.code
            default:
                return data_container.description
        }
    }

    const handleLANSelect = (e, option) => {
        setDisburse((prevDetails) => ({
            ...prevDetails,
            LAN: e,
            loanAppId: option.loanAppId,
            approvedAmount: option.approvedAmount
        }))
    }


    const handleTypeRadio = (e) => {
        setDisburse((prevDetails) => ({
            ...prevDetails,
            type: e.target.value, 
        }))
    }

    const getDisbursementList = useQuery({
        queryKey: ['DisbursementListQuery', getDisburse.LAN, getDisburse.type],
        queryFn: async () => {
            const result = await GET_LIST(`/GET/G106DL/${getDisburse.LAN}/${getDisburse.type}`)
            return result.list
        },
        enabled: true
    })

    console.log("HAAA", getDisbursementList.data)

        
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: '',
            firstName: '',
            lastName: '',
            paymentType: '',
            bankName: '',
            bankAcctNo: '',
            amount: '',
            purpose: '',
            status: '',
            traceId: '',
            batchId: '',
            ...record,
        });
        SET_AMOUNT(removeCommas(record.amount))
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const token = localStorage.getItem('UTK');
    async function save(key) {
        try {
            const row = await form.validateFields();
            const container = {
                PaymentType: row.paymentType,
                FirstName: row.firstName,
                LastName: row.lastName,
                BankName: GetBankDetails(row.bankName, 'CODE'),
                BankAcctNo: row.bankAcctNo,
                Amount: parseFloat(removeCommas(row.amount)),
                Purpose: GetPurposeDetails(row.purpose, 'CODE'),
                Status: row.status,
                ModUser: jwtDecode(token).USRID,
                ID: key
            }

            await axios.post('/POST/P123UD', container)
                .then((result) => {
                    queryClient.invalidateQueries({ queryKey: ['DisbursementListQuery', getDisburse.LAN, getDisburse.type] }, { exact: true })
                    if (getDisburse.type === 'NP') {
                        SET_REFRESH_LAN(1);
                    }
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    })
                    setEditingKey('');
                })
                .catch((error) => {
                    console.log(error)
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }

    async function Delete(key) {
        await axios.post(`/POST/P124DD/${key}`)
            .then((result) => {
                queryClient.invalidateQueries({ queryKey: ['DisbursementListQuery', getDisburse.LAN, getDisburse.type] }, { exact: true })
                if (getDisburse.type === 'NP') {
                    SET_REFRESH_LAN(1);
                }
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })
            })
            .catch((error) => {
                console.log(error)
                api['error']({
                    message: 'Something went wrong',
                    description: error.message
                })
            })
    }

    const columns = [
        { title: 'Control No.', dataIndex: 'cn', align: 'center', width: '120px', fixed: 'left' },
        { title: 'First Name', dataIndex: 'firstName', align: 'center', editable: true, width: '200px' },
        { title: 'Last Name', dataIndex: 'lastName', align: 'center', editable: true, width: '200px' },
        { title: 'Payment Type', dataIndex: 'paymentType', align: 'center', editable: true, width: '150px' },
        { title: 'Bank Name', dataIndex: 'bankName', align: 'center', editable: true, width: '250px' },
        { title: 'Bank Account No.', dataIndex: 'bankAcctNo', align: 'center', editable: true, width: '200px' },
        { title: 'Purpose', dataIndex: 'purpose', align: 'center', editable: true, width: '200px' },
        {
            title: 'Amount',
            dataIndex: 'amount',
            align: 'right',
            editable: true,
            width: '150px',
            render: (text) => formatNumberWithCommas(text),
        },
        { title: 'Status', dataIndex: 'status', align: 'center', editable: true, width: '150px' },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            width: '200px',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Button type="primary" onClick={() => save(record.key)}>Save</Button>
                        <Button danger onClick={cancel}>Cancel</Button>
                    </Space>
                ) : (
                    <Space>
                        <Button
                            disabled={editingKey !== ''}
                            type="primary"
                            onClick={() => edit(record)}
                        >
                            Edit
                        </Button>
                        <Button danger onClick={() => Delete(record.key)}>Delete</Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <div className='w-[100rem] flex flex-row'>
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
                        <div className='flex flex-col'>
                        <div className='flex flex-row p-2'>
                            <Select 
                            options={data?.map((item) => ({
                                label: item.loanAppCode,
                                value: item.loanAppCode,
                                loanAppId: item.loanAppId,
                                approvedAmount: item.approvedAmount
                            }))}
                            value={getDisburse.LAN}
                            onChange={(value, option) => handleLANSelect(value, option)}
                            placeholder="Select Loan Application Code"
                            />
                            {getDisburse.type === "NP" ? (<NetProceedsGeneration getDisburse={getDisburse} data={data}/>) : 
                                (<LCComissionGeneration getDisburse={getDisburse} data={data}/>)}
                        </div>
                        <Radio.Group onChange={handleTypeRadio} value={getDisburse.type}>
                                    <Radio value={"NP"}>
                                        <span className="font-bold">NET PROCEEDS</span>
                                    </Radio>
                                    <Radio value={"LC"}>
                                        <span className="font-bold">LC COMMISSION</span>
                                    </Radio>
                        </Radio.Group>
                        </div>
                        <DisbursementList 
                        LAN={getDisburse.LAN} 
                        type={getDisburse.type} 
                        bankList={getBank} 
                        DisburseAmount={formatNumberWithCommas(parseFloat(getDisburse.approvedAmount).toFixed(2).toString())}
                        
                        />
                        {/* <Table 
                        className='w-90rem'
                        dataSource={getDisbursementList.data?.map((item) => ({
                            key: item.id,
                            cn: `${item.type}${item.id}`,
                            firstName: item.firstName,
                            lastName: item.lastName,
                            paymentType: item.paymentType,
                            bankName: GetBankDetails(item.bankName, 'DESCRIPTION'),
                            bankAcctNo: item.bankAcctNo,
                            amount: formatNumberWithCommas(parseFloat(item.amount).toFixed(2)),
                            purpose: GetPurposeDetails(item.purpose, 'DESCRIPTION'),
                            status: item.status,
                        }))}
                        columns={columns}
                        rowClassName={(record) => (record.status === 'POSTED' ? 'text-gray-500' : '')}
                        scroll={{
                            x: 'max-content', 
                            y: 400, 
                        }}
                        /> */}
                        </>
                    },
                    {
                        label: "Generate",
                        key: 2,
                        children: <BatchList/>,
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