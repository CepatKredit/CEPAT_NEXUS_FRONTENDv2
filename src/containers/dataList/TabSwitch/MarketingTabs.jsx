import * as React from 'react';
import { Tabs } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { GrDuplicate } from "react-icons/gr";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BsFileEarmarkPerson } from "react-icons/bs";
import { AiOutlineAudit } from "react-icons/ai";
import { MdOutlineUploadFile } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineUpdate } from "react-icons/md";
import { IoTrailSign } from "react-icons/io5";
import { FloatButton } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import Deduplication from '../TabList/Deduplication';
import LoanDetails from '../TabList/LoanDetails';
import OfwDetails from '../TabList/OfwDetails';
import BeneficiaryDetails from '../TabList/BeneficiaryDetails';
import InternalChecking from '../TabList/InternalChecking';
import UploadDocs from '../TabList/UploadDocs';
import CharacterReference from '../TabList/CharacterReference';
import LastUpdateBy from '../TabList/LastUpdateBy';
import AuditTrail from '../TabList/AuditTrail';
import { GetData } from '@utils/UserData';

function MarketingTabs({ value, receive, ClientId, FileType, Uploader, BorrowerId, presaddress, sepcoborrowfname, sepBenfname, LoanStatus, loading }) {
    const { id, tabs } = useParams();
    const navigate = useNavigate();
    const [isEdit, setEdit] = React.useState(true);
    const [getTab, setTab] = React.useState(localStorage.getItem('activeTab') || '');

    function onChangeTab(e) {
        setTab(e)
        localStorage.setItem('activeTab',e)
        navigate(`${localStorage.getItem('SP')}/${id}/${e}`);
    }

    const TabsItems = [
        {
            label: <div className='flex flex-rows'>
                <GrDuplicate style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Deduplication</span>
            </div>,
            key: 'deduplication',
            children: <Deduplication data={value} />,
        },
        {
            label: <div className='flex flex-rows'>
                <BsFileEarmarkBarGraph style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Loan Details</span>
            </div>,
            key: 'loan-details',
            children: <LoanDetails loading={loading} getTab={getTab} classname={'h-[66vh] overflow-y-auto'} data={value} receive={(e) => { receive(e); }} isEdit={isEdit} />,
        },
        {
            label: <div className='flex flex-rows'>
                <BsFillPersonLinesFill style={{ fontSize: '20px', marginRight: 5 }} />
                <span>OFW Details</span>
            </div>,
            key: 'ofw-details',
            children: <OfwDetails loading={loading} getTab={getTab} classname={'h-[65vh] overflow-y-auto'} presaddress={presaddress} data={value} receive={(e) => { receive(e) }} BorrowerId={BorrowerId} User={'MARKETING'} />,
        },
        {
            label: <div className='flex flex-rows'>
                <BsFileEarmarkPerson style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Beneficiary Details</span>
            </div>,
            key: 'beneficiary-details',

            children: <BeneficiaryDetails loading={loading} getTab={getTab} presaddress={presaddress} classname={'h-[65vh] overflow-y-auto'} data={value} receive={(e) => { receive(e) }} BorrowerId={BorrowerId} isEdit={isEdit} sepcoborrowfname={sepcoborrowfname} sepBenfname={sepBenfname} />,

        },
        {
            label: <div className='flex flex-rows'>
                <AiOutlineAudit style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Internal Checking</span>
            </div>,
            key: 'internal-checking',
            children: <InternalChecking classname={'h-[65vh] w-[80vw] mx-auto overflow-y-auto'} data={value} isEdit={isEdit}
                ClientId={ClientId} Uploader={Uploader} sepcoborrowfname={sepcoborrowfname} FileType={FileType} receive={(e) => { receive(e) }}/>,
        },
        {
            label: <div className='flex flex-rows'>
                <MdOutlineUploadFile style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Upload Documents</span>
            </div>,
            key: 'upload-documents',
            children: <UploadDocs classname={'h-[54vh] pt-[.5rem] overflow-y-hidden hover:overflow-y-auto'}
                Display={'USER'}
                ClientId={ClientId} FileType={FileType} Uploader={Uploader} data={value} LoanStatus={LoanStatus} />,
        },
        {
            label: <div className='flex flex-rows'>
                <FaUserGroup style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Character Reference</span>
            </div>,
            key: 'character-reference',
            children: <CharacterReference loading={loading} BorrowerId={BorrowerId} Creator={Uploader} data={value} LoanStatus={LoanStatus} />,
        },
        {
            label: <div className='flex flex-rows'>
                <MdOutlineUpdate style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Update Status</span>
            </div>,
            key: 'last-update-by',
            children: <LastUpdateBy isEdit={isEdit} data={value} />,
        },
        {
            label: <div className='flex flex-rows'>
                <IoTrailSign style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Audit Trail</span>
            </div>,
            key: 'audit-trail',
            children: <AuditTrail isEdit={isEdit} />,
        }
    ];

    return (
        <>
            <Tabs
                onChange={onChangeTab}
                tabPosition="top"
                defaultActiveKey={tabs}
                type="card"
                size="middle"
                items={TabsItems}
            />
        </>
    );
}

export default MarketingTabs;

