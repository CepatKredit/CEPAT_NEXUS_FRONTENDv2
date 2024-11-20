import * as React from 'react';
import { ConfigProvider, Typography, Divider, Input, Button, Tooltip, Tag } from 'antd';
import { BsBuildingFill } from "react-icons/bs";
import { SearchOutlined } from '@ant-design/icons';
import { BsBuildingFillAdd } from "react-icons/bs";
import ResponsiveTable from '@components/global/ResponsiveTable';
import { viewAgencyModal } from '@hooks/ModalAdminController';
import ResponsiveModal from '@components/global/ResponsiveModal';
import { MdEditSquare } from "react-icons/md";
import AgencyDetails from '@containers/admin/AgencyDetails';
import { GET_LIST } from '@api/base-api/BaseApi';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';

function ManageAgency() {
    const [getSearch, setSearch] = React.useState('');
    const column = [
        {
            title: '#',
            dataIndex: 'no',
            key: 'no',
            width: '40px',
            align: 'center'
        },
        {
            title: 'Agency',
            dataIndex: 'agency',
            key: 'agency',
            width: '300px',
            align: 'center'
        },
        {
            title: 'Agency Address',
            dataIndex: 'ageAdd',
            key: 'ageAdd',
            width: '300px',
            align: 'center'
        },
        {
            title: 'License Number',
            dataIndex: 'licno',
            key: 'licno',
            width: '150px',
            align: 'center'
        },
        {
            title: 'Contact Person',
            dataIndex: 'conPer',
            key: 'conPer',
            width: '300px',
            align: 'center'
        },
        {
            title: 'Contact Number',
            dataIndex: 'conNum',
            key: 'conNum',
            width: '150px',
            align: 'center'
        },
        {
            title: 'Designation',
            dataIndex: 'design',
            key: 'design',
            width: '300px',
            align: 'center'
        },
        {
            title: 'Status',
            dataIndex: 'stat',
            key: 'stat',
            width: '150px',
            align: 'center',

        },
        {
            title: 'Agency Status',
            dataIndex: 'ageStat',
            key: 'ageStat',
            width: '150px',
            align: 'center'
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '300px',
            align: 'center'
        },
        {
            title: 'Recorded By',
            dataIndex: 'recBy',
            key: 'recBy',
            width: '250px',
            align: 'center'
        },
        {
            title: 'Recorded Date',
            dataIndex: 'recDate',
            key: 'recDate',
            width: '150px',
            align: 'center'
        },
        {
            title: 'Modified By',
            dataIndex: 'modBy',
            key: 'modBy',
            width: '250px',
            align: 'center'
        },
        {
            title: 'Modified Date',
            dataIndex: 'modDate',
            key: 'modDate',
            width: '150px',
            align: 'center'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: '90px',
            fixed: 'right',
        }
    ];

    const [getOption, setOption] = React.useState();
    const getModalStatus = viewAgencyModal((state) => state.modalStatus);
    const setModalStatus = viewAgencyModal((state) => state.setStatus);

    const AgencyListQuery = useQuery({
        queryKey: ['AgencyListQuery'],
        queryFn: async () => {
            const result = await GET_LIST('/api/v1/GET/G1A');
            return result.list;
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    });

    const filteredData = AgencyListQuery.data?.filter((item) => {
        const search = getSearch.toUpperCase();
        return (
            item.name?.toUpperCase().includes(search) ||
            item.addressId?.toUpperCase().includes(search) ||
            item.licenseNo?.toUpperCase().includes(search) ||
            item.contactNumber?.toUpperCase().includes(search) ||
            item.contactPerson?.toUpperCase().includes(search) ||
            item.designation?.toUpperCase().includes(search) ||
            (item.status !== undefined && item.status.toString().toUpperCase().includes(search)) ||
            (item.agencyStatus !== undefined && item.agencyStatus.toString().toUpperCase().includes(search))
        );
    });

    return (
        <div className='mx-[1%] my-[2%]'>
            <ResponsiveModal showModal={getModalStatus} closeModal={() => { setModalStatus(false) }} modalTitle={
                getOption === 'NEW' ? <span>Add New Agency</span>
                    : <span>Edit Agency</span>}
                modalWidth={'450px'} contextHeight={'h-[600px]'} contextInside={<AgencyDetails option={getOption} />} />
            <div className='flex flex-row gap-3'>
                <BsBuildingFill style={{ fontSize: '40px', color: '#483d8b' }} />
                <Typography.Title level={2}>Manage Agency</Typography.Title>
            </div>
            <Divider />
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button icon={<BsBuildingFillAdd style={{ fontSize: '18px' }} />} className='bg-[#3b0764] pb-2 w-[180px]'
                    onClick={() => {
                        setModalStatus(true);
                        setOption('NEW');
                    }} size='large' type='primary'>Add New Agency</Button>
            </ConfigProvider>
            <div className='pb-2 min-w-[25%] float-end'>
                <Input addonAfter={<SearchOutlined />} placeholder='Search' size='large'
                    onChange={(e) => { setSearch(e.target.value) }}
                    value={getSearch} />
            </div>
            <ResponsiveTable columns={column} rows={filteredData?.map((x, i) => ({
                key: i,
                no: i + 1,
                agency: x.name,
                ageAdd: x.address,
                licno: x.licenseNo,
                conPer: x.contactPerson,
                conNum: x.contactNumber,
                design: x.designation,
                stat: x.status === 1
                    ? (<Tag color='#0d7a3a'>Enable</Tag>)
                    : (<Tag color='#be123c'>Disable</Tag>),
                ageStat: x.agencyStatus === 0
                    ? (<Tag color='#0d7a3a'>POSITIVE</Tag>)
                    : (<Tag color='#be123c'>NEGATIVE</Tag>),
                recBy: x.recUser,
                recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A'),
                remarks: x.remarks,
                modBy: x.modUser,
                modDate: moment(x.modDate).format('MM/DD/YYYY hh:mm A'),
                action: (<Tooltip title='Edit Agency'>
                    <Button onClick={() => {
                        setModalStatus(true);
                        setOption(x);
                    }} type='link' loading={AgencyListQuery.isLoading} icon={<MdEditSquare style={{ fontSize: '18px' }} />} />
                </Tooltip>)
            }))} height={'calc(100vh - 505px)'} width={'100%'} />
        </div>
    )
}

export default ManageAgency;
