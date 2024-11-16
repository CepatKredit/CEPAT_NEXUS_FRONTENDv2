import React, { useEffect } from 'react';
import { Form, Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, message, Spin } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import moment from 'moment';
import axios from 'axios';
import { toDecrypt, toUpperText } from '@utils/Converter';
import SectionHeader from '@components/validation/SectionHeader';
import { GetData } from '@utils/UserData';
import { LoanApplicationContext } from '@context/LoanApplicationContext';


function OtherLoanHistory({ data, User }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const [getInfo, setInfo] = React.useState({
        LoanAppId: '',
        key: '',
        Loan: '',
        Amount: '',
        Amortization: '',
        Remarks: '',

    });

    const [getStat, setStat] = React.useState(true);
    const role = GetData('ROLE').toString();
    React.useEffect(() => { getOtherLoanHistory.refetch() }, [data.loanIdCode]);

    const getOtherLoanHistory = useQuery({
        queryKey: ['getOtherLoanHistory'],
        queryFn: async () => {
            const sidcDecrypted = toDecrypt(localStorage.getItem('SIDC'));
            //  console.log("Decrypted SIDC:", sidcDecrypted);
            try {
                const result = await axios.get(`/getOtherLoanHistory/${toDecrypt(localStorage.getItem('SIDC'))}`);
                // console.log("Other Loan HIstory:", result);
                let dataList = [{
                    key: 0,
                    no: '',
                    Loan: '',
                    Amount: '',
                    Amortization: '',
                    Remarks: '',
                }];
                result.data.list?.map((x, i) => {
                    dataList.push({
                        key: x.id,
                        no: i + 1,
                        Loan: x.loan,
                        Amount: x.amount,
                        Amortization: x.amortization,
                        Remarks: x.remarks,
                    });
                });
                SET_LOADING_INTERNAL('CreditHistoryTABLE', false);
                return dataList;
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('CreditHistoryTABLE', false);
            }
            return null;
        },
        refetchInterval: (data) => {
            return data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    });


    React.useEffect(() => {
        if (!data.loanIdCode) {
            SET_LOADING_INTERNAL('CreditHistoryTABLE', true)
            getOtherLoanHistory.refetch();
        }
    }, [data]);


    const [getAddStat, setAddStat] = React.useState(false)



    async function onClickSave() {

        setStat(false);

        const row = await form.validateFields();
        const data = {
            LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
            OtherLoan: row.loan,
            OtherAmount: row.amount,
            OtherAmortization: row.amortization,
            OtherRemarks: row.remarks,
            RecUser: jwtDecode(token).USRID
        }
        //   console.log(data)
        await axios.post('/addLoanHistory', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getOtherLoanHistory'] }, { exact: true });
                    setStat(true);
                    setAddStat(false);
                    setEditingKey('');
                    setInfo({
                        Loan: '',
                        Amount: '',
                        Amortization: '',
                        Remarks: '',
                    });
                }
            })
            .catch((error) => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message,
                });
            })

    }

    async function onClickEdit() {
        try {
            const row = await form.validateFields();
            const data = {
                Id: editingKey,
                OtherLoan: row.loan,
                OtherAmount: row.amount,
                OtherAmortization: row.amortization,
                OtherRemarks: row.remarks,
                ModUser: jwtDecode(token).USRID
            };
            //  console.log('Data to be sent to the server:', data);
            const result = await axios.post('/editOtherLoanHistory', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getOtherLoanHistory'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    key: '',
                    Loan: '',
                    Amount: '',
                    Amortization: '',
                    Remarks: '',
                });
            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message,
            });
        }
    }

    async function onClickDelete(e) {
        try {
            const result = await axios.post(`/DeleteOtherLoanHistory/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getOtherLoanHistory'] }, { exact: true });
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            });
        }
    }
    function DISABLE_STATUS(LOCATION) {
        if (GetData('ROLE').toString() === '30' || GetData('ROLE').toString() === '40') {
            if (LOCATION === '/ckfi/credit-list' || LOCATION === '/ckfi/under-credit' || LOCATION === '/ckfi/approved'
                || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled'
                || LOCATION === '/ckfi/declined' || LOCATION === '/ckfi/for-re-application' || LOCATION === '/ckfi/assessement/credit') {
                console.log('MA')
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '20') {
            {
                if (LOCATION === '/ckfi/credit-list' || LOCATION === '/ckfi/under-credit' || LOCATION === '/ckfi/for-approval'
                    || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/for-re-application'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('LC')
                    return true
                }
                else { return false }
            }
        }
        else if (GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '55') {
            {
                if (LOCATION === '/ckfi/for-approval' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('CRA')
                    return true
                }
                else { return false }
            }
        }
        else if (GetData('ROLE').toString() === '60') {
            if (LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/queue-bucket' || LOCATION === '/ckfi/under-lp'
                || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                console.log('CRO')
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '70') {
            console.log('LPA')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '80') {
            console.log('LPO')
            if (LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else { return false }
    }

    const [getStatus, setStatus] = React.useState(false)
    React.useEffect(() => { setStatus(DISABLE_STATUS(localStorage.getItem('SP'))); }, [localStorage.getItem('SIDC')])

    const [form] = Form.useForm();
    const columns = [
        {
            title: (<div className="flex items-center">
                    {!DISABLE_STATUS(localStorage.getItem('SP')) && (
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Tooltip title='Add'>
                    <Button className='bg-[#3b0764]' type='primary' 
                        icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                        onClick={() => {
                            const record = { key: 0, loan: '', amount: '', amortization: '', remarks: '' }
                            edit(record)
                            setStat(false)
                            setEditingKey(0);
                            setAddStat(!getAddStat)
                            setInfo({
                                ...getInfo,
                                Loan: '',
                                Amount: '',
                                Amortization: '',
                                Remarks: '',
                            })
                        }} />

                </Tooltip>
            </ConfigProvider>
            )}
            </div>
        ),
            dataIndex: 'no',
            key: 'no',
            width: '5%',
            align: 'center'
        },
        {
            title: 'Other Loans',
            dataIndex: 'loan',
            key: 'loan',
            width: '20%',
            editable: true,
        },
        {
            title: 'Loan Approval',
            dataIndex: 'amount',
            key: 'amount',
            width: '15%',
            editable: true,
        },
        {
            title: 'Amortization',
            dataIndex: 'amortization',
            key: 'amortization',
            width: '15%',
            editable: true,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '25%',
            editable: true,
        },
        {
            hidden: DISABLE_STATUS(localStorage.getItem('SP')),
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            fixed: 'right',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (record.key === 0) {
                    return (
                        <Space>
                            <Tooltip title="Save">
                                <Button icon={<SaveOutlined />} type='primary' onClick={onClickSave} className='bg-[#2b972d]' />
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Button
                                    icon={<CloseOutlined />}
                                    type='primary'
                                    danger
                                    onClick={() => {
                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    );
                } else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                                <Button icon={<SaveOutlined />} type='primary' onClick={onClickEdit} className='bg-[#2b972d]'/>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Button
                                    icon={<CloseOutlined />}
                                    type='primary'
                                    danger
                                    onClick={() => {
                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    ) : (
                        <Space>
                            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                <Tooltip title='Edit'>
                                    <Button className='bg-[#3b0764]' disabled={ editingKey !== ''} onClick={() => {

                                        edit(record);
                                        setAddStat(!getAddStat);
                                    }}
                                        type='primary' icon={<MdEditSquare />} />
                                </Tooltip>
                            </ConfigProvider>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Are you sure you want to delete this record?"
                                    onConfirm={() => {
                                        onClickDelete(record.key);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button disabled={ editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    );
                }
            },
        },
    ];

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: record.key,
            loan: record.loan,
            amount: record.amount,
            amortization: record.amortization,
            remarks: record.remarks,
        })
        setEditingKey(record.key);
    };


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

    async function onChangeToUpper(e, pointer) {
        if (pointer === 'loan') { form.setFieldsValue({ 'loan': toUpperText(e) }) }
        else { form.setFieldsValue({ 'remarks': toUpperText(e) }) }
    }

    async function onChangeToUpper(value, pointer) {
        let formattedValue = value;

        if (pointer === 'amount' || pointer === 'amortization') {
            formattedValue = value.replace(/[^0-9.]/g, '');
            if (formattedValue.includes('.')) {
                const [integerPart, decimalPart] = formattedValue.split('.');
                formattedValue = integerPart + '.' + decimalPart.slice(0, 2);
            }
            formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            form.setFieldsValue({ [pointer]: formattedValue });
        } else {
            form.setFieldsValue({ [pointer]: toUpperText(value) });
        }
    }



    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = dataIndex === 'loan'
            ? (
                <>
                    <Input
                        className='w-[13.5rem]'
                        onChange={(e) => { onChangeToUpper(e.target.value, 'loan'); }}
                        placeholder='Other Loans' />
                </>
            )
            : dataIndex === 'amount'
                ? (
                    <>
                        <Input
                            className='w-[10rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'amount') }}
                            placeholder='Loan Approval' />
                    </>
                )
                : dataIndex === 'amortization'
                    ? (
                        <>
                            <Input
                                className='w-[10rem]'
                                onChange={(e) => { onChangeToUpper(e.target.value, 'amortization') }}
                                placeholder='Amortization' />

                        </>
                    )
                    : dataIndex === 'remarks'
                        ? (
                            <>
                                <Input
                                    className='w-[17.5rem]'
                                    onChange={(e) => { onChangeToUpper(e.target.value, 'remarks') }}
                                    placeholder='Remarks' />
                            </>
                        ) : null

        return (
            <td {...restProps}>
                {editing ? (<Form.Item name={dataIndex} style={{ margin: 0, }}
                    rules={
                        dataIndex !== 'remarks' ? [{ required: true, message: `Please Input ${title}` }] : []
                    }>
                    {inputNode}
                </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const dataOnly = Array.isArray(getOtherLoanHistory.data)
        ? getOtherLoanHistory.data.filter(x => x.key !== 0)
        : [];
    return (
        <div className='flex flex-col items-center'>
            {contextHolder}
            <div className='w-full px-2'>
                <div>
                    <center>
                        <SectionHeader title="Credit History of OFW / Seaman" />
                    </center>
                </div>
                <div className='mt-0'>
                    <Form form={form} component={false} >
                        <Table
                            columns={mergedColumns}
                            dataSource={
                                getStat === false
                                    ? getOtherLoanHistory.data?.map((x) => ({
                                        key: x.key,
                                        no: x.no,
                                        loan: x.Loan,
                                        amount: x.Amount,
                                        amortization: x.Amortization,
                                        remarks: x.Remarks,
                                    }))
                                    : dataOnly?.map((x) => ({
                                        key: x.key,
                                        no: x.no,
                                        loan: x.Loan,
                                        amount: x.Amount,
                                        amortization: x.Amortization,
                                        remarks: x.Remarks,
                                    }))
                            }
                            components={{ body: { cell: EditableCell } }}
                            rowClassName='editable-row'
                            pagination={false}
                            scroll={{ y: 200 }}
                        />
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default OtherLoanHistory;
