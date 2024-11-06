import * as React from 'react';
import { Typography, Space, Input, DatePicker, Button, ConfigProvider, notification } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { FaGear } from 'react-icons/fa6';
import Logo from '@assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toEncrypt } from '@utils/Converter';

function TrackLoanApp() {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [loading, setloading] = React.useState(false)
    const [getData, setData] = React.useState({
        LoanId: '',
        BirthDate: null,
    })

    async function trackOnClick() {
        if (getData.LoanId !== '' && dayjs(getData.BirthDate).isValid()) {
            setloading(true)
            let guid = '';
            await axios.post('/getTrackLoan', getData)
                .then(result => {
                    if (result.data.status === 'success') {
                        guid = result.data.loanid
                    } else {
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
                        });
                        setloading(false)
                    }
                })
                .catch(error => {
                    console.log(error)
                })

            if (guid !== '') {

                setTimeout(() => {
                    setloading(false);
                    localStorage.setItem('CLID', toEncrypt(guid));
                    navigate('/track');
                }, 2000);
            }
        } else {
            api['warning']({
                message: 'Incomplete Credentials',
                description: 'Please Complete your Credentials and Try Again!'
            });
        }

    }

    function LoanIdOnchange(e) {
        const num = e.target.value;
        if (/^[0-9]*$/.test(num)) {
            setData(prevState => ({
                ...prevState,
                LoanId: num
            }));
        }
    }

    function BdateOnchange(e) {
        setData(prevState => ({
            ...prevState,
            BirthDate: e
        }));
    }


    return (

        <div className='flex flex-col justify-center items-center'>
            {contextHolder}
            <div className='flex flex-col justify-center items-center w-[400px]'>
                <img src={Logo} alt="logo" className='h-[50px]' />
                <Typography.Title level={2} className='my-[10%] font-sans'>Track Your Loan Application</Typography.Title>
                <div className='w-[100%] mt-[8%]'>
                    <Input size='large' placeholder='Loan Application No.' prefix={
                        <Space.Compact className='w-[110px]' size='large'>
                            <FaGear className='mt-[4%]' />
                            <span className='ml-[10%] font-bold'>LA-</span>
                        </Space.Compact>
                    }
                        value={getData.LoanId}
                        onChange={(e) => { LoanIdOnchange(e) }}
                    />

                </div>
                <div className='flex flex-rows mt-3 w-[420px]'>
                    <label className='ml-[3%] mt-[7px] w-[120px] font-bold'>OFW Birth Date</label>
                    <div className='mx-[2%] w-[300px]'>
                        <DatePicker
                            name='bday'
                            size='large'
                            placeholder='MM-DD-YYYY'
                            format={'MM-DD-YYYY'}
                            style={{ width: '100%' }}
                            value={getData.BirthDate ? dayjs(getData.BirthDate) : null} // Ensure it's null when empty
                            onChange={(_, date) => { BdateOnchange(date) }}
                        />
                    </div>
                </div>
                <div className='text-center mt-5 w-[100%]'>
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button
                            className='bg-[#3b0764] w-full'
                            size='large'
                            type='primary'
                            onClick={trackOnClick}
                            loading={loading}
                        >
                            Track Loan
                        </Button>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}

export default TrackLoanApp;
