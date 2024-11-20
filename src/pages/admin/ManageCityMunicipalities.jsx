import * as React from 'react'
import { ConfigProvider, Typography, Divider, Input, Button, Tooltip, Tag } from 'antd'
import { BiSolidCity } from "react-icons/bi";
import { SearchOutlined } from '@ant-design/icons';
import { PiCity } from "react-icons/pi";
import ResponsiveTable from '@components/global/ResponsiveTable';
import { viewCityyModal } from '@hooks/ModalAdminController';
import { MdEditSquare } from "react-icons/md";
import ResponsiveModal from '@components/global/ResponsiveModal';
import CityDetails from '@containers/admin/CityDetails';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi'
import moment from 'moment';

function ManageCityMunicipalities() {

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
            title: 'Municipalities Code',
            dataIndex: 'cityMunCode',
            key: 'cityMunCode',
        },
        {
            title: 'City / Municipalities',
            dataIndex: 'cityMun',
            key: 'cityMun',
        },
        {
            title: 'Province / Area',
            dataIndex: 'provArea',
            key: 'provArea',
        },
        {
            title: 'TagCity',
            dataIndex: 'tag',
            key: 'tag',
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

    const [getOption, setOption] = React.useState()
    const getModalStatus = viewCityyModal((state) => state.modalStatus)
    const setModalStatus = viewCityyModal((state) => state.setStatus)
    const MunicipalityListQuery = useQuery({
        queryKey: ['MunicipalityListQuery'],
        queryFn: async () => {
            const result = await GET_LIST('/api/v1/GET/G22MA')
            return result.list
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    const filteredData = MunicipalityListQuery.data?.filter((item) =>
        item.municipalityCode.toUpperCase().includes(getSearch) ||
        item.municipalityDescription.toUpperCase().includes(getSearch) ||
        item.provinceDescription.toUpperCase().includes(getSearch)
    );

    return (
        <div className='mx-[1%] my-[2%]'>
            <ResponsiveModal showModal={getModalStatus} closeModal={() => { setModalStatus(false) }} modalTitle={
                getOption === 'NEW' ? <span>Add New City / Municipalities</span>
                    : <span>Edit City / Municipalities</span>}
                modalWidth={'400px'} contextHeight={'h-[360px]'} contextInside={<CityDetails option={getOption} />} />
            <div className='flex flex-row gap-3'>
                <BiSolidCity style={{ fontSize: '40px', color: '#483d8b' }} />
                <Typography.Title level={2}>Manage City / Municipalitie(s)</Typography.Title>
            </div>
            <Divider />
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button icon={<PiCity style={{ fontSize: '18px' }} />} className='bg-[#3b0764] pb-2 w-[270px]'
                    onClick={() => {
                        setModalStatus(true)
                        setOption('NEW')
                    }} size='large' type='primary'>Add New City / Municipalities</Button>
            </ConfigProvider>
            <div className='pb-2 min-w-[25%] float-end'>
                <Input addonAfter={<SearchOutlined />} placeholder='Search' size='large'
                    onChange={(e) => { setSearch(e.target.value.toUpperCase()) }}
                    value={getSearch} />
            </div>
            <ResponsiveTable columns={column} rows={filteredData?.map((x, i) => ({
                key: i,
                no: i + 1,
                cityMunCode: x.municipalityCode,
                cityMun: x.municipalityDescription,
                provArea: x.provinceDescription,
                tag: x.tagCity === 1
                    ? (<Tag color='#0d7a3a'>Yes</Tag>)
                    : (<Tag color='#be123c'>No</Tag>),
                recBy: x.recUser,
                recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A'),
                stat: x.isNegative === 0
                    ? (<Tag color='#0d7a3a'>POSITIVE</Tag>)
                    : (<Tag color='#be123c'>NEGATIVE</Tag>),
                modBy: x.modUser,
                modDate: moment(x.modDate).format('MM/DD/YYYY hh:mm A'),
                action: (<Tooltip title='Edit municipality'>
                    <Button onClick={() => {
                        setModalStatus(true)
                        setOption(x)
                    }} type='link' loading={MunicipalityListQuery.isLoading} icon={<MdEditSquare style={{ fontSize: '18px' }} />} />
                </Tooltip>)
            }))} height={'calc(100vh - 505px)'} width={'100%'} />
        </div>
    )
}

export default ManageCityMunicipalities;
