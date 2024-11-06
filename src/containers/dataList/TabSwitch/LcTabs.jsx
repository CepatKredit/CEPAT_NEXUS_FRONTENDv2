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

function LcTabs({ value, receive, ClientId, FileType, Uploader, BorrowerId, presaddress, LoanStatus, loading}) {
    const { id, tabs } = useParams();
    const navigate = useNavigate();
    const [isEdit, setEdit] = React.useState(true);
    const getStatusBackgroundColor = status => {
        const colors = {
            RECEIVED: 'bg-[#29274c] text-white',
            'COMPLIED-LACK OF DOCUMENTS': 'bg-[#FF8C00] text-white',
            'FOR WALK-IN': 'bg-[#3bceac] text-white',
            'FOR INITIAL INTERVIEW': 'bg-[#532b88] text-white',
            'REASSESSED TO MARKETING': 'bg-[#DB7093] text-white',
            'LACK OF DOCUMENTS': 'bg-[#8B4513] text-white',
            'FOR CREDIT ASSESSEMENT': 'bg-[#006d77] text-white',
            'CREDIT ASSESSEMENT SPECIAL LANE': 'bg-[#B8860B] text-white',
            'UNDER CREDIT': 'bg-[#293241] text-white',
            'FOR VERIFICATION': 'bg-[#003566] text-white',
            'FOR APPROVAL': 'bg-[#2d6a4f] text-white',
            APPROVED: 'bg-[#6d597a] text-white',
            'UNDER LOAN PROCESSOR': 'bg-[#2f2f2f] text-white',
            'FOR DOCUSIGN': 'bg-[#008080] text-white',
            'TAGGED FOR RELEASE': 'bg-[#FFD700] text-white',
            'FOR DISBURSEMENT': 'bg-[#32CD32] text-white',
            RELEASED: 'bg-[#FF7F50] text-white',
            CANCELLED: 'bg-[#1c1c1c] text-white',
            DECLINED: 'bg-[#FF0000] text-white',
            'FOR RE-APPLICATION': 'bg-[#708090] text-white'
        };
        return colors[status] || 'bg-blue-500 text-white';
    };
    function onChangeTab(e) {
        navigate(`${localStorage.getItem('SP')}/${id}/${e}`);
    }
    const TabsItems = [
        {
            label: <div className='flex flex-rows'>
                <BsFileEarmarkBarGraph style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Loan Details</span>
            </div>,
            key: 'loan-details',
            children: <LoanDetails classname={'h-[66vh] overflow-y-auto'} data={value} receive={(e) => { receive(e); }} isEdit={isEdit} User={'LC'} loading={loading} />,
        },
        {
            label: <div className='flex flex-rows'>
                <BsFillPersonLinesFill style={{ fontSize: '20px', marginRight: 5 }} />
                <span>OFW Details</span>
            </div>,
            key: 'ofw-details',
            children: <OfwDetails classname={'h-[65vh] overflow-y-auto'} presaddress={presaddress} data={value} receive={(e) => { receive(e) }} BorrowerId={BorrowerId} User={'LC'} loading={loading} />,
        },
        {
            label: <div className='flex flex-rows'>
                <MdOutlineUploadFile style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Upload Documents</span>
            </div>,
            key: 'upload-documents',
            children: <UploadDocs classname={'h-[60vh] pt-[.5rem] overflow-y-hidden hover:overflow-y-auto'}
                ClientId={ClientId} FileType={FileType} Uploader={Uploader} User={'LC'} data={value} LoanStatus={LoanStatus} />,
        },
        {
            label: <div className='flex flex-rows'>
                <FaUserGroup style={{ fontSize: '20px', marginRight: 5 }} />
                <span>Character Reference</span>
            </div>,
            key: 'character-reference',
            children: <CharacterReference BorrowerId={BorrowerId} Creator={Uploader} User={'LC'} data={value} LoanStatus={LoanStatus} />,
        },
    ];
    return (
        <div className="relative w-full">
            <div className="absolute top-[-10px] right-0 mt-1 mr-4 text-right">
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

