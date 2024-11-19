import * as React from 'react'
import { Button, Input, Select, Space, notification, Table, Form, Popconfirm, Tooltip, ConfigProvider } from 'antd'
import { CloseOutlined, EditFilled, SaveOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST } from "@api/base-api/BaseApi";
import axios from 'axios';
import { AvailableModal } from "@hooks/ModalController";
import { AvailableDisbursementList } from '@hooks/DisbursementData';
import { jwtDecode } from 'jwt-decode';
import { useDataContainer } from '@context/PreLoad';
import ResponsiveModal from '@components/global/ResponsiveModal';
import AvailableList from '@containers/bankGeneration/AvailableList';
import { render } from 'react-dom';
import { MdEditSquare } from 'react-icons/md';

function BatchedDisbursement({ BID, Data, FileName }) {

    const { modalStatus, setStatus } = AvailableModal()
    React.useEffect(() => { getDisbursementList.refetch(); }, [BID])
    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();
    const { getBank, getPurpose } = useDataContainer()

    const [getTotal, setTotal] = React.useState({
        Amount: 0,
        Count: 0
    })

    const getDisbursementList = useQuery({
        queryKey: ['BatchedDisbursementListQuery', BID],
        queryFn: async () => {
            let container = 0
            let counter = 0
            const result = await GET_LIST(`/getBatchedDisbursement/${BID}`)
            result.list?.map((x) => { container += parseFloat(x.amount); counter += 1; })
            LoadData()
            setTotal({ ...getTotal, Amount: container, Count: counter })
            return result.list
        },
        enabled: true
    })

    const { SetList, SetTotalAmount, SetTotalCount } = AvailableDisbursementList()

    const GetDisbursementListQuery = useQuery({
        queryKey: ["GetAvailabletListQuery"],
        queryFn: async () => {
            const result = await GET_LIST(`/availableList`)
            let container = []
            result.list?.map((x) => {
                container.push({
                    id: x.id,
                    lan: x.lan,
                    paymentType: x.paymentType,
                    firstName: x.firstName,
                    lastName: x.lastName,
                    bankName: x.bankName,
                    bankAcctNo: x.bankAcctNo,
                    amount: x.amount,
                    type: x.type,
                    status: x.status,
                    purpose: x.purpose,
                    traceId: x.traceId,
                    batchId: x.batchId,
                    checker: false
                })
            })
            return container
        },
        enabled: true,
    });


    function LoadData() {
        GetDisbursementListQuery.refetch()
        let container = []
        GetDisbursementListQuery.data?.map((x) => {
            if (Data.BT === '' || Data.PC === '') { container = [] }
            else {
                if (Data.BT === 'All' && Data.PC === x.paymentType) { container.push(x) }
                else {
                    if (Data.BT === x.type && Data.PC === x.paymentType) { container.push(x) }
                }
            }
        })
        SetList(container)
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

    const token = localStorage.getItem('UTK');
    async function Remove(data) {
        const container = {
            BID: BID,
            DID: data.key,
            COUNT: getTotal.Count - 1,
            AMT: parseFloat(getTotal.Amount) - parseFloat(removeCommas(data.amount)),
            USR: jwtDecode(token).USRID
        }
        await axios.post('/removeFromBatchList', container)
            .then((result) => {
                getDisbursementList.refetch()
                queryClient.invalidateQueries({ queryKey: ['BatchedDisbursementListQuery', BID] }, { exact: true })
                setTotal({
                    ...getTotal,
                    Amount: parseFloat(getTotal.Amount) - parseFloat(removeCommas(data.amount)),
                    Count: getTotal.Count - 1
                })
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

    async function UpdateStatus(id, status, lan) {
        if (!status) return setEditingKey('');
        console.log('check ', lan, id)
        //console.log(`/updateStatDisbursement/${id}/${jwtDecode(token).USRID}/${status}`)
        await axios.post(`/updateStatDisbursement/${id}/${jwtDecode(token).USRID}/${status}/${lan}`)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })
                queryClient.invalidateQueries({ queryKey: ['BatchedDisbursementListQuery', BID] }, { exact: true })
                setEditingKey('')
            })
            .catch((error) => {
                console.log(error)
            })
        /*
                await axios.post(`/getDisbursementList/${lan}/NP`)
                    .then((result) => {
                        result.data?.every((x) => x.status === "POSTED")
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
                        })
                        queryClient.invalidateQueries({ queryKey: ['BatchedDisbursementListQuery', BID] }, { exact: true })
                        setEditingKey('')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                if(getDisbursementList.data?.every((x) => x.status === "POSTED") || false){
                    const data ={
                        LAN: '',
                        LoanAppId:'',
                        Status: 22, //RELEASE
                        UrgentApp: '',
                        RemarksIn: '',
                        RemarksEx: '',
                        SoaDate: '',
                        ModUser: jwtDecode(token).USRID,
                    }
                    await axios.post(`/updateApplicationStatus`,data)
                    .then((result) => {
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
                        })
                        queryClient.invalidateQueries({ queryKey: ['BatchedDisbursementListQuery', BID] }, { exact: true })
                        setEditingKey('')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                }
                */
    }

    const [editingKey, setEditingKey] = React.useState('');
    const [getStat, setStat] = React.useState('');

    const columns = [
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
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            align: 'center',
            width: '200px',
        },
        {
            title: 'Payment Type',
            dataIndex: 'paymentType',
            align: 'center',
            width: '100px',
        },
        {
            title: 'Bank Name',
            dataIndex: 'bankName',
            align: 'center',
            width: '250px',
            ellipsis: true,
        },
        {
            title: 'Bank Account Number',
            dataIndex: 'bankAcctNo',
            align: 'center',
            width: '150px',
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            align: 'center',
            width: '150px',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            align: 'center',
            width: '80px',
            fixed: 'right',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
            width: '150px',
            fixed: 'right',
            render: (_, record) => {
                return (<>
                    {record.status === 'QUEUED' && editingKey === record.key
                        ? (<Select
                            className={'w-full'}
                            placeholder={'Select Status'}
                            onChange={(value) => setStat(value)}
                            value={getStat}
                            options={[{ label: 'POSTED', value: 'POSTED' }, { label: 'DISAPPORVED', value: 'DISAPPORVED' },
                            { label: 'REJECTED', value: 'REJECTED' }, { label: 'SUSPECT', value: 'SUSPECT' },
                            { label: 'FOR CONFIRMATION', value: 'FOR CONFIRMATION' },
                            { label: 'FOR BANK APPROVAL', value: 'FOR BANK APPROVAL' }]}
                        />) : record.status}
                </>)
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: '80px',
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                return (<>
                    {
                        record.status === 'PENDING'
                            ? (<Tooltip title='Remove'>
                                <Popconfirm
                                    title="Are you sure you want to remove this record?"
                                    onConfirm={() => {
                                        Remove(record)
                                    }}
                                    okText="Yes"
                                    cancelText="Cancel"
                                >
                                    <Button icon={<CloseOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>)
                            : record.status === 'QUEUED' && editingKey != record.key
                                ? (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                    <Tooltip title='Edit'>
                                        <Button className='bg-[#3b0764]'
                                            onClick={() => setEditingKey(record.key)}
                                            type='primary'
                                            icon={<MdEditSquare />} />
                                    </Tooltip>
                                </ConfigProvider>)
                                : record.status === 'QUEUED' && editingKey == record.key ?
                                    (<Space>
                                        <Tooltip title="Save">
                                            <Popconfirm
                                                title="Are you sure you want to cancel the edit?"
                                                onConfirm={() => { UpdateStatus(record.key, getStat, record.ln) }}
                                                okText="Yes"
                                                cancelText="Cancel"
                                            >
                                                <Button icon={<SaveOutlined />} type='primary' />
                                            </Popconfirm>
                                        </Tooltip>

                                        <Button icon={<CloseOutlined />} type='primary' onClick={() => { setEditingKey('') }} danger />

                                    </Space>)
                                    : (<></>)
                    }
                </>)
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

    const [getBatchInfo, setBatchInfo] = React.useState({
        CC: Data?.CC,
        FAN: Data?.FAN
    })

    async function updateBatch() {
        const container = {
            Id: BID,
            CompanyCode: getBatchInfo.CC,
            FundingAccountNumber: getBatchInfo.FAN
        }

        await axios.post('updateBatchDetails', container)
            .then((result) => {
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

    return (
        <>
            <ResponsiveModal showModal={modalStatus} closeModal={() => { setStatus(false); LoadData() }} modalTitle={<span>Add Disbursement</span>}
                modalWidth={'70rem'} contextHeight={'h-[30rem]'} contextInside={<AvailableList Data={Data} />} />
            {contextHolder}
            <div className='flex flex-row mb-2 px-2 gap-2'>
                <div>
                    <div className='w-[12rem]'>Company Code</div>
                    <div className='w-[12rem]'>
                        {/* <Input disabled={FileName} className='w-full' value={getBatchInfo.CC} onChange={(e) => { setBatchInfo({ ...getBatchInfo, CC: e.target.value }) }} /> */}
                        <h1><strong>CEPAT</strong></h1>
                    </div>
                </div>
                <div>
                    <div className='w-[12rem]'>Company Name</div>
                    <div className='w-[12rem]'>
                        {/* <Input disabled={FileName} className='w-full' value={Data?.CN} readOnly /> */}
                        <h1><strong>CEPAT KREDIT FINANCING INC</strong></h1>
                    </div>
                </div>
                <div>
                    <div className='w-[12rem]'>Funding Account Number</div>
                    <div className='w-[12rem]'>
                        {/* <Input disabled={FileName} className='w-full' value={getBatchInfo?.FAN} onChange={(e) => { setBatchInfo({ ...getBatchInfo, FAN: e.target.value }) }} /> */}
                        <h1><strong>0000-057309-503</strong></h1>
                    </div>
                </div>
                {/*UPDATE BUTTON */}
                {/* <Button disabled={FileName} className='mt-[1.4rem]' type='primary' onClick={() => { updateBatch(); LoadData() }}>Update</Button> */}
                <div>
                    <Button disabled={FileName} className='mt-[1.4rem]' type='primary' onClick={() => {
                        LoadData()
                        SetTotalAmount(parseFloat(getTotal.Amount))
                        SetTotalCount(parseInt(getTotal.Count))
                        setStatus(true)
                    }}>Add Disburse</Button>
                </div>
            </div>
            <Table
                dataSource={getDisbursementList.data?.map((x) => ({
                    key: x.id,
                    cn: `${x.type}${x.id}`,
                    ln: x.lan,
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
                scroll={{ y: 200, x: '100vw' }}
                rowClassName="editable-row"
                pagination={{ position: ['none', 'none'] }}
            />
        </>
    )
}


export default BatchedDisbursement