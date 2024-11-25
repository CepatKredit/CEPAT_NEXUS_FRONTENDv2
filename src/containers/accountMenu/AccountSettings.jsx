import * as React from 'react'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { IoMdPerson } from "react-icons/io";
import { ConfigProvider, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { toDecrypt } from '@utils/Converter';
import { useAuth } from '@auth/AuthProvider';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function AccountSettings() {
    const { logout } = useAuth();
    const {resetAppDetails } = React.useContext(LoanApplicationContext)

    // const [cookies, setCookie, removeCookie] = useCookies();
    const navigate = useNavigate()
    const USRNAME = toDecrypt(localStorage.getItem('USRFN'));
    const items = [
        {
            label: 'My Account',
            key: '1',
            icon: <UserOutlined style={{ fontSize: '18px' }} />,
        },
        {
            label: 'Logout',
            key: '2',
            danger: true,
            icon: <LogoutOutlined style={{ fontSize: '18px' }} />,
            // onClick: () => {
            //     removeCookie('SESSION_ID')
            //     localStorage.removeItem('UTK');
            //     localStorage.removeItem('UPTH');
            //     localStorage.removeItem('PTH');
            //     localStorage.removeItem('SP');
            //     localStorage.removeItem('USRFN');
            //     localStorage.removeItem('USRDT');
            //     localStorage.removeItem('SIDC');
            //     localStorage.removeItem('activeTab');
            //     removeCookie('SESSION_ID')
            //     navigate('/')
            // }
            onClick: () => {
                logout(); 
                resetAppDetails();
                navigate('/'); 
            },
        },
    ];

    return (
        <Dropdown menu={{ items }} placement="bottom">
            <div className='flex flex-row'>
                <IoMdPerson className='mx-[5px] mt-[4px]' style={{ fontSize: '20px', color: 'white' }} />
                <span className='font-bold text-lg text-stone-100 cursor-pointer'>{USRNAME}</span>
            </div>
        </Dropdown>
    )
}

export default AccountSettings