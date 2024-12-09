import * as React from 'react'
import { Input, Radio, Select, ConfigProvider, Button, Checkbox, Card, Tag, notification } from 'antd'
import { v4 as uuidv4 } from 'uuid';
import { SearchOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { AvailableModal } from "@hooks/ModalController";
import { AvailableDisbursementList } from '@hooks/DisbursementData';
import { toUpperText } from '@utils/Converter';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function AvailableList({ Data }) {

    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();
    const { modalStatus, setStatus } = AvailableModal()

    const { GetList, SetList, GetTotalAmount, SetTotalAmount, GetTotalCount, SetTotalCount } = AvailableDisbursementList()
    const [getValue, setValue] = React.useState({
        Total: '0.00',
        Count: 0
    })
    React.useEffect(() => { if (modalStatus === true) { LoadChecked() } }, [modalStatus])

    const [getTrigger, setTrigger] = React.useState(0)
    React.useEffect(() => { if (getTrigger === 1) { LoadChecked(); setTrigger(0) } }, [getTrigger])


    function onCheck(index) {
        const newData = GetList.map((x, i) => {
            if (i === index) { return { ...x, checker: !x.checker }; }
            return x
        })
        SetList(newData)
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

    function LoadChecked() {
        let total = 0.00
        let count = 0
        GetList.map((x) => { if (x.checker === true) { total += parseFloat(removeCommas(x.amount.toString())); count += 1 } })
        setValue({ ...getValue, Total: parseFloat(total), Count: count })
    }
    const [getSearch, setSearch] = React.useState("");

    const token = localStorage.getItem('UTK');
    async function SaveChanges() {
        let Total = 0
        let Count = 0
        GetList.map(async (x) => {
            if (x.checker === true) {
                Total += parseFloat(x.amount)
                Count += 1
                await axios.post(`/POST/P116UBD/${Data.key}/${jwtDecode(token).USRID}/${x.id} `)
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })

        Total += parseFloat(GetTotalAmount)
        Count += parseInt(GetTotalCount)

        const container = {
            BID: Data.key,
            COUNT: parseInt(Count),
            AMT: parseFloat(Total),
        }
        console.log(container)
        await axios.post('/POST/P118GAD', container)
            .then((result) => {
                SetTotalAmount(parseFloat(Total))
                SetTotalCount(parseInt(Count))
                queryClient.invalidateQueries({ queryKey: ['BatchedDisbursementListQuery', Data.key] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['GetBatchListQuery', jwtDecode(token).USRID] }, { exact: true })
                setStatus(false)
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

    return (
        <>
            {contextHolder}
            <div className="flex flex-rows bb-2 w-[14rem] absolute right-6">
                <Input className='w-[100%]'
                    addonAfter={<SearchOutlined />}
                    placeholder="Search"
                    onChange={(e) => {
                        setSearch(e.target.value.toUpperCase());
                    }}
                    value={getSearch} />
            </div>
            <div className='h-[25rem] overflow-y-auto'>
                <div className='flex flex-row'>
                    <div className='pt-2 flex flex-row flex-wrap justify-center item-center'>
                        {GetList?.map((x, i) =>
                        (<Card size='small' className='h-[8rem] w-[16.5rem] m-1' hoverable key={uuidv4()} onClick={() => { onCheck(i) }}>
                            <Card.Meta title={(<div className='text-sm' key={uuidv4()}><Checkbox key={uuidv4()} checked={x.checker} onClick={() => { onCheck(i) }}>
                                {x.type === 'NP'
                                    ? (<Tag color='blue'>Net Proceeds</Tag>)
                                    : (<Tag color='gold'>LC Commission</Tag>)}
                            </Checkbox><div className='pt-[.1rem] float-end'>{x.lan}</div></div>)}
                                description={(<div className='absolute right-3 text-right  font-bold text-xs'>
                                    <div className='text-black text-lg' key={uuidv4()}>{`${x.firstName} ${x.lastName} `}</div>
                                    <div className='text-emerald-500 text-lg' key={uuidv4()}>{formatNumberWithCommas(parseFloat(x.amount).toFixed(2).toString())}</div>
                                    <div key={uuidv4()}>{`${x.type}${x.id} `}</div>
                                </div>)} />
                        </Card>))}
                    </div>
                </div>
            </div>
            <center>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Button className='bg-[#3b0764] mt-5 w-[100px]' size='large' type='primary'
                        disabled={getValue.Count.toString() === '0'}
                        onClick={() => { SaveChanges() }}>Save</Button>
                </ConfigProvider>
            </center>
        </>
    )
}

export default AvailableList