import * as React from 'react';
import { Tabs } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { MdOutlineUploadFile } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import LoanDetails from '../TabList/LoanDetails';
import OfwDetails from '../TabList/OfwDetails';
import UploadDocs from '../TabList/UploadDocs';
import CharacterReference from '../TabList/CharacterReference';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import TriggerFields from '@utils/TriggerFields';

function LcTabs({ value, ClientId, FileType, Uploader, BorrowerId, presaddress, LoanStatus}) {
    const { id, tabs } = useParams();
    const navigate = useNavigate();
    const { updateAppDetails } = React.useContext(LoanApplicationContext)
    const [isEdit, setEdit] = React.useState(true);
    
    const getStatusBackgroundColor = status => {
        const colors = {
            RECEIVED: 'bg-[#29274c] text-white',
            'COMPLIED-LACK OF DOCUMENTS': 'bg-[#FF8C00] text-white',
            'FOR WALK-IN': 'bg-[#3bceac] text-white',
            'FOR INITIAL INTERVIEW': 'bg-[#532b88] text-white',
            'REASSESSED TO MARKETING': 'bg-[#DB7093] text-white',
            'LACK OF DOCUMENTS': 'bg-[#8B4513] text-white',
            'FOR CREDIT ASSESSMENT': 'bg-[#006d77] text-white',
            'CREDIT ASSESSMENT SPECIAL LANE': 'bg-[#ff5400] text-white',
            'FOR VERIFICATION': 'bg-[#80b918] text-white',
            'FOR APPROVAL': 'bg-[#20b2aa] text-white',
            'APPROVED (TRANS-OUT)': 'bg-[#b5179e] text-white',
            'UNDER LOAN PROCESSOR': 'bg-[#ffd700] text-white',
            'FOR DOCUSIGN': 'bg-[#008080] text-white',
            'RETURNED FROM MARKETING': 'bg-[#7b68ee] text-white',
            'FOR DISBURSEMENT': 'bg-[#cd5c5c] text-white',
            RELEASED: 'bg-[#006400] text-white',
            CANCELLED: 'bg-[#1c1c1c] text-white',
            DECLINED: 'bg-[#FF0000] text-white',
            'FOR RE-APPLICATION': 'bg-[#708090] text-white',
            'RETURN TO CREDIT OFFICER': 'bg-[#720026] text-white',
            'RETURN TO CREDIT ASSOCIATE': 'bg-[#2d6a4f] text-white',
            'REASSESSED TO CREDIT ASSOCIATE': 'bg-[#6d597a] text-white',
            'REASSESSED TO CREDIT OFFICER': 'bg-[#ff0054] text-white',
            'RETURN TO LOANS PROCESSOR': 'bg-[#ff7f50] text-white',
            'OK FOR DOCUSIGN': 'bg-[#c77dff] text-white',
            'ON WAIVER': 'bg-[#2196f3] text-white',
            CONFIRMATION: 'bg-[#228b22] text-white',
            CONFIRMED: 'bg-[#32cd32] text-white',
            UNDECIDED: 'bg-[#ff7f50] text-white',
            'PRE-CHECK': 'bg-[#3d5a80] text-white'
        };
        return colors[status] || 'bg-blue-500 text-white';
    };
    function onChangeTab(e) {
        navigate(`${localStorage.getItem('SP')}/${id}/${e}`);
    }
    TriggerFields('LOAN_CONSULTANT');
    const TabsItems = [
        {
            label: (
                <div className='flex flex-row items-center text-sm xs1:text-[12px] md:text-base'>
                    <BsFileEarmarkBarGraph className='mr-2 text-lg' />
                    <span>Loan Details</span>
                </div>
            ),
            key: 'loan-details',
            children: <LoanDetails classname={'h-[12rem] xs1:h-[16rem]'} data={value} receive={(e) => { updateAppDetails(e); }} isEdit={isEdit} User={'LC'} />,
        },
        {
            label: (
                <div className='flex flex-row items-center text-sm xs1:text-[12px] md:text-base'>
                    <BsFillPersonLinesFill className='mr-2 text-lg' />
                    <span>OFW Details</span>
                </div>
            ),
            key: 'ofw-details',
            children: <OfwDetails classname={'h-[12rem] xs1:h-[16rem]'} presaddress={presaddress} data={value} receive={(e) => { updateAppDetails(e) }} BorrowerId={BorrowerId} User={'LC'} />,
        },
        {
            label: (
                <div className='flex flex-row items-center text-sm xs1:text-[12px] md:text-base'>
                    <MdOutlineUploadFile className='mr-2 text-lg' />
                    <span>Upload Documents</span>
                </div>
            ),
            key: 'upload-documents',
            children: <UploadDocs classname={'h-[22rem] xs1:h-[24rem] pt-[.5rem] overflow-y-hidden hover:overflow-y-auto'} ClientId={ClientId} FileType={FileType} Uploader={Uploader} User={'LC'} data={value} LoanStatus={LoanStatus} />,
        },
        {
            label: (
                <div className='flex flex-row items-center text-sm xs1:text-[12px] md:text-base'>
                    <FaUserGroup className='mr-2 text-lg' />
                    <span>Character Reference</span>
                </div>
            ),
            key: 'character-reference',
            children: <CharacterReference BorrowerId={BorrowerId} Creator={Uploader} User={'LC'} data={value} LoanStatus={LoanStatus} />,
        },
    ];
    return (
        <div className="relative w-full">
            <div className="absolute top-[-10px] right-0 mt-1 xs1:mt-[-40px] md:mt-1 mr-4 text-right">
                <div className={`inline-flex font-bold items-center px-10 py-2 rounded-full ${getStatusBackgroundColor(value.loanAppStat)}`}>{value.loanAppStat} </div>
            </div>
            <Tabs
                onChange={onChangeTab}
                tabPosition="top"
                defaultActiveKey={tabs}
                type="card"
                size="middle"
                items={TabsItems}
            />
        </div>
    );
}

export default LcTabs;

