import * as React from 'react'
import { Input, Radio, Select, ConfigProvider, Button, Checkbox, Card, Tag, notification } from 'antd'
import { v4 as uuidv4 } from 'uuid';
import { SearchOutlined } from "@ant-design/icons";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { BatchModal } from "@hooks/ModalController";
import { toUpperText } from '@utils/Converter';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function CreateBatch() {

    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();
    const [getInfo, setInfo] = React.useState({
        CODE: 'CEPAT',
        FN: '0000-057309-503',
        TYPE: 'ALL',
        SELECT: ''
    })

    const { modalStatus, setStatus } = BatchModal()
    //React.useEffect(() => { if (modalStatus === true) { setInfo({ CODE: '', FN: '', TYPE: '', SELECT: '' }) } }, [modalStatus])

    const [getData, setData] = React.useState([])
    const GetDisbursementListQuery = useQuery({
        queryKey: ["GetDisbursementListQuery"],
        queryFn: async () => {
            const result = await GET_LIST(`/api/v1/GET/G102AL`)
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
        enabled: false,
    });

    React.useEffect(() => {
        GetDisbursementListQuery.refetch()
        let container = []
        GetDisbursementListQuery.data?.map((x) => {
            if (getInfo.SELECT === '' || getInfo.TYPE === '') { container = [] }
            else {
                if (getInfo.TYPE === 'All' && getInfo.SELECT === x.paymentType) { container.push(x) }
                else {
                    if (getInfo.TYPE === x.type && getInfo.SELECT === x.paymentType) { container.push(x) }
                }
            }
        })
        setData(container)
        setValue({ Total: '0.00', Count: 0 })
    }, [getInfo])

    const [getTrigger, setTrigger] = React.useState(0)
    React.useEffect(() => { if (getTrigger === 1) { LoadChecked(); setTrigger(0) } }, [getTrigger])

    function onCheck(index) {
        const newData = getData.map((x, i) => {
            if (i === index) { return { ...x, checker: !x.checker }; }
            return x
        })
        setData(newData)
        setTrigger(1)
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

    const [getValue, setValue] = React.useState({
        Total: '0.00',
        Count: 0
    })

    function LoadChecked() {
        let total = 0.00
        let count = 0
        getData.map((x) => { if (x.checker === true) { total += parseFloat(removeCommas(x.amount.toString())); count += 1 } })
        setValue({ ...getValue, Total: formatNumberWithCommas(parseFloat(total).toFixed(2).toString()), Count: count.toString() })
    }

    const [getSearch, setSearch] = React.useState("");
    const [getDrawer, setDrawer] = React.useState(false)

    const token = localStorage.getItem('UTK');
    async function SaveChanges() {
        let BID = toUpperText(uuidv4())
        const container = {
            Id: BID,
            PaymentChannel: getInfo.SELECT,
            BatchType: getInfo.TYPE,
            CompanyCode: getInfo.CODE,
            FundingAccountNumber: getInfo.FN,
            TotalNumberOfRecords:parseInt(getValue.Count),
            TotalAmountToDisburse: parseFloat(removeCommas(getValue.Total)),
            RecBy: jwtDecode(token).USRID
        }

        let check = 0

        await axios.post('/api/v1/POST/P115ABL', container)
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
                    await axios.post(`/api/v1/POST/P116UBD/${BID}/${jwtDecode(token).USRID}/${x.id}`)
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

    return (
        <>
            {contextHolder}
            <div className='flex flex-row gap-1'>
                <div>
                    <div className='w-[10rem]'>Company Code</div>
                    <div className='w-[10rem]'>
                        <Input className='w-full'
                        value={'CEPAT'} 
                        readOnly
                        /*value={getInfo.CODE}*/ 
                        /*onChange={(e) => { setInfo({ ...getInfo, CODE: e.target.value }) }}*/ />
                    </div>
                </div>
                <div>
                    <div className='w-[15rem]'>Company Name</div>
                    <div className='w-[15rem]'>
                        <Input className='w-full' value={'Cepat Kredit Financing Inc.'} readOnly />
                    </div>
                </div>
                <div>
                    <div className='w-[18rem]'>Funding Account Number</div>
                    <Input className='w-[18rem]' 
                    value={'0000-057309-503'} 
                    readOnly
                    // value={getInfo.FN} 
                    // onChange={(e) => { setInfo({ ...getInfo, FN: e.target.value }) }} 
                    />
                </div>
                <Radio.Group className='pt-[1.5rem] pl-4'
                    onChange={(e) => { setInfo({ ...getInfo, SELECT: e.target.value }); }} value={getInfo.SELECT}>
                    <Radio value={'INSTAPAY'}><span className='font-bold text-sm'>INSTAPAY</span></Radio>
                    <Radio value={'PESONET'}><span className='font-bold text-sm'>PESONET</span></Radio>
                </Radio.Group>
                <div className='pt-5'>
                    <Select allowClear
                        onChange={(e) => {
                            setInfo({ ...getInfo, TYPE: e === 'Net Proceeds' ? 'NP' : e === 'LC Commission' ? 'LC' : e });
                        }}
                        placeholder='Select Mode'
                        style={{ width: '14rem' }}
                        value={getData.TYPE || undefined}
                        options={[
                            { value: 'All', label: 'All' },
                            { value: 'Net Proceeds', label: 'Net Proceeds' },
                            { value: 'LC Commission', label: 'LC Commission' }
                        ]} />
                </div>
            </div>
            <div className='h-[2.5rem] py-2'>
                <div className='flex flex-row'>
                    <div className='pt-1 pr-1 font-bold'>Total Amount: </div>
                    <Input className='w-[10rem]' value={getValue.Total} readOnly />
                    <div className='pt-1 pl-2 pr-1 font-bold'>No. of Records: </div>
                    <Input className='w-[3rem]' value={getValue.Count} readOnly />
                    <Button hidden className='ml-2' type='primary' onClick={() => { setDrawer(!getDrawer) }}>{!getDrawer ? 'Show List' : 'Hide List'}</Button>
                    <div className="flex flex-rows bb-2 w-[14rem] absolute right-6">
                        <Input className='w-[100%]'
                            addonAfter={<SearchOutlined />}
                            placeholder="Search"
                            onChange={(e) => {
                                setSearch(e.target.value.toUpperCase());
                            }}
                            value={getSearch} />
                    </div>
                </div>
            </div>
            <div className='h-[30rem] overflow-y-auto'>
                <div className='flex flex-row'>
                    <div className='pt-2 flex flex-row flex-wrap justify-center item-center'>
                        {getData?.map((x, i) =>
                        (<Card size='small' className='h-[8rem] w-[16.5rem] m-1' hoverable key={uuidv4()} onClick={() => { onCheck(i) }}>
                            <Card.Meta title={(<div className='text-sm' key={uuidv4()}><Checkbox key={uuidv4()} checked={x.checker} onClick={() => { onCheck(i) }}>
                                {x.type === 'NP'
                                    ? (<Tag color='blue'>Net Proceeds</Tag>)
                                    : (<Tag color='gold'>LC Commission</Tag>)}
                            </Checkbox><div className='pt-[.1rem] float-end'>{x.lan}</div></div>)}
                                description={(<div className='absolute right-3 text-right  font-bold text-xs'>
                                    <div className='text-black text-lg' key={uuidv4()}>{`${x.firstName} ${x.lastName}`}</div>
                                    <div className='text-emerald-500 text-lg' key={uuidv4()}>{formatNumberWithCommas(parseFloat(x.amount).toFixed(2).toString())}</div>
                                    <div key={uuidv4()}>{`${x.type}${x.id}`}</div>
                                </div>)} />
                        </Card>))}
                    </div>
                    {/*!getDrawer ? (<></>)
                    : (<motion.aside initial={{ width: 0 }} animate={{ width: '50rem' }} className='w-[50rem] h-[15rem]'>
                        <Card size='small' title={'List of records'} className='h-[27rem] mt-2.5'>
                            <div className='h-[23rem] overflow-y-auto'>
                                {getContainer?.map((x, i) =>
                                (<Card size='small' className='h-[7.5rem] w-[50rem] m-1' key={uuidv4()}>
                                    <Card.Meta title={(<div className='text-sm' key={uuidv4()}>
                                        <Button className='float-start font-bold h-[1rem]' type='link'>edit</Button>
                                        <div className='float-end font-bold'>{x.LAN}</div>
                                    </div>)}
                                        description={(<div className='absolute right-3 text-right  font-bold text-xs'>
                                            <div className='text-black text-sm' key={uuidv4()}>{`${x.RFN} ${x.RLN}`}</div>
                                            <div className='text-emerald-500' key={uuidv4()}>{x.ATC}</div>
                                            {x.ST === 'Net Proceeds'
                                                ? (<Tag color='blue'>{x.ST}</Tag>)
                                                : (<Tag color='gold'>{x.ST}</Tag>)}
                                            <div key={uuidv4()}>{x.CTR}</div>
                                        </div>)} />
                                </Card>))}
                            </div>
                        </Card>
                    </motion.aside>)*/}
                </div>
            </div>
            <center>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Button className='bg-[#3b0764] mt-5 w-[100px]' size='large' type='primary'
                        disabled={getValue.Count.toString() === '0' || !getInfo.CODE || !getInfo.FN || !getInfo.SELECT || !getInfo.TYPE}
                        onClick={() => { SaveChanges() }}>Save</Button>
                </ConfigProvider>
            </center>
        </>
    )
}

export default CreateBatch