import * as React from 'react'
import { Button, Input, Radio, Select, Space, notification } from 'antd'
import { useQueryClient } from '@tanstack/react-query';
import { generateKey } from '@utils/Generate';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DisbursementList from './DisbursementList';
import { useDataContainer } from '@context/PreLoad';

function LCCommission({ data }) {

    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();
    const [getData, setData] = React.useState({
        PaymentType: '',
        FirstName: '',
        LastName: '',
        BankName: '',
        BankAcctNo: '',
        Amount: '0.00',
        Type: 'LC',
        Purpose: '',
        Status: 'AVAILABLE',
    })

    const { getBank, getPurpose } = useDataContainer()

    function BankList() {
        let container = []
        getBank?.map((x) => { if (x.paymentType === getData.PaymentType) { container.push(x) } })
        return container
    }

    function GetBankCode(container) {
        const BankCode = getBank.find((x) => x.code === container || x.description === container)
        return BankCode.code
    }

    function GetPurposeCode(container) {
        const PurposeCode = getPurpose.find((x) => x.code === container || x.description === container)
        return PurposeCode.code
    }

    function truncateToDecimals(num, dec = 2) {
        const calcDec = Math.pow(10, dec);
        return Math.trunc(num * calcDec) / calcDec;
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

    function onChangeAmount(e) {
        let num = e.target.value.replace(/[^0-9.]/g, '');
        if (e.target.value === '.') { num = '' }
        else { num = e.target.value.replace(/[^0-9.]/g, ''); }
        const periodCount = num.split('.').length - 1;
        if (periodCount > 1) { num = num.slice(0, -1); }
        let container = ''
        if (truncateToDecimals(removeCommas(num)) >= 50000 && getData.PaymentType === 'INSTAPAY') { container = '50000.00' } else { container = num }
        setData({ ...getData, Amount: formatNumberWithCommas(container) })
    }

    function onBlurAmount(e) {
        if (e.target.value !== '') {
            let num = e.target.value.replace(/[^0-9.]/g, '');
            const periodCount = num.split('.').length - 1;
            if (periodCount > 1) { num = num.slice(0, -1); }

            let CommaFormat = formatNumberWithCommas(truncateToDecimals(num).toString())
            setData({ ...getData, Amount: CommaFormat })
        }
        else { setData({ ...getData, Amount: '' }) }
    }

    const token = localStorage.getItem('UTK');
    async function AddLC() {
        const container = {
            PaymentType: getData.PaymentType,
            FirstName: getData.FirstName,
            LastName: getData.LastName,
            BankName: GetBankCode(getData.BankName),
            BankAcctNo: getData.BankAcctNo,
            Amount: truncateToDecimals(removeCommas(getData.Amount)),
            Type: getData.Type,
            Purpose: GetPurposeCode(getData.Purpose),
            Status: getData.Status,
            TraceId: 'CKT' + data.LAN.props.children + generateKey(),
            RecUser: jwtDecode(token).USRID,
            Lan: data.LAN.props.children
        }

        await axios.post('/GroupPost/P122AD', container)
            .then((result) => {
                queryClient.invalidateQueries({ queryKey: ['DisbursementListQuery', data.LAN.props.children, 'LC'] }, { exact: true })
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })
                setData({
                    ...getData,
                    PaymentType: '',
                    FirstName: '',
                    LastName: '',
                    BankName: '',
                    BankAcctNo: '',
                    Amount: '0.00',
                    Type: 'LC',
                    Purpose: '',
                    Status: 'AVAILABLE'
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
        <div className='h-[10rem]'>
            {contextHolder}
            <div className='flex flex-row'>
                <div className='w-[29rem]'>
                    <div className='w-[15rem]'>
                        <Radio.Group onChange={(e) => {
                            setData({ ...getData, PaymentType: e.target.value });
                            if (parseFloat(removeCommas(getData.Amount)) >= 50000 && e.target.value === 'INSTAPAY') { setData({ ...getData, PaymentType: e.target.value, Amount: '50,000.00' }) }
                            else { setData({ ...getData, PaymentType: e.target.value }) }
                        }} value={getData.PaymentType}>
                            <Radio value={'INSTAPAY'}><span className='font-bold'>INSTAPAY</span></Radio>
                            <Radio value={'PESONET'}><span className='font-bold'>PESONET</span></Radio>
                        </Radio.Group>
                    </div>
                    <Space>
                        <div>
                            <div className='w-[15rem]'>Recipient First Name</div>
                            <div className='w-[15rem]'>
                                <Input className='w-full' disabled={!getData.PaymentType} value={getData.FirstName}
                                    onChange={(e) => { setData({ ...getData, FirstName: e.target.value }) }} />
                            </div>
                        </div>
                        <div>
                            <div className='w-[15rem]'>Recipient Last Name</div>
                            <div className='w-[15rem]'>
                                <Input className='w-full' disabled={!getData.PaymentType} value={getData.LastName}
                                    onChange={(e) => { setData({ ...getData, LastName: e.target.value }) }} />
                            </div>
                        </div>
                    </Space>
                    <Space>
                        <div>
                            <div className='w-[15rem]'>Bank Name</div>
                            <div className='w-[15rem]'>
                                <Select className='w-full' value={getData.BankName || undefined} disabled={!getData.PaymentType}
                                    options={BankList()?.map((x) => ({ label: x.description, value: x.description, emoji: x.code, desc: x.description }))}
                                    onChange={(e) => { setData({ ...getData, BankName: e }) }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='w-[15rem]'>Bank Account Number</div>
                            <div className='w-[15rem]'>
                                <Input className='w-full' disabled={!getData.PaymentType} value={getData.BankAcctNo}
                                    onChange={(e) => { setData({ ...getData, BankAcctNo: e.target.value }) }} />
                            </div>
                        </div>
                    </Space>
                    <Space>
                        <div>
                            <div className='w-[15rem]'>Purpose</div>
                            <div className='w-[15rem]'>
                                <Select className='w-full' value={getData.Purpose || undefined} disabled={!getData.PaymentType}
                                    options={getPurpose?.map((x) => ({ label: x.description, value: x.description }))}
                                    onChange={(e) => { setData({ ...getData, Purpose: e }) }}
                                />
                            </div>
                        </div>
                        <Space>
                            <div>
                                <div className='w-[10.6rem]'>Amount to Credit</div>
                                <div className='w-[10.6rem]'>
                                    <Input className='w-full' disabled={!getData.PaymentType} value={getData.Amount}
                                        onBlur={(e) => { onBlurAmount(e) }} onChange={(e) => { onChangeAmount(e) }} />
                                </div>
                            </div>
                            <Button disabled={!getData.FirstName || !getData.LastName || !getData.BankName || !getData.BankAcctNo || getData.Amount === '0.00' || !getData.Purpose}
                                className='mt-[1.6em]' type='primary' onClick={() => { AddLC() }}>Save</Button>
                        </Space>
                    </Space>
                </div>
                <div className='px-1 w-[70%]'>
                    <DisbursementList LAN={data.LAN.props.children} type={'LC'} />
                </div>
            </div>
        </div>
    )
}

export default LCCommission