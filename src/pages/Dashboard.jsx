import * as React from 'react'
import { useNavigate } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { Divider, Typography, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import AnimatedCard from '@components/global/AnimatedCard';
import { toDecrypt } from '@utils/Converter';
function Dashboard() {

    const navigate = useNavigate()
    const [spinning, setSpinning] = React.useState(false);
    const [percent, setPercent] = React.useState(0);
    function onClick(e) {
        /*setSpinning(true);
        let ptg = -10;
        const interval = setInterval(() => {
            ptg += 5;
            setPercent(ptg);
            if (ptg > 100) {
                clearInterval(interval);
                setSpinning(false);
                setPercent(0);
                
            }
        }, 100);*/
        navigate(e)
    }

    function pathList() {
        let path = []
        toDecrypt(localStorage.getItem('UPTH')).split(',').map((x) => {
            if (x === '/ckfi/manage-users' || x === '/ckfi/manage-branch' || x === '/ckfi/manage-country' ||
                x === '/ckfi/manage-city-municipality' || x === '/ckfi/manage-agency' || x === '/ckfi/manage-barangay' ||
                x === '/ckfi/dashboard' || x === '/ckfi/endorsement'
            ) { }
            else {
                path.push(x)
            }
        })
        return path
    }

    return (
        <center>
            <div className='mx-[1%] my-[2%]'>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />} spinning={spinning} percent={percent} fullscreen />
                <div className='flex flex-row gap-3'>
                    <RiDashboardFill style={{ fontSize: '40px', color: '#483d8b' }} />
                    <Typography.Title level={2}>Loan Apps Dashboard</Typography.Title>
                </div>
                <Divider />
                <div className='flex flex-wrap justify-center gap-1 h-[58vh] overflow-y-auto'>
                    {pathList()?.map((x, i) => (<AnimatedCard key={i} path={x} />))}
                </div>
            </div>
        </center>
    )
}

export default Dashboard