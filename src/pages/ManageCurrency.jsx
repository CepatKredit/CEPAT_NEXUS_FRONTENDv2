import { DeleteFilled, EditFilled, SearchOutlined } from '@ant-design/icons'
import ResponsiveModal from '@components/global/ResponsiveModal'
import ResponsiveTable from '@components/global/ResponsiveTable'
import CurrencyDetails from '@containers/currency/CurrencyDetails'
import { detailCurrencyModal } from '@hooks/ModalAdminController'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { convToCurrency, mmddyy } from '@utils/Converter'
import { GET_LIST } from "@api/base-api/BaseApi";
import { GetData } from '@utils/UserData'
import { Button, ConfigProvider, Divider, Input, notification, Popconfirm, Space, Tag, Tooltip, Typography, Spin } from 'antd'
import axios from 'axios'
import React from 'react'
import { GiGlobe } from 'react-icons/gi'
import { MdOutlineManageSearch } from 'react-icons/md'

function ManageCurrency() {
    const [loading, setLoading] = React.useState(true);
    const [getSearch, setSearch] = React.useState('');
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const column = [
        {
            title: '#',
            dataIndex: 'no',
            key: 'no',
            width: '40px',
            align: 'center'
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            align: 'center'
        },
        {
            title: 'Currency Name',
            dataIndex: 'currencyName',
            key: 'currencyName',
            align: 'center'
        },
        {
            title: 'Exchange Rate (Foreign to Peso)',
            dataIndex: 'exchangeRate',
            key: 'exchangeRate',
            align: 'center'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center'
        },
        {
            title: 'Modified By',
            dataIndex: 'moduser',
            key: 'moduser',
            align: 'center'
        },
        {
            title: 'Date Modified',
            dataIndex: 'moddate',
            key: 'moddate',
            align: 'center'
        },
        {
            title: 'Recorded By',
            dataIndex: 'recuser',
            key: 'recuser',
            align: 'center'
        },
        {
            title: 'Date Recorded',
            dataIndex: 'recdate',
            key: 'recdate',
            align: 'center'
        },
        
    ]
    
    {GetData('ROLE').toString() === '60' && (column.push(
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center'
        }
    ))}

    const CurrencyListQuery = useQuery({
        queryKey: ['CurrencyListQuery'],
        queryFn: async () => {
            try {
                const result = await GET_LIST('/GET/G104CT')
                setLoading(false);
                return result.list
            } catch (error) {
                console.log(error)
                return [];
            }
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    async function remove(Id) {
        try {
            const result = await axios.post(`/GroupPost/P119DC/${Id}`);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            });
            console.log(error)
        }
        queryClient.invalidateQueries({ queryKey: ['CurrencyListQuery'] }, { exact: true });
    }

    const [getOption, setOption] = React.useState()
    const getModalStatus = detailCurrencyModal((state) => state.modalStatus);
    const setModalStatus = detailCurrencyModal((state) => state.setStatus);

    return (<>
        {contextHolder}
        <div className='mx-[1%] my-[2%]'>
            <ResponsiveModal showModal={getModalStatus} closeModal={() => { setModalStatus(false) }} modalTitle={
                getOption === 'NEW' ? <span> Add New Currency</span> : <span> Edit Currency</span>}
                modalWidth={'700px'} contextHeight={'h-[450px]'} contextInside={<CurrencyDetails option={getOption} api={api} />} />
            <div className='flex flex-row gap-3'>
                <MdOutlineManageSearch style={{ fontSize: '40px', color: '#483d8b' }} />
                <Typography.Title level={2}>Manage Foreign Currency</Typography.Title>
            </div>
            <Divider />
            {GetData('ROLE').toString() === '60' && (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button icon={<GiGlobe style={{ fontSize: '18px' }} />} className='bg-[#3b0764] pb-2 w-[180px]'
                    onClick={() => {
                        setModalStatus(true)
                        setOption('NEW')
                    }} size='large' type='primary'>Add New Currency</Button>
            </ConfigProvider>)}
            <div className='pb-2 min-w-[25%] float-end'>
                <Input addonAfter={<SearchOutlined />} placeholder='Search' size='large'
                    onChange={(e) => { setSearch(e.target.value.toUpperCase()) }}
                    value={getSearch} />
            </div>
            <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                <Spin spinning={loading} tip="Please wait..." className="flex justify-center items-center">
                    <ResponsiveTable
                        columns={column}
                        rows={CurrencyListQuery.data?.filter((x) =>
                            x.country?.includes(getSearch) ||
                            x.currencyName?.includes(getSearch) ||
                            x.status?.includes(getSearch) ||
                            x.recUser?.includes(getSearch) ||
                            x.modUser?.includes(getSearch) ||
                            x.modDate?.includes(getSearch) ||
                            x.recDate?.includes(getSearch)
                        )
                            .map((x, i) => ({
                                key: i,
                                no: i + 1,
                                country: x.country,
                                currencyName: x.currencyName,
                                exchangeRate: x.exchangeRate,
                                status: x.status === 'ENABLED'
                                    ? (<Tag color='#0d7a3a'>ENABLED</Tag>)
                                    : (<Tag color='#be123c'>DISABLED</Tag>),
                                moduser: x.modUser,
                                moddate: mmddyy(x.modDate),
                                recuser: x.recUser,
                                recdate: mmddyy(x.recDate),
                                action: (<Space>
                                    <Tooltip title="Edit Currency">
                                        <Button
                                            onClick={() => {
                                                setModalStatus(true);
                                                setOption(x);
                                            }}
                                            type="link"
                                            icon={<EditFilled style={{ fontSize: '18px' }} />}
                                        />
                                    </Tooltip>
                                {/* <Popconfirm
                                        title="Are you sure you want to delete?"
                                        onConfirm={() => {
                                            remove(x.id)
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="left"
                                    >
                                        <Tooltip title="Delete Currency" placement="top">
                                            <Button
                                                type="link"
                                                icon={<DeleteFilled style={{ fontSize: '15px' }} />}
                                            />
                                        </Tooltip>
                                    </Popconfirm>
                                    */}
                                    
                                </Space>)
                            }))}  // Add the sample rows here
                    />
                    </Spin>
                    </ConfigProvider>
                </div>
            </>
            )
}

            export default ManageCurrency