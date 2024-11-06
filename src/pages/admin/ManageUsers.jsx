import * as React from 'react'
import { ConfigProvider, Space, Typography, Divider, Input, Button, Tooltip, notification, Tag } from 'antd'
import { MdOutlineManageAccounts } from "react-icons/md";
import { SearchOutlined } from '@ant-design/icons';
import ResponsiveTable from '@components/global/ResponsiveTable';
import { FaUserPlus } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { viewCreateNewUserModal, viewEditUserModal, viewResetPasswordUserModal } from '@hooks/ModalAdminController';
import ResponsiveModal from '@components/global/ResponsiveModal';
import NewUser from '@containers/admin/userAccount/NewUser';
import EditUser from '@containers/admin/userAccount/EditUser';
import ChangePassword from '@containers/admin/userAccount/ChangePassword';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi'
import { RefreshUserInfo } from '@hooks/RefresherState';
import moment from 'moment';
import { toEncrypt } from '@utils/Converter';

function ManageUsers() {
    const [api, contextHolder] = notification.useNotification();
    const [getSearch, setSearch] = React.useState('')

    const [getRoleList, setRoleList] = React.useState([])
    const UserListQuery = useQuery({
        queryKey: ['UserListQuery'],
        queryFn: async () => {
            const result = await GET_LIST('/getUsers')
            let roleList = []
            result.list?.map((x) => {
                var data = roleList.some((data) => data.text === x.role)
                if (data === false) {
                    roleList.push({
                        text: x.role,
                        value: x.role
                    })
                }
            })
            setRoleList(roleList)
            return result.list
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    const column = [
        {
            title: '#',
            dataIndex: 'no',
            key: 'no',
            width: '40px',
            align: 'center'
        },
        {
            title: 'Full Name',
            dataIndex: 'fname',
            key: 'fname',
            width: '300px',
            sorter: (a, b) => { return a?.fname.localeCompare(b?.fname) },
        },
        {
            title: 'User Name',
            dataIndex: 'uname',
            key: 'uname',
            width: '300px',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            width: '200px',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: getRoleList,
            onFilter: (value, record) => record.role.startsWith(value),
            width: '150px',
        },
        {
            title: 'Assigned Branch',
            dataIndex: 'assBranch',
            key: 'assBranch',
            width: '150px',
        },
        {
            title: 'Status',
            dataIndex: 'stat',
            key: 'stat',
            width: '150px',
        },
        {
            title: 'Added by',
            dataIndex: 'addBy',
            key: 'addBy',
            width: '300px',
        },
        {
            title: 'Creation Date',
            dataIndex: 'creaDate',
            key: 'creaDate',
            width: '150px',
        },
        {
            title: 'Account Status',
            dataIndex: 'accStat',
            key: 'accStat',
            width: '150px',
        },
        {
            title: 'Up Time',
            dataIndex: 'upTime',
            key: 'upTime',
            width: '150px',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '90px',
            fixed: 'right',
        },
    ]

    const getModalStatus = viewCreateNewUserModal((state) => state.modalStatus)
    const setModalStatus = viewCreateNewUserModal((state) => state.setStatus)
    const getEditModalStatus = viewEditUserModal((state) => state.modalStatus)
    const setEditModalStatus = viewEditUserModal((state) => state.setStatus)

    const getPasswordModalStatus = viewResetPasswordUserModal((state) => state.modalStatus)
    const setPasswordModalStatus = viewResetPasswordUserModal((state) => state.setStatus)
    const setDataListPasswordModal = viewResetPasswordUserModal((state) => state.storeData)

    return (
        <div className='mx-[1%] my-[2%]'>
            {contextHolder}
            <ResponsiveModal showModal={getModalStatus} closeModal={() => { setModalStatus(false) }} modalTitle={<span>Register New User</span>}
                modalWidth={'700px'} contextHeight={'h-[450px]'} contextInside={<NewUser />} />

            <ResponsiveModal showModal={getEditModalStatus} closeModal={() => {
                setEditModalStatus(false)
                localStorage.removeItem('EUSD');
            }} modalTitle={<span>Edit User</span>}
                modalWidth={'700px'} contextHeight={'h-[40rem]'} contextInside={<EditUser />} />

            <ResponsiveModal showModal={getPasswordModalStatus} closeModal={() => { setPasswordModalStatus(false) }} modalTitle={<span>Change Password</span>}
                modalWidth={'400px'} contextHeight={'h-[180px]'} contextInside={<ChangePassword />} />

            <div className='flex flex-row gap-3'>
                <MdOutlineManageAccounts style={{ fontSize: '40px', color: '#483d8b' }} />
                <Typography.Title level={2}>Manage Users</Typography.Title>
            </div>
            <Divider />
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button icon={<FaUserPlus style={{ fontSize: '18px' }} />} className='bg-[#3b0764] pb-2 w-[180px]'
                    size='large' type='primary' onClick={() => { setModalStatus(true) }}>Create New User</Button>
            </ConfigProvider>
            <div className='pb-2 min-w-[25%] float-end'>
                <Input addonAfter={<SearchOutlined />} placeholder='Search' size='large'
                    onChange={(e) => { setSearch(e.target.value.toUpperCase()) }}
                    value={getSearch} />
            </div>
            <ResponsiveTable columns={column} rows={UserListQuery.data?.map((x, i) => ({
                key: i,
                no: i + 1,
                fname: x.fullName,
                uname: x.username,
                department: x.department,
                role: x.role,
                assBranch: x.branch,
                stat: x.stat === 1
                    ? (<Tag color={'#0d7a3a'}>{<span className='font-bold'>ENABLE</span>}</Tag>)
                    : x.stat === 2
                        ? (<Tag color={'#be123c'}>{<span className='font-bold'>DISABLE</span>}</Tag>)
                        : x.stat === 3
                            ? (<Tag color={'#102542'}>{<span className='font-bold'>FOR APPROVAL</span>}</Tag>)
                            : x.stat == 4
                                ? (<Tag color={'#eb6424'}>{<span className='font-bold'>REJECT</span>}</Tag>)
                                : (<Tag color={'#fff3b0'}>{<span className='text-black font-bold'>RESET PASSWORD</span>}</Tag>),
                addBy: x.recUser,
                creaDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A'),
                accStat: x.isOnline === 0 ? 'OFFLINE' : 'ONLINE',
                upTime: x.upTime,
                action: (<Space>
                    <Tooltip title='Edit user'>
                        <Button onClick={() => {
                            localStorage.setItem('EUSD', toEncrypt(x.id))
                            setEditModalStatus(true)
                        }} type='link' icon={<FaUserEdit style={{ fontSize: '18px' }} />} />
                    </Tooltip>
                    <Tooltip title='Reset Password'>
                        <Button onClick={() => {
                            setPasswordModalStatus(true)
                            setDataListPasswordModal(x)
                        }} type='link' icon={<FaKey style={{ fontSize: '15px' }} />} />
                    </Tooltip>
                </Space>)
            }))} height={'calc(100vh - 505px)'} width={'100%'} />
        </div>
    )
}

export default ManageUsers