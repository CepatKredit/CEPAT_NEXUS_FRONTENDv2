import * as React from 'react'
import { ConfigProvider, Typography, Divider, Input, Button, Tooltip, notification, Tag } from 'antd'
import { PiGitBranchFill } from "react-icons/pi";
import { SearchOutlined } from '@ant-design/icons';
import ResponsiveTable from '@components/global/ResponsiveTable';
import { LuGitBranchPlus } from "react-icons/lu";
import { viewCreateNewBranchModal, viewEditBranchModal } from '@hooks/ModalAdminController';
import { useQuery } from '@tanstack/react-query';
import ResponsiveModal from '@components/global/ResponsiveModal';
import NewBranch from '@containers/admin/branchInfo/NewBranch';
import { MdEditSquare } from "react-icons/md";
import EditBranch from '@containers/admin/branchInfo/EditBranch';
import { GET_LIST } from '@api/base-api/BaseApi';

function ManageBranch() {

    const [api, contextHolder] = notification.useNotification();
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
            title: 'Branch',
            dataIndex: 'BranchName',
            key: 'BranchName',
        },
        {
            title: 'Address',
            dataIndex: 'BranchAddress',
            key: 'BranchAddress',
        },
        {
            title: 'Description',
            dataIndex: 'BranchDescription',
            key: 'BranchDescription',
        },
        {
            title: 'Status',
            dataIndex: 'BranchStatus',
            key: 'BranchStatus',
        },
        {
            title: 'Added by',
            dataIndex: 'RecBy',
            key: 'RecBy',
        },
        {
            title: 'Date Created',
            dataIndex: 'RecDate',
            key: 'RecDate',
        },
        {
            title: 'Modified by',
            dataIndex: 'ModUser',
            key: 'ModUser',
        },
        {
            title: 'Date Modified',
            dataIndex: 'ModDate',
            key: 'ModDate',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '90px',
            fixed: 'right',
        },
    ]

    const getModalStatus = viewCreateNewBranchModal((state) => state.modalStatus)
    const setModalStatus = viewCreateNewBranchModal((state) => state.setStatus)

    const getEditModalStatus = viewEditBranchModal((state) => state.modalStatus)
    const setEditModalStatus = viewEditBranchModal((state) => state.setStatus)
    const setDataList = viewEditBranchModal((state) => state.storeData)

    const BranchListQuery = useQuery({
        queryKey: ['BranchList'],
        queryFn: async () => {
            const result = await GET_LIST('/v1/GET/G11B')
            return result.list
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    return (
        <div className='mx-[1%] my-[2%]'>
            {contextHolder}
            <ResponsiveModal showModal={getModalStatus} closeModal={() => { setModalStatus(false) }} modalTitle={<span>Add New Branch</span>}
                modalWidth={'400px'} contextHeight={'h-[460px]'} contextInside={<NewBranch notify={(e) => {
                    api[e.status]({
                        message: e.message,
                        description: e.message
                    })
                }} />} />

            <ResponsiveModal showModal={getEditModalStatus} closeModal={() => { setEditModalStatus(false) }} modalTitle={<span>Edit Branch</span>}
                modalWidth={'400px'} contextHeight={'h-[460px]'} contextInside={<EditBranch notify={(e) => {
                    api[e.status]({
                        message: e.message,
                        description: e.message
                    })
                }} />} />

            <div className='flex flex-row gap-3'>
                <PiGitBranchFill style={{ fontSize: '40px', color: '#483d8b' }} />
                <Typography.Title level={2}>Manage Branch(s)</Typography.Title>
            </div>
            <Divider />
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button icon={<LuGitBranchPlus style={{ fontSize: '18px' }} />} className='bg-[#3b0764] pb-2 w-[180px]'
                    onClick={() => { setModalStatus(true) }} size='large' type='primary'>Create New Branch</Button>
            </ConfigProvider>
            <div className='pb-2 min-w-[25%] float-end'>
                <Input addonAfter={<SearchOutlined />} placeholder='Search' size='large'
                    onChange={(e) => { setSearch(e.target.value.toUpperCase()) }}
                    value={getSearch} />
            </div>
            <ResponsiveTable columns={column} rows={BranchListQuery.data?.map((x, i) => ({
                key: i,
                no: i + 1,
                BranchName: x.name,
                BranchAddress: x.address,
                BranchDescription: x.description,
                BranchStatus: x.status === 1
                    ? (<Tag color='#0d7a3a'>{'ENABLE'}</Tag>)
                    : (<Tag color='#be123c'>{'DISABLE'}</Tag>),
                RecBy: x.recUser,
                RecDate: x.recDate,
                ModUser: x.modUSer,
                ModDate: x.ModDate,
                action: (<Tooltip title='Edit branch'>
                    <Button onClick={() => {
                        setDataList(x)
                        setEditModalStatus(true)
                    }} type='link' icon={<MdEditSquare style={{ fontSize: '18px' }} />} />
                </Tooltip>)
            }))} height={'calc(100vh - 505px)'} width={'100%'} />
        </div>
    )
}

export default ManageBranch