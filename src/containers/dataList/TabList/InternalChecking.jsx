import * as React from 'react'
import { Space, ConfigProvider, Tabs, notification, Button, Spin } from 'antd'
import LabeledInput from '@components/marketing/LabeledInput'
import ResponsiveTable from '@components/validation/ResponsiveTable'
import StatusRemarks from './StatusRemarks';
import SectionHeader from '@components/validation/SectionHeader'
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { mmddyy, toDecrypt } from '@utils/Converter';
import dayjs from 'dayjs';
import UploadRecord from './internalChecking/UploadRecord';
import { generateKey } from '@utils/Generate';
import LabelDisplay from '@components/marketing/LabelDisplay';
import { LoanApplicationContext } from '@context/LoanApplicationContext';


function InternalChecking({ classname, User, data, ClientId, Uploader, activeKey, sepcoborrowfname }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext)
    const [isEdit, setEdit] = React.useState(false);
    const columns = [
        {
            title: '#',
            dataIndex: 'num',
            key: 'num',
            width: '50px',
        },
        {
            title: 'First Name',
            dataIndex: 'fname',
            key: 'fname',
            width: '200px',
        },
        {
            title: 'Middle Name',
            dataIndex: 'mname',
            key: 'mname',
            width: '200px',
        },
        {
            title: 'Last Name',
            dataIndex: 'lname',
            key: 'lname',
            width: '200px',
        },
        {
            title: 'Suffix',
            dataIndex: 'suffix',
            key: 'suffix',
            width: '200px',
        },
        {
            title: 'Birthdate',
            dataIndex: 'bday',
            key: 'bday',
            width: '200px',
        },
        {
            title: 'Deceased',
            dataIndex: 'deceased',
            key: 'deceased',
            width: '100px',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '200px',
        },
        {
            title: 'URL / Notes',
            dataIndex: 'urlNotes',
            key: 'urlNotes',
            width: '200px',
            ellipsis: true,
        },
        {
            title: 'DTAG',
            dataIndex: 'dtag',
            key: 'dtag',
            width: '80px',
        },
        {
            title: 'Subject',
            dataIndex: 'subj',
            key: 'subj',
            width: '200px',
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            width: '80px',
        },
        {
            title: 'Jurisdiction',
            dataIndex: 'jurisdiction',
            key: 'jurisdiction',
            width: '200px',
        },
        {
            title: 'Checked By',
            dataIndex: 'ckby',
            key: 'ckby',
            width: '250px',
        },
        {
            title: 'Checked Date',
            dataIndex: 'ckdate',
            key: 'ckdate',
            width: '200px',
        },
    ]

    const USRNAME = toDecrypt(localStorage.getItem('USRFN'));
    const [api, contextHolder] = notification.useNotification();
    const [gettrigger, settrigger] = React.useState(true)
    const [get, set] = React.useState({
        ofw: null,
        beneficiary: null,
        coborrow: null,
    })

    async function getKaiser() {
        const data1 = {
            FullName: `${data.ofwfname} ${data.ofwlname}`,
            IsOfw: 1,
            LoanAppId: data.loanIdCode,
            ModUser: USRNAME,
        }
        const data2 = {
            FullName: `${data.benfname} ${data.benlname}`,
            IsOfw: 2,
            LoanAppId: data.loanIdCode,
            ModUser: USRNAME,
        }
        const data3 = {
            FullName: `${data.coborrowfname} ${data.coborrowlname}`,
            IsOfw: 3,
            LoanAppId: data.loanIdCode,
            ModUser: USRNAME,
        }

        const requests = [
            axios.post(`/GET/G18K/`, data1),
            axios.post(`/GET/G18K/`, data2),
            axios.post(`/GET/G18K/`, data3)
        ];
        try {
            const results = await Promise.allSettled(requests);
            console.log(results[0], results[1], results[2])
            const ofwData = results[0].status === 'fulfilled' && !results[0].value.error ? results[0].value.data.list : [];
            const beneficiaryData = results[1].status === 'fulfilled' && !results[1].value.error ? results[1].value.data.list : [];
            const coborrowData = results[2].status === 'fulfilled' && !results[2].value.error ? results[2].value.data.list : [];
            console.log('Done Fetching Kaiser API...')
            set(prevState => ({
                ...prevState,
                ofw: ofwData,
                beneficiary: beneficiaryData,
                coborrow: coborrowData,
            }));
            settrigger(false);
            SET_LOADING_INTERNAL('KaiserOFW', false);
            return {
                ofw: ofwData,
                beneficiary: beneficiaryData,
                coborrow: coborrowData,
            };
        } catch (error) {
            console.log(error)
            return {
                ofw: [],
                beneficiary: [],
                coborrow: [],
            };
        }
    }

    function genKaiser() {
        if (data.loanIdCode !== '') {
            if (data.benfname.trim() !== '' || data.benlname.trim() !== '') {
                SET_LOADING_INTERNAL('KaiserOFW', true);
                getKaiser();
            } else {
                api['warning']({
                    message: 'Missing Beneficiary Name',
                    description: 'Please Fill the Beneficiary Name First',
                });
            }
        }
    }

    const items = [
        {
            key: '1',
            label: 'Kaiser Check',
            children: (<>
                <center>
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button  loading={onClickKaiser.isPending} size='large' className='mb-2 bg-[#3b0764]' type='primary' onClick={() => { genKaiser() }}  >Load Kaiser</Button>
                    </ConfigProvider>
                </center>
                {
                    data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL'
                        ? (<div>
                            <center>
                                <div className='mb-[3%]'>
                                    <SectionHeader title="OFW" tag={'Principal Borrower'} />
                                    <Space>
                                        <LabelDisplay label={'First Name'} readOnly={true} value={data.ofwfname || 'NO RECORDS FOUND'} />
                                        <LabelDisplay label={'Last Name'} readOnly={true} value={data.ofwlname || 'NO RECORDS FOUND'} />
                                    </Space>
                                </div>
                            </center>
                            <div className='h-[400px]' key={generateKey()}>
                                <div className='mt-2 px-2 w-full'>
                                    <ResponsiveTable
                                        columns={columns}
                                        height={300}
                                        width={400}
                                        rows={get.ofw ? get.ofw.map((x, i) => ({
                                            key: generateKey(),
                                            num: i + 1,
                                            fname: x.firstname?.toUpperCase() || 'NO RECORDS FOUND',
                                            mname: x.midname?.toUpperCase() || 'NO RECORDS FOUND',
                                            lname: x.lastname?.toUpperCase() || 'NO RECORDS FOUND',
                                            suffix: x.suffix?.toUpperCase() || 'NO RECORDS FOUND',
                                            bday: x.bday ? mmddyy(x.bday) : 'NO RECORDS FOUND',
                                            deceased: x.deceased?.toUpperCase() || 'NO RECORDS FOUND',
                                            category: x.category?.toUpperCase() || 'NO RECORDS FOUND',
                                            urlNotes: x.notes?.toUpperCase() || 'NO RECORDS FOUND',
                                            dtag: x.dtag?.toUpperCase() || 'NO RECORDS FOUND',
                                            subj: x.subject?.toUpperCase() || 'NO RECORDS FOUND',
                                            score: x.score || 'NO RECORDS FOUND',
                                            jurisdiction: x.jurisdiction || 'NO RECORDS FOUND',
                                            ckby: x.checkedBy || USRNAME,
                                            ckdate: x.checkedDate || mmddyy(dayjs()),
                                        }))
                                            : []}
                                        locale={get.ofw && get.ofw.length === 0 ? { emptyText: 'No Record Found' } : {}}
                                    />
                                    {/*  {emptyRows && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 text-gray-600">
                                            No data available
                                        </div>
                                    )}*/}
                                </div>
                            </div>
                            <center>
                                <div className='mb-[3%]'>
                                    <SectionHeader title="Beneficiary" tag={'Co-Borrower'} />
                                    <Space>
                                        <LabelDisplay label={'First Name'} readOnly={true} value={data.benfname || 'NO RECORDS FOUND'} />
                                        <LabelDisplay label={'Last Name'} readOnly={true} value={data.benlname || 'NO RECORDS FOUND'} />
                                    </Space>
                                </div>
                            </center>
                            <div className='h-[400px]' key={generateKey()}>
                                <div className='mt-2 w-full px-2'>
                                    <ResponsiveTable
                                        columns={columns}
                                        height={300}
                                        width={400}
                                        rows={get.beneficiary ? get.beneficiary.map((x, i) => ({
                                            key: generateKey(),
                                            num: i + 1,
                                            fname: x.firstname?.toUpperCase() || 'NO RECORDS FOUND',
                                            mname: x.midname?.toUpperCase() || 'NO RECORDS FOUND',
                                            lname: x.lastname?.toUpperCase() || 'NO RECORDS FOUND',
                                            suffix: x.suffix?.toUpperCase() || 'NO RECORDS FOUND',
                                            bday: x.bday ? mmddyy(x.bday) : 'NO RECORDS FOUND',
                                            deceased: x.deceased?.toUpperCase() || 'NO RECORDS FOUND',
                                            category: x.category?.toUpperCase() || 'NO RECORDS FOUND',
                                            urlNotes: x.notes?.toUpperCase() || 'NO RECORDS FOUND',
                                            dtag: x.dtag?.toUpperCase() || 'NO RECORDS FOUND',
                                            subj: x.subject?.toUpperCase() || 'NO RECORDS FOUND',
                                            score: x.score || 'NO RECORDS FOUND',
                                            jurisdiction: x.jurisdiction || 'NO RECORDS FOUND',
                                            ckby: x.checkedBy || USRNAME,
                                            ckdate: x.checkedDate || mmddyy(dayjs()),
                                        }))
                                            : []}
                                        locale={get.beneficiary && get.beneficiary.length === 0 ? { emptyText: 'No Record Found' } : {}}
                                    />
                                </div>
                            </div>
                        </div>)
                        : (<div>
                            <center>
                                <div className='mb-[3%]'>
                                    <SectionHeader title="Beneficiary" tag={'Principal Borrower'} />
                                    <Space>
                                        <LabelDisplay label={'First Name'} readOnly={true} value={data.benfname || 'NO RECORDS FOUND'} />
                                        <LabelDisplay label={'Last Name'} readOnly={true} value={data.benlname || 'NO RECORDS FOUND'} />
                                    </Space>
                                </div>
                            </center>
                            <div className='h-[400px]' key={generateKey()}>
                                <div className='mt-2 w-full px-2'>
                                    <ResponsiveTable
                                        columns={columns}
                                        height={300}
                                        width={400}
                                        rows={get.beneficiary ? get.beneficiary.map((x, i) => ({
                                            key: generateKey(),
                                            num: i + 1,
                                            fname: x.firstname?.toUpperCase() || 'NO RECORDS FOUND',
                                            mname: x.midname?.toUpperCase() || 'NO RECORDS FOUND',
                                            lname: x.lastname?.toUpperCase() || 'NO RECORDS FOUND',
                                            suffix: x.suffix?.toUpperCase() || 'NO RECORDS FOUND',
                                            bday: x.bday ? mmddyy(x.bday) : 'NO RECORDS FOUND',
                                            deceased: x.deceased?.toUpperCase() || 'NO RECORDS FOUND',
                                            category: x.category?.toUpperCase() || 'NO RECORDS FOUND',
                                            urlNotes: x.notes?.toUpperCase() || 'NO RECORDS FOUND',
                                            dtag: x.dtag?.toUpperCase() || 'NO RECORDS FOUND',
                                            subj: x.subject?.toUpperCase() || 'NO RECORDS FOUND',
                                            score: x.score || 'NO RECORDS FOUND',
                                            jurisdiction: x.jurisdiction || 'NO RECORDS FOUND',
                                            ckby: x.checkedBy || USRNAME,
                                            ckdate: x.checkedDate || mmddyy(dayjs()),
                                        }))
                                            : []}
                                        locale={get.beneficiary && get.beneficiary.length === 0 ? { emptyText: 'No Record Found' } : {}}
                                    />
                                </div>
                            </div>
                            <center>
                                <div className='mb-[3%]'>
                                    <SectionHeader title="OFW" tag={'Co-Borrower'} />
                                    <Space>
                                        <LabelDisplay label={'First Name'} readOnly={true} value={data.ofwfname || 'NO RECORDS FOUND'} />
                                        <LabelDisplay label={'Last Name'} readOnly={true} value={data.ofwlname || 'NO RECORDS FOUND'} />
                                    </Space>
                                </div>
                            </center>
                            <div className='h-[400px]' key={generateKey()}>
                                <div className='mt-2 w-full px-2'>
                                    <ResponsiveTable
                                        columns={columns}
                                        height={300}
                                        width={400}
                                        rows={get.ofw ? get.ofw.map((x, i) => ({
                                            key: generateKey(),
                                            num: i + 1,
                                            fname: x.firstname?.toUpperCase() || 'NO RECORDS FOUND',
                                            mname: x.midname?.toUpperCase() || 'NO RECORDS FOUND',
                                            lname: x.lastname?.toUpperCase() || 'NO RECORDS FOUND',
                                            suffix: x.suffix?.toUpperCase() || 'NO RECORDS FOUND',
                                            bday: x.bday ? mmddyy(x.bday) : 'NO RECORDS FOUND',
                                            deceased: x.deceased?.toUpperCase() || 'NO RECORDS FOUND',
                                            category: x.category?.toUpperCase() || 'NO RECORDS FOUND',
                                            urlNotes: x.notes?.toUpperCase() || 'NO RECORDS FOUND',
                                            dtag: x.dtag?.toUpperCase() || 'NO RECORDS FOUND',
                                            subj: x.subject?.toUpperCase() || 'NO RECORDS FOUND',
                                            score: x.score || 'NO RECORDS FOUND',
                                            jurisdiction: x.jurisdiction || 'NO RECORDS FOUND',
                                            ckby: x.checkedBy || USRNAME,
                                            ckdate: x.checkedDate || mmddyy(dayjs()),
                                        }))
                                            : []}
                                        locale={get.ofw && get.ofw.length === 0 ? { emptyText: 'No Record Found' } : {}}
                                    />
                                </div>
                            </div>
                        </div>)
                }
                {sepcoborrowfname && (<>
                    <center>
                        <div className='mb-[3%]'>
                            <SectionHeader title="Additional Co-Borrower" />
                            <Space>
                                <LabelDisplay label={'First Name'} readOnly={true} value={data.coborrowfname || 'NO RECORDS FOUND'} />
                                <LabelDisplay label={'Last Name'} readOnly={true} value={data.coborrowlname || 'NO RECORDS FOUND'} />
                            </Space>
                        </div>
                    </center>
                    <div className='h-[400px]'>
                        <div className='mt-2 w-full px-2'>
                            <ResponsiveTable
                                columns={columns}
                                height={300}
                                width={400}
                                rows={get.coborrow ? get.coborrow.map((x, i) => ({
                                    key: generateKey(),
                                    num: i + 1,
                                    fname: x.firstname?.toUpperCase() || 'NO RECORDS FOUND',
                                    mname: x.midname?.toUpperCase() || 'NO RECORDS FOUND',
                                    lname: x.lastname?.toUpperCase() || 'NO RECORDS FOUND',
                                    suffix: x.suffix?.toUpperCase() || 'NO RECORDS FOUND',
                                    bday: x.bday ? mmddyy(x.bday) : 'NO RECORDS FOUND',
                                    deceased: x.deceased?.toUpperCase() || 'NO RECORDS FOUND',
                                    category: x.category?.toUpperCase() || 'NO RECORDS FOUND',
                                    urlNotes: x.notes?.toUpperCase() || 'NO RECORDS FOUND',
                                    dtag: x.dtag?.toUpperCase() || 'NO RECORDS FOUND',
                                    subj: x.subject?.toUpperCase() || 'NO RECORDS FOUND',
                                    score: x.score || 'NO RECORDS FOUND',
                                    jurisdiction: x.jurisdiction || 'NO RECORDS FOUND',
                                    ckby: x.checkedBy || USRNAME,
                                    ckdate: x.checkedDate || mmddyy(dayjs()),
                                }))
                                    : []}
                                locale={get.coborrow && get.coborrow.length === 0 ? { emptyText: 'No Record Found' } : {}}
                            />
                        </div>
                    </div>
                </>)}
            </>)
        },
        {
            key: '2',
            label: 'Upload Record',
            children: (<UploadRecord data={data} ClientId={ClientId} Uploader={Uploader} />)
        }
    ]

    return (
        <div className={classname}>
            {contextHolder}
            <StatusRemarks isEdit={!isEdit} User={User} data={data} />
            <Tabs defaultActiveKey='1' style={{ marginTop: '10px' }} items={items} />
        </div>
    )
}

export default InternalChecking