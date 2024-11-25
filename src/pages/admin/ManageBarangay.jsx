import * as React from 'react'
import { ConfigProvider, Typography, Divider, Input, Button, Tooltip, Tag } from 'antd'
import { TbGlobeOff } from "react-icons/tb";
import { GiGlobe } from "react-icons/gi";
import { SearchOutlined } from '@ant-design/icons';
import ResponsiveTable from '@components/global/ResponsiveTable';
import { GET_LIST } from '@api/base-api/BaseApi';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { MdEditSquare } from "react-icons/md";
import { viewBarangayModal } from '@hooks/ModalAdminController';
import ResponsiveModal from '@components/global/ResponsiveModal';
import BarangayDetails from '@containers/admin/BarangayDetails';

function ManageBarangay() {

    const [getSearch, setSearch] = React.useState('')
    const column = [
        {
            title: '#',
            dataIndex: 'no',
            key: 'no',
            width: '70px',
            align: 'center'
        },
        {

            title: 'Barangay Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Barangay',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Municipality',
            dataIndex: 'municipality',
            key: 'municipality',

        },
        {
            title: 'Recorded By',
            dataIndex: 'recUser',
            key: 'recUser',
        },
        {
            title: 'Date Recored',
            dataIndex: 'recDate',
            key: 'recDate',
        },
        {
            title: 'Modify User',
            dataIndex: 'modUser',
            key: 'modUser',
        },
        {
            title: 'ZipCOde',
            dataIndex: 'zipcode',
            key: 'zipcode',
        },
        {

            title: 'Status',
            dataIndex: 'isNegative',
            key: 'isNegative',
        },
        {

            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },

    ]

    const [getOption, setOption] = React.useState()
    const getModalStatus = viewBarangayModal((state) => state.modalStatus)
    const setModalStatus = viewBarangayModal((state) => state.setStatus)
    const BarangayListQuery = useQuery({
        queryKey: ['BarangayListQuery'],
        queryFn: async () => {
            const result = await GET_LIST('/GET/G5B')
            return result.list
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })


    const filteredData = BarangayListQuery.data?.filter((Item) =>
        Item.code.includes(getSearch) ||
        Item.description.toUpperCase().includes(getSearch) ||
        Item.municipality.toUpperCase().includes(getSearch)
    )

    return (
        <div className='mx-[1%] my-[2%]'>
            <ResponsiveModal showModal={getModalStatus}
                closeModal={() => { setModalStatus(false) }} modalTitle={getOption === 'NEW' ? <span>Add new Barangay</span>
                    : <span>Edit Barangay</span>}
                modalWidth={'400px'} contextHeight={'h-[420px]'}
                contextInside={<BarangayDetails option={getOption} />} />

            <div className='flex flex-row gap-3'>
                <TbGlobeOff style={{ fontSize: '40px', color: '#483d8b' }} />
                <Typography.Title level={2}>Manage Barangay</Typography.Title>
            </div>

            <Divider />
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button icon={<GiGlobe style={{ fontSize: '18px' }} />} className='bg-[#3b0764] pb-2 w-[180px]'
                    onClick={() => {
                        setModalStatus(true)
                        setOption('NEW')
                    }} size='large' type='primary'>Add New Barangay</Button>
            </ConfigProvider>
            <div className='pb-2 min-w-[25%] float-end'>
                <Input addonAfter={<SearchOutlined />} placeholder='Search' size='large'
                    onChange={(e) => { setSearch(e.target.value.toUpperCase()) }}
                    value={getSearch} />
            </div>
            <ResponsiveTable columns={column} rows={filteredData?.map((x, i) => ({
                key: i,
                no: i + 1,
                code: x.code,
                description: x.description,
                municipality: x.municipality,
                recUser: x.recUser,
                recBy: x.recUser,
                recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A'),
                isNegative: x.isNegative === 0
                    ? (<Tag color='#0d7a3a'>POSITIVE</Tag>)
                    : (<Tag color='#be123c'>NEGATIVE</Tag>),
                modUser: x.modUser,
                action: (<Tooltip title='Edit Barangay'>
                    <Button onClick={() => {
                        setModalStatus(true)
                        setOption(x)
                    }} type='link' icon={<MdEditSquare style={{ fontSize: '18px' }} />} />
                </Tooltip>)
            }))} height={'calc(100vh - 505px)'} width={'100%'} loading={BarangayListQuery.isLoading} />
        </div>
    )
}

export default ManageBarangay;

