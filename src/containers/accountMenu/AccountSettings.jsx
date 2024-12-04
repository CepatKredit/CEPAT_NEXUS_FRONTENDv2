import React, { useState } from "react";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { IoMdPerson } from "react-icons/io";
import { Tooltip, Dropdown } from "antd";
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
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleTooltipToggle = () => {
        setTooltipVisible(true);
        setTimeout(() => {
          setTooltipVisible(false); 
        }, 10000);
      };

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return 'Good morning';
        } else if (currentHour < 18) {
            return 'Good afternoon';
        } else {
            return 'Good evening';
        }
    };
    const firstName = USRNAME.split(' ')[0];

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
        <Tooltip
          title={`${getGreeting()} 😊, ${firstName}`}
          placement="right"
          zIndex={1000}
          visible={tooltipVisible}
        >
          <Dropdown menu={{ items }} placement="bottom">
            <div className="flex items-center" onClick={handleTooltipToggle}>
              {/* Icon for xs and sm screens */}
              <IoMdPerson
                className="mx-[5px] mt-[4px] cursor-pointer"
                style={{ fontSize: "20px", color: "white" }}
              />
              {/* Full text for md and larger screens */}
              <span className="hidden md:inline font-bold text-lg text-stone-100 cursor-pointer">
                {getGreeting()} 😊, {firstName}
              </span>
            </div>
          </Dropdown>
        </Tooltip>
      );
    }
    
    export default AccountSettings;