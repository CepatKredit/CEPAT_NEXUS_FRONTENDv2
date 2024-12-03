import * as React from 'react'
import { Button, Input, Select, Space, notification, Table, Form, Popconfirm, Tooltip, ConfigProvider, Checkbox } from 'antd'
import { SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST } from "@api/base-api/BaseApi";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useDataContainer } from '@context/PreLoad';
import { toUpperText } from '@utils/Converter';

function DisbursementList({ LAN, type, DisburseAmount }) {

    React.useEffect(() => { getDisbursementList.refetch(); }, [LAN, type])
    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();

    const [selectedRows, setSelectedRows] = React.useState([]);

    function handleRowSelection(record, isChecked) {
        setSelectedRows((prev) => {
            if (isChecked) {
                // Add record to selectedRows
                return [...prev, record];
            } else {
                // Remove record from selectedRows
                return prev.filter((row) => row.key !== record.key);
            }
        });
    }

    async function SaveChanges() {
        let BID = toUpperText(uuidv4())
        const container = {
            Id: BID,
            PaymentChannel: "",
            BatchType: type,
            CompanyCode: getInfo.CODE,
            FundingAccountNumber: getInfo.FN,
            TotalNumberOfRecords:parseInt(getValue.Count),
            TotalAmountToDisburse: parseFloat(removeCommas(getValue.Total)),
            RecBy: jwtDecode(token).USRID
        }

        let check = 0

        await axios.post('/POST/P115ABL', container)
            .then((result) => {
                check = 1
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
        if (check === 1) {
            getData.map(async (x) => {
                if (x.checker === true) {
                    await axios.post(`/POST/P116UBD/${BID}/${jwtDecode(token).USRID}/${x.id}`)
                        .catch((error) => {
                            console.log(error)
                        })
                }
            })
            setInfo({ CODE: '', FN: '', TYPE: '', SELECT: '' })
            queryClient.invalidateQueries({ queryKey: ['GetBatchListQuery', jwtDecode(token).USRID] }, { exact: true })
            setStatus(false)
        }
    }

    console.log("MGA NA CHECKAN", selectedRows)

    const { getBank, getPurpose, GET_TOTAL_AMOUNT, GET_REFRESH_LAN, SET_REFRESH_LAN } = useDataContainer()

    React.useEffect(() => { ComputeRemaining() }, [GET_REFRESH_LAN, GET_TOTAL_AMOUNT])
    const [getRemaining, setRemaining] = React.useState('')
    function ComputeRemaining() {
        let value = parseFloat(removeCommas(DisburseAmount)) - parseFloat(removeCommas(GET_TOTAL_AMOUNT))
        setRemaining(value)
    }

    const getDisbursementList = useQuery({
        queryKey: ['DisbursementListQuery', LAN, type],
        queryFn: async () => {
            const result = await GET_LIST(`/GET/G106DL/${LAN}/${type}`)
            return result.list
        },
        enabled: true
    })

    
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

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = React.useState('');

    function formatNumberWithCommas(num) {
        if (!num) return '0.00';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    function removeCommas(num) {
        if (!num) return '0.00';
        return num.replace(/,/g, '');
    }

    const [GET_AMOUNT, SET_AMOUNT] = React.useState('')
    async function onChangeAmount(e, payment) {
        let num = e.target.value.replace(/[^0-9.]/g, '');
        if (e.target.value === '.') { num = '' }
        else { num = e.target.value.replace(/[^0-9.]/g, ''); }
        const periodCount = num.split('.').length - 1;
        if (periodCount > 1) { num = num.slice(0, -1); }
        let container = ''
        if (type === 'LC') {
            if (parseFloat(num) >= 50000 && payment === 'INSTAPAY') { container = '50000.00' } else { container = num }
            form.setFieldsValue({ 'amount': formatNumberWithCommas(container) })
        }
        else {
            if (parseFloat(num) >= parseFloat(GET_AMOUNT) && payment === 'PESONET' && getRemaining.toString() === '0') {
                form.setFieldsValue({ 'amount': formatNumberWithCommas(GET_AMOUNT.toString()) })
            }
            else if (parseFloat(num) >= parseFloat(GET_AMOUNT) && payment === 'INSTAPAY' && getRemaining.toString() === '0') {
                if (parseFloat(num) >= 50000 && parseFloat(GET_AMOUNT) >= 50000) {
                    form.setFieldsValue({ 'amount': formatNumberWithCommas('50000.00') })
                }
                else {
                    form.setFieldsValue({ 'amount': formatNumberWithCommas(GET_AMOUNT.toString()) })
                }
            }
            else {
                if (payment === 'INSTAPAY' && parseFloat(num) >= 50000 && parseFloat((parseFloat(GET_AMOUNT) + parseFloat(getRemaining))) >= 50000) {
                    form.setFieldsValue({ 'amount': formatNumberWithCommas('50,000.00') })
                }
                else if (payment === 'PESONET' && parseFloat(num) >= parseFloat((parseFloat(GET_AMOUNT) + parseFloat(getRemaining)))) {
                    form.setFieldsValue({ 'amount': formatNumberWithCommas(parseFloat((parseFloat(GET_AMOUNT) + parseFloat(getRemaining))).toString()) })
                }
                else {
                    form.setFieldsValue({ 'amount': formatNumberWithCommas(num.toString()) })
                }
            }
        }
    }

    function onBlurAmount(e) {
        if (e.target.value !== '') {
            let num = e.target.value.replace(/[^0-9.]/g, '');
            const periodCount = num.split('.').length - 1;
            if (periodCount > 1) { num = num.slice(0, -1); }

            let CommaFormat = formatNumberWithCommas(parseFloat(num).toFixed(2).toString())
            form.setFieldsValue({ 'amount': CommaFormat })
        }
        else { form.setFieldsValue({ 'amount': '0.00' }) }
    }

    const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        const getType = Form.useWatch('paymentType', form);
        const inputNode = dataIndex === 'firstName'
            ? record.status === 'FOR CONFIRMATION' || record.status === 'FOR BANK APPROVAL' || record.status === 'PENDING' || record.status === 'QUEUED'
                ? <span>{record.firstName}</span> : <Input />
            : dataIndex === 'lastName'
                ? record.status === 'FOR CONFIRMATION' || record.status === 'FOR BANK APPROVAL' || record.status === 'PENDING' || record.status === 'QUEUED'
                    ? <span>{record.lastName}</span> : <Input />
                : dataIndex === 'bankName'
                    ? record.status === 'FOR CONFIRMATION' || record.status === 'FOR BANK APPROVAL' || record.status === 'PENDING' || record.status === 'QUEUED'
                        ? <span>{record.bankName}</span> : <Select options={getBank?.filter((x) => x.paymentType.includes(getType))
                            .map((x) => ({ label: x.description, value: x.description, emoji: x.code, desc: x.description }))} />
                    : dataIndex === 'bankAcctNo'
                        ? record.status === 'FOR CONFIRMATION' || record.status === 'FOR BANK APPROVAL' || record.status === 'PENDING' || record.status === 'QUEUED'
                            ? <span>{record.bankAcctNo}</span> : <Input />
                        : dataIndex === 'paymentType'
                            ? record.status === 'FOR CONFIRMATION' || record.status === 'FOR BANK APPROVAL' || record.status === 'PENDING' || record.status === 'QUEUED'
                                ? <span>{record.paymentType}</span> : <Select options={[{ label: 'INSTAPAY', value: 'INSTAPAY' }, { label: 'PESONET', value: 'PESONET' }]} />
                            : dataIndex === 'amount'
                                ? record.status === 'FOR CONFIRMATION' || record.status === 'FOR BANK APPROVAL' || record.status === 'PENDING' || record.status === 'QUEUED'
                                    ? <span>{record.amount}</span> : <Input onChange={(e) => { onChangeAmount(e, getType) }} onBlur={(e) => { onBlurAmount(e) }} />
                                : dataIndex === 'purpose'
                                    ? record.status === 'FOR CONFIRMATION' || record.status === 'FOR BANK APPROVAL' || record.status === 'PENDING' || record.status === 'QUEUED'
                                        ? <span>{record.purpose}</span> : <Select options={getPurpose?.map((x) => ({ label: x.description, value: x.description }))} />
                                    : dataIndex === 'status'
                                        ? record.batchId === '' || record.status === 'DISAPPORVED' || record.status === 'REJECTED' || record.status === 'SUSPECT' || record.status === 'PENDING'
                                            || record.status === 'QUEUED'
                                            ? <span>{record.status}</span>
                                            : <Select options={[{ label: 'POSTED', value: 'POSTED' }, { label: 'DISAPPORVED', value: 'DISAPPORVED' },
                                            { label: 'REJECTED', value: 'REJECTED' }, { label: 'SUSPECT', value: 'SUSPECT' },
                                            { label: 'FOR CONFIRMATION', value: 'FOR CONFIRMATION' },
                                            { label: 'FOR BANK APPROVAL', value: 'FOR BANK APPROVAL' }]}
                                            />
                                        : <Input />
        return (
            <td {...restProps}>
                {editing
                    ? (<Form.Item name={dataIndex} style={{ margin: 0, }} rules={[
                        {
                            required: true,
                            message: `Please Input ${title}`,
                        },
                    ]} >
                        {inputNode}
                    </Form.Item>)
                    : (children)}
            </td>
        );
    };

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: '',
            firstName: '',
            lastName: '',
            // paymentType: '',
            bankName: '',
            bankAcctNo: '',
            // amount: '',
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
    async function Save(key) {
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
                    queryClient.invalidateQueries({ queryKey: ['DisbursementListQuery', LAN, type] }, { exact: true })
                    if (type === 'NP') {
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
                queryClient.invalidateQueries({ queryKey: ['DisbursementListQuery', LAN] }, { exact: true })
                if (type === 'NP') {
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
        // {
        //     title: 'Select Batch',
        //     dataIndex: 'cb',
        //     align: 'center',
        //     width: '100px',
        //     fixed: 'left',
        //     render: (_, record) => (
        //         <Checkbox
        //             checked={selectedRows.some((row) => row.key === record.key)}
        //             onChange={(e) => handleRowSelection(record, e.target.checked)}
        //         />
        //     ),
        // },
        {
            title: 'Control No.',
            dataIndex: 'cn',
            align: 'center',
            width: '100px',
            fixed: 'left',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            align: 'center',
            width: '200px',
            editable: true,
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            align: 'center',
            width: '200px',
            editable: true,
        },
        {
            title: 'Payment Type',
            dataIndex: 'paymentType',
            align: 'center',
            width: '100px',
            // editable: true,
        },
        {
            title: 'Bank Name',
            dataIndex: 'bankName',
            align: 'center',
            width: '250px',
            editable: true,
            ellipsis: true,
        },
        {
            title: 'Bank Account Number',
            dataIndex: 'bankAcctNo',
            align: 'center',
            width: '150px',
            editable: true,
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            align: 'center',
            width: '150px',
            editable: true,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            align: 'center',
            width: '80px',
            fixed: 'right',
            // editable: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
            width: '150px',
            fixed: 'right',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: '80px',
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Tooltip title="Save">
                            <Button onClick={() => { Save(record.key) }} icon={<SaveOutlined />} type='primary' />
                        </Tooltip>
                        <Tooltip title="Cancel">
                            <Popconfirm
                                title="Are you sure you want to cancel the edit?"
                                onConfirm={() => { cancel() }}
                                okText="Yes"
                                cancelText="Cancel"
                            >
                                <Button icon={<CloseOutlined />} type='primary' danger />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                ) : (<>
                    {
                        record.status === 'POSTED'
                            ? (<></>)
                            : (<Space>
                                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                    <Tooltip title='Edit'>
                                        <Button className='bg-[#3b0764]' disabled={editingKey !== '' || record.status === 'PENDING'} onClick={() => edit(record)} type='primary' icon={<MdEditSquare />} />
                                    </Tooltip>
                                </ConfigProvider>
                                {
                                    record.status === 'PENDING' || record.status === 'FOR BANK APPROVAL' || record.status === 'FOR CONFIRMATION' ||
                                        record.status === 'SUSPECT' || record.status === 'REJECTED' || record.status === 'DISAPPROVED' || 'QUEUED'
                                        ? (<></>)
                                        : (<Tooltip title='Delete'>
                                            <Popconfirm
                                                title="Are you sure you want to delete this record?"
                                                onConfirm={() => {
                                                    Delete(record.key)
                                                }}
                                                okText="Yes"
                                                cancelText="Cancel"
                                            >
                                                <Button disabled={editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                                            </Popconfirm>
                                        </Tooltip>)
                                }
                            </Space>)
                    }
                </>);
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            {contextHolder}
            <Form form={form} component={false} >
                <Table
                // className='w-[60rem]'
                    components={{ body: { cell: EditableCell } }}
                    dataSource={getDisbursementList.data?.map((x) => ({
                        key: x.id,
                        // cb: x,
                        cn: `${x.type}${x.id}`,
                        firstName: x.firstName,
                        lastName: x.lastName,
                        paymentType: x.paymentType,
                        bankName: GetBankDetails(x.bankName, 'DESCRIPTION'),
                        bankAcctNo: x.bankAcctNo,
                        amount: formatNumberWithCommas(parseFloat(x.amount).toFixed(2)),
                        purpose: GetPurposeDetails(x.purpose, 'DESCRIPTION'),
                        status: x.status,
                        traceId: x.traceId,
                        batchId: x.batchId
                    }))}
                    columns={mergedColumns}
                    scroll={{ y: 150, x: '100vw' }}
                    rowClassName="editable-row"
                    pagination={{ position: ['none', 'none'] }}
                />
            </Form>
        </>
    )
}

export default DisbursementList