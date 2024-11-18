import * as React from 'react'
import { ConfigProvider, Typography, Divider, Input, Button, Tooltip, Tag } from 'antd'
import { TbGlobeOff } from "react-icons/tb";
import { SearchOutlined } from '@ant-design/icons';
import { GiGlobe } from "react-icons/gi";
import ResponsiveTable from '@components/global/ResponsiveTable';
import { viewCountryModal } from '@hooks/ModalAdminController';
import ResponsiveModal from '@components/global/ResponsiveModal';
import CountryDetails from '@containers/admin/CountryDetails';
import { MdEditSquare } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';

import { GET_LIST } from '@api/base-api/BaseApi';
import moment from 'moment';


function ManageCountry() {

    const [getSearch, setSearch] = React.useState('')
    const column = [
        {
            title: '#',
            dataIndex: 'no',
            key: 'no',
            width: '40px',
            align: 'center'
        },
        {

            title: 'Country Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: 'Sub-Continent',
            dataIndex: 'subCon',
            key: 'subCon',

        },
        {
            title: 'Continent',
            dataIndex: 'continent',
            key: 'continent',
        },
        {

            title: 'Recorded By',
            dataIndex: 'recBy',
            key: 'recBy',
        },
        {
            title: 'Date Recored',
            dataIndex: 'recDate',
            key: 'recDate',
        },
        {
            title: 'Status',
            dataIndex: 'stat',
            key: 'stat',
        },
        {

            title: 'Modified By',
            dataIndex: 'modBy',
            key: 'modBy',
        },
        {
            title: 'Date Modified',
            dataIndex: 'modDate',
            key: 'modDate',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '90px',
            fixed: 'right',
        },
    ]


    const CountryListQuery = useQuery({
        queryKey: ['CountryListQuery'],
        queryFn: async () => {
            const result = await GET_LIST('/v1/GET/G15CL')
            return result.list
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })


    const [getOption, setOption] = React.useState()
    const getModalStatus = viewCountryModal((state) => state.modalStatus)
    const setModalStatus = viewCountryModal((state) => state.setStatus)

    return (
        <div className='mx-[1%] my-[2%]'>
            <ResponsiveModal showModal={getModalStatus} closeModal={() => { setModalStatus(false) }}
                modalTitle={
                    getOption === 'NEW' ? <span>Add New Country</span>
                        : <span>Edit Country</span>}

                modalWidth={'400px'} contextHeight={'h-[360px]'} contextInside={<CountryDetails option={getOption} />} />
            <div className='flex flex-row gap-3'>
                <TbGlobeOff style={{ fontSize: '40px', color: '#483d8b' }} />
                <Typography.Title level={2}>Manage Negative Countries</Typography.Title>
            </div>
            <Divider />
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button icon={<GiGlobe style={{ fontSize: '18px' }} />} className='bg-[#3b0764] pb-2 w-[180px]'
                    onClick={() => {
                        setModalStatus(true)
                        setOption('NEW')
                    }} size='large' type='primary'>Add New Country</Button>
            </ConfigProvider>
            <div className='pb-2 min-w-[25%] float-end'>
                <Input addonAfter={<SearchOutlined />} placeholder='Search' size='large'
                    onChange={(e) => { setSearch(e.target.value.toUpperCase()) }}
                    value={getSearch} />
            </div>
            <ResponsiveTable columns={column} rows={CountryListQuery.data?.map((x, i) => ({
                key: i,
                no: i + 1,
                code: x.countryCode,
                country: x.countryDesc,
                subCon: x.intSubGroupDesc,
                continent: x.intGroupDesc,
                recBy: x.recUser,
                recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A'),
                stat: x.isNegative === 0
                    ? (<Tag color='#0d7a3a'>POSITIVE</Tag>)
                    : (<Tag color='#be123c'>NEGATIVE</Tag>),
                modBy: x.modUser,
                modDate: moment(x.modDate).format('MM/DD/YYYY hh:mm A'),
                action: (<Tooltip title='Edit branch'>
                    <Button onClick={() => {
                        setModalStatus(true)
                        setOption(x)
                    }} type='link' loading={CountryListQuery.isLoading} icon={<MdEditSquare style={{ fontSize: '18px' }} />} />
                </Tooltip>)
            }))} height={'calc(100vh - 505px)'} width={'100%'} />
        </div>
    )
}

export default ManageCountry