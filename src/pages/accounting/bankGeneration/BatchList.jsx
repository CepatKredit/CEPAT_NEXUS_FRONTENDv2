import * as React from "react";
import { Typography, Button, Table } from "antd";
import { PathName } from "@utils/Conditions";
import { BatchModal } from "@hooks/ModalController";
import ResponsiveModal from "@components/global/ResponsiveModal";
import CreateBatch from "@containers/bankGeneration/CreateBatch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from 'jwt-decode';
import BatchedDisbursement from "./BatchedDisbursement";
import { mmddyy } from "@utils/Converter";
import dayjs from "dayjs";
import axios from "axios";
import { GET_LIST } from "@api/base-api/BaseApi";

function BatchList() {

    const columns = [
        {
            title: "",
            dataIndex: "a",
            key: "a",
            width: "5px",
            align: "center",
        },
        {
            title: "Batch Account Number",
            dataIndex: "BAN",
            key: "BAN",
            width: "80px",
            align: "center",
            sorter: (a, b) => { return a.BAN.localeCompare(b.BAN); },
            fixed: "left",
        },
        {
            title: "Batch Type",
            dataIndex: "BT",
            key: "BT",
            width: "40px",
            align: "center",
        },
        {
            title: "No. of Records",
            dataIndex: "NOR",
            key: "NOR",
            width: "40px",
            align: "center",
        },
        {
            title: "Total Amount to Disbursed",
            dataIndex: "TAD",
            key: "TAD",
            width: "80px",
            align: "center",
        },
        {
            title: "Payment Channel",
            dataIndex: "PC",
            key: "PC",
            width: "80px",
            align: "center",
        },
        {
            title: "Funding Account Number",
            dataIndex: "FAN",
            key: "FAN",
            width: "100px",
            align: "center",
        },
        {
            title: "Action",
            dataIndex: "ACTION",
            key: "ACTION",
            width: "50px",
            align: "center"
        }
    ];

    const { modalStatus, setStatus } = BatchModal()
    const queryClient = useQueryClient();
    const token = localStorage.getItem('UTK');
    const GetBatchList = useQuery({
        queryKey: ["GetBatchListQuery", jwtDecode(token).USRID],
        queryFn: async () => {
            const result = await GET_LIST(`/GroupGet/G101BL/${jwtDecode(token).USRID}`);
            return result.list;
        },
        enabled: true,
        refetchInterval: 60 * 1000,
        retryDelay: 1000,
        staleTime: 5 * 1000,
    });

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
    async function UpdateStatus(res,id,filename) {
        try {
            res.list.forEach(async (x) => {
                await axios.post(`/GroupPost/P125USD/${x.id}/${jwtDecode(token).USRID}/${'0'}/${'0'}`);
            });
            await axios.post(`/GroupPost/P126UFB/${id}/${filename}`);
        } catch (error) {
            console.log(error)
        }
        queryClient.invalidateQueries({ queryKey: ['BatchedDisbursementListQuery', id] }, { exact: true })
        GetBatchList.refetch()
    }

    async function genTextSBD(v,filename) {
        let result = [];
        try {
            result = await GET_LIST(`/GroupGet/G103BD/${v.id}`);
        } catch (error) {
            console.log('Catch ', error)
            return [];
        }

        if (result.length != 0 && v.paymentChannel === 'INSTAPAY') {
            const header = `BN00${v.batchNumber}${v.fundingAccountNumber.toString().padStart(13, '0')}${v.totalAmountToDisburse.toString().replaceAll('.', '').padStart(13, '0')}${v.totalNumberOfRecords.toString().padStart(4, '0')}\n`
            let content = '';
            result.list.forEach(x => {
                //console.log(x)
                const bank = x.bankName.trim();
                content += `10${bank}${x.bankAcctNo.toString().trim().padStart(16, '0')}${''.padStart(30, ' ')}${x.amount.toString().replaceAll('.', '').padStart(13, '0')}CEPAT KREDIT FINANCING INC.${''.padStart(43, ' ')}CEPAT KREDIT FINANCING INC.${''.padStart(47, ' ')}${x.firstName}${''.padStart(37, ' ')}${x.lastName}${''.padStart(124, ' ')}${/*x.city*/ 'PASIG CITY'}${''.padStart(124, ' ')}${x.traceId}\n\n\n`
            });
            //console.log(`${header}${content}`)
            UpdateStatus(result,v.id,filename)
            return `${header}${content}`
        } else if (result.length != 0 && v.paymentChannel === 'PESONET') {
            const header = `HDR${''.padStart(32, ' ')}PNETIMPTSETCPHMMXXX${v.totalNumberOfRecords.toString().replaceAll('.', '').padStart(8, '0')}${v.totalAmountToDisburse.toString().trim().replaceAll('.', '').padStart(16,'0')}${v.batchNumber.toString().trim().padStart(9,'0')}${''.padStart(32,' ')}\n`
            let content = '';
            console.log('TESt' ,result.list)
            result.list.forEach(x => {
                content += `${''.padStart(32,' ')}CKFPC${v.batchNumber.trim().padStart(9,'0')}${x.traceId.padStart(10,'0')}${''.padStart(11,' ')}NURGBONUPHP${x.amount.toString().replaceAll('.', '').padStart(16, '0')}SLEVCEPAT KREDIT FINANCE PASIG CITY${''.padStart(239, ' ')}PASIG CITY\nSETCPHMMXXX${v.fundingAccountNumber.padStart(35,'0')}${x.firstName} ${x.lastName}${''.padStart(126,' ')}PASIG CITY\n${x.bankName.padEnd(8,'X')}${''.padStart(2,' ')}12345678901234567890123456789012345${''.padStart(449,' ')}${x.traceId}\n`
            })
            const footer = `TRL${''.padStart(32, ' ')}${result.list.length.toString().padStart(8, '0')}${v.totalAmountToDisburse.toString().replaceAll('.','').padStart(16,'0')}`
            //console.log(`${header}${content}${footer}`)
            UpdateStatus(result,v.id,filename)
            return `${header}${content}${footer}`;
        } else {
            console.log('No data gathered')
        }
    }

    return (
        <div className="mx-[1%] my-[2%]">
            <ResponsiveModal showModal={modalStatus} closeModal={() => { setStatus(false) }} modalTitle={<span>Create Batch</span>}
                modalWidth={'75rem'} contextHeight={'h-[40rem]'} contextInside={<CreateBatch status={modalStatus} />} />
            <div className="flex flex-row gap-3">
                <Typography.Title level={2}>
                    {PathName(localStorage.getItem("SP"))}
                </Typography.Title>
            </div>
            <div className="flex flex-rows pb-2 float-end">
                <Button className='h-[2.5rem]' type='primary' onClick={() => { setStatus(true) }} >Create Batch</Button>
            </div>
            <Table
                size='small'
                columns={columns}
                scroll={{ y: 'calc(100vh - 505px)', x: '100%' }}
                dataSource={GetBatchList.data?.map((x) => ({
                    key: x.id,
                    CC: x.companyCode,
                    CN: x.companyName,
                    BAN: x.batchNumber,
                    BT: x.batchType,
                    NOR: x.totalNumberOfRecords,
                    TAD: formatNumberWithCommas(parseFloat(x.totalAmountToDisburse).toFixed(2).toString()),
                    PC: x.paymentChannel,
                    FAN: x.fundingAccountNumber,
                    ACTION: (!x.fileName? <Button onClick={async () => {
                        const Filename =(x.paymentChannel === 'INSTAPAY'? `${x.companyCode}_${mmddyy(dayjs()).replaceAll('-', '')}_${x.batchNumber}.txt`
                                            : x.paymentChannel === 'PESONET' ? `${x.companyName.split(' ').map((w) => w.charAt(0)).join('')}_${mmddyy(dayjs()).replaceAll('-', '')}_${x.batchNumber}.rmt` : null);
                        const textData = await genTextSBD(x,Filename);
                        const link = document.createElement('a');
                        link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(textData)}`;
                        link.download = Filename;
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }} type='link'>Generate</Button> : 'Generated'),
                    FN: x.fileName,
                }))}
                expandable={{
                    expandedRowRender: (data, num) =>
                    (<div className='h-[350px] px-5 overflow-y-auto'>
                        <BatchedDisbursement BID={data.key} Data={data} FileName={data.FN} />
                    </div>)
                }}
            />
        </div>
    )
}

export default BatchList