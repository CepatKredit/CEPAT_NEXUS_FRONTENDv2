import React, { useRef } from 'react';
import { Tabs, Space, Anchor, ConfigProvider } from 'antd';
import { GrDuplicate } from "react-icons/gr";
import Deduplication from '../TabList/Deduplication';
import { AiOutlineAudit } from "react-icons/ai";
import { MdOutlineUpdate } from "react-icons/md";
import { MdOutlineUploadFile } from "react-icons/md";
import { IoTrailSign } from "react-icons/io5";
import { TbFileDescription } from "react-icons/tb";
import { LuCalculator } from "react-icons/lu";
import { MdOutlineCalculate } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import LastUpdateBy from '../TabList/LastUpdateBy';
import LoanDetails from '../TabList/LoanDetails';
import Sofia from '../TabList/Charges';
import OfwDetails from '../TabList/OfwDetails';
import BeneficiaryDetails from '../TabList/BeneficiaryDetails';
import InternalChecking from '../TabList/InternalChecking';
import UploadDocs from '../TabList/UploadDocs';
import CharacterReference from '../TabList/CharacterReference';
import AuditTrail from '../TabList/AuditTrail';
import { GetData } from '@utils/UserData';
import NDI from '../TabList/NDI';
import EmploymentHistoryTable from '../TabList/EmploymentHistoryTable';
import ApprovalAmount from '../TabList/ApprovalAmount';
import CreditHistory from '../TabList/CreditHistory';
import AssetTable from '../TabList/OwnedAssetTable';
import OwnedProperties from '../TabList/OwnedProperties';
import { GET_LIST } from '@api/base-api/BaseApi';
import { useNavigate, useParams } from 'react-router-dom';
import ReleaseDocuments from '../TabList/ReleaseDocuments';
import Charges from '../TabList/Charges';
import StatusRemarks from '../TabList/StatusRemarks';


function LoanTabs({ receive, presaddress, BorrowerId, sepcoborrowfname, sepBenfname, Uploader, FileType, value, valueAmount, LoanStatus, ClientId }) {
    const [isEdit, setEdit] = React.useState(false);
    const [activeKey, setActiveKey] = React.useState('CRAM');
    const [relativesCount, setRelativesCount] = React.useState(0);
    const navigate = useNavigate();
    const { id, tabs } = useParams();
    function onChangeTab(e) {
        setActiveKey(e);
        navigate(`${localStorage.getItem('SP')}/${id}/${e}`);
    }
    React.useEffect(() => { console.log(ClientId + 'LoanTabs') }, [ClientId])
    const fetchRelativesAndUpdateCount = async () => {
        if (BorrowerId) {
            try {
                const result = await GET_LIST(`/getRelatives/${BorrowerId}`);
                if (result?.list) {
                    const relativesCount = result.list.length;
                    setRelativesCount(relativesCount);
                    // console.log('Relatives count updated:', relativesCount);
                }
            } catch (error) {
                console.error('Error fetching relatives:', error);
            }
        }
    };
    //  const Lc_valid = !data.loanProd || ((data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL') && !data.ofwDeptDate)
    // || !data.loanPurpose || !data.loanType || !data.loanAmount || !data.loanTerms;

    //  const Marketing_valid = !data.loanProd || ((data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL') && !data.ofwDeptDate)
    //   || !data.loanPurpose || !data.loanType || !data.loanBranch || !data.loanAmount || !data.channel || !data.loanTerms;
    const toggleEditMode = async () => {
        if (isEdit) {
            if (GetData('ROLE') === 9) {
                if (Lc_valid) {
                    api['warning']({
                        message: 'Incomplete Details',
                        description: 'Please complete all required details.',
                    });
                } else {
                    updateData();
                }
            } else {
                if (Marketing_valid) {
                    api['warning']({
                        message: 'Incomplete Details',
                        description: 'Please complete all required details.',
                    });
                } else {
                    updateData();
                }
            }
        } else {
            setEdit(true)
        }
    };

    function GetChannelId(command) {
        var getId = Hckfi().find(x => x.value === command || x.label === command).value;
        return getId;
    }

    async function updateData() {
        //var BranchCode = await GetBranchCode(data.loanBranch);
        var PurposeId = await GetPurposeId(data.loanPurpose);
        const value = {
            LoanAppId: data.loanIdCode,
            BorrowersCode: data.ofwBorrowersCode,
            //Old Data
            //CRAM Data
            PrevAmount: '',
            CRAApprvRec: '',
            CRARemarks: '',
            OfwPoBRemarks: '',
            BenPoBRemarks: '',
            AcbPoBRemarks: '',
            BenRentAmount: '',
            AcbRentAmount: '',
            BenLandMark: '',
            AcbLandMark: '',
            SpSrcIncome: '',
            SpIncome: '',
            Religion: '',
            PEP: '',
            MarriedPBCB: '',
            RelationshipAdd: '',
            PEmployer: '',
            ContractDate: '',
            ContractDuration: '',
            UnliContract: '',
            JobCategory: '',
            EmpStatus: '',
            FCurrency: '',
            FSalary: '',
            PSalary: '',
            YrsOfwSeafarer: '',
            VesselName: '',
            VesselType: '',
            AllotName: '',
            AllotAmount: '',
            AllotChannel: '',
            ExactLocation: '',
            PossVacation: '',
            BenMarriedPBCB: '',
            BenSpSrcIncome: '',
            BenSpIncome: '',
            BenGrpChat: '',
            BenSrcIncome: '',
            BenReligion: '',
            BenRelateOfw: '',
            BenFormerOFW: '',
            BenLastReturn: '',
            BenPlanAbroad: '',
            BenPEP: '',
            BenRemarks: '',
            AcbSpSrcIncome: '',
            AcbSpIncome: '',
            AcbGrpChat: '',
            AcbSrcIncome: '',
            AcbReligion: '',
            AcbRelateOfw: '',
            AcbFormerOFW: '',
            AcbLastReturn: '',
            AcbPlanAbroad: '',
            AcbPEP: '',
            AcbRemarks: '',

            ModUser: jwtDecode(token).USRID

        };
        console.log('testtset', value)
        let result = await UpdateLoanDetails(value);
        if (result.data.status === "success") {
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });
            queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })
            setEdit(!isEdit);
        } else {
            api['warning']({
                message: 'Error: Failed to Update',
                description: "Fail Connection",
            });
        }
    }

    React.useEffect(() => {
        fetchRelativesAndUpdateCount();
    }, [BorrowerId]);
    const TabsItems = [
        {
            label: <div className='flex flex-rows'><GrDuplicate style={{ fontSize: '20px', marginRight: 5 }} /><span>Deduplication</span></div>,
            key: 'deduplication',
            children: <Deduplication data={value} />,
        },
        {
            label: <div className='flex flex-rows'><TbFileDescription style={{ fontSize: '20px', marginRight: 5 }} /><span>CRAM</span></div>,
            key: 'CRAM',
            children: (
                <div className='w-full flex flex-col'>
                    <StatusRemarks isEdit={!isEdit} User={'Credit'} data={value} />
                    <div className='flex flex-row'>
                        <div
                            id="scrollable-container" 
                            className="h-[58vh] xs:h-[30vh] sm:h-[33vh] md:h-[35vh] lg:h-[38vh] xl:h-[42vh] 2xl:h-[48vh] 3xl:h-[57vh] w-full overflow-y-auto mx-2 mb-9"
                        >
                            <div id='Loan-Details'>
                                <LoanDetails getTab={'loan-details'} classname={'h-auto'} data={value} receive={(e) => { receive(e); }} User={'Lp'} />
                            </div>
                            <div id='OFW-Details'>
                                <OfwDetails getTab={'ofw-details'} classname={'h-auto'} presaddress={presaddress} data={value} receive={(e) => { receive(e) }} BorrowerId={BorrowerId} User={'Lp'} />
                            </div>
                            <div id='Employment-History'>
                                <EmploymentHistoryTable data={value} isEdit={isEdit} User={'Lp'} />
                            </div>
                            <div id='Credit-History'>
                                <CreditHistory data={value} receive={receive} isEdit={isEdit} User={'Lp'} />
                            </div>
                            <div id='Owned-Assets'>
                                <AssetTable data={value} receive={receive} isEdit={isEdit} User={'Lp'} />
                            </div>
                            <div id='Owned-Properties'>
                                <OwnedProperties data={value} receive={receive} isEdit={isEdit} User={'Lp'} />
                            </div>
                            <div id='Character-Reference'>
                                <CharacterReference BorrowerId={BorrowerId} Creator={Uploader} data={value} User={'Lp'} LoanStatus={LoanStatus} />
                            </div>
                            <div id='Beneficiary-Details'>
                                <BeneficiaryDetails getTab={'beneficiary-details'} presaddress={presaddress} classname={'h-auto'} data={value} receive={(e) => { receive(e) }} BorrowerId={BorrowerId} User={'Lp'}
                                    sepcoborrowfname={sepcoborrowfname} sepBenfname={sepBenfname} />
                            </div>
                        </div>
                        <div className="bg-[#f0f0f0] p-2 rounded-lg rounded-tr-none rounded-br-none h-[30vh] xs:h-[30vh] sm:h-[33vh] md:h-[35vh] lg:h-[38vh] xl:h-[42vh] 2xl:h-[48vh] 3xl:h-[57vh]">
                            <ConfigProvider theme={{ token: { colorSplit: 'rgba(60,7,100,0.55)', colorPrimary: 'rgb(52,179,49)' } }}>
                                <Anchor
                                    replace
                                    affix={false}
                                    targetOffset={50}
                                    getContainer={() => document.getElementById('scrollable-container')} 
                                    items={[
                                        { key: 'Loan-Details', href: '#Loan-Details', title: 'Loan Details' },
                                        { key: 'OFW-Details', href: '#OFW-Details', title: 'OFW Details' },
                                        { key: 'Employment-History', href: '#Employment-History', title: 'Employment History' },
                                        { key: 'Credit-History', href: '#Credit-History', title: 'Credit History' },
                                        { key: 'Owned-Assets', href: '#Owned-Assets', title: 'Owned Assets' },
                                        { key: 'Owned-Properties', href: '#Owned-Properties', title: 'Owned Properties' },
                                        { key: 'Character-Reference', href: '#Character-Reference', title: 'Character Reference' },
                                        { key: 'Beneficiary-Details', href: '#Beneficiary-Details', title: 'Beneficiary Details' },
                                    ]}
                                />
                            </ConfigProvider>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            label: <div className='flex flex-rows'><MdOutlineCalculate style={{ fontSize: '20px', marginRight: 5 }} /><span>NDI</span></div>,
            key: 'NDI',
            children: <NDI valueAmount={valueAmount} event={(e) => { event(e) }} data={value} isEdit={true} activeKey={activeKey} isReadOnly={['70', '80'].includes(GetData('ROLE').toString())} />,
        },
        {
            label: <div className='flex flex-rows'><AiOutlineAudit style={{ fontSize: '20px', marginRight: 5 }} /><span>Internal Checking</span></div>,
            key: 'internal-checking',
            children: <InternalChecking classname={'h-[65vh] w-full mx-auto overflow-y-auto'} data={value} activeKey={activeKey} valueAmount={valueAmount} event={(e) => { event(e) }} ClientId={ClientId} FileType={FileType} Uploader={Uploader} />,

        },
        {
            label: <div className='flex flex-rows'><MdOutlineUploadFile style={{ fontSize: '20px', marginRight: 5 }} /><span>Upload Documents</span></div>,
            key: 'upload-documents',
            children: <UploadDocs ClientId={ClientId} FileType={FileType} Uploader={Uploader} data={value} LoanStatus={LoanStatus} User={'Lp'} Display={'USER'} />,
        },
        {
            label: <div className='flex flex-rows'><MdOutlineUploadFile style={{ fontSize: '20px', marginRight: 5 }} /><span>Release Documents</span></div>,
            key: 'release-documents',
            children: <ReleaseDocuments ClientId={ClientId} FileType={FileType} Uploader={Uploader} data={value} LoanStatus={LoanStatus} />,
        },
        {
            label: <div className="flex flex-rows"><MdApproval style={{ fontSize: '20px', marginRight: 5 }} /><span>Approval Amount</span> </div>,
            key: 'approval-amount',
            children: <ApprovalAmount valueAmount={valueAmount} event={(e) => { event(e) }} data={value} receive={(e) => { receive(e) }} />,
        },
        {
            label: <div className='flex flex-rows'><LuCalculator style={{ fontSize: '20px', marginRight: 5 }} /><span>Charges</span></div>,
            key: 'charges',
            children: <Charges data={value} />,
        },
        {
            label: <div className='flex flex-rows'><IoTrailSign style={{ fontSize: '20px', marginRight: 5 }} /><span>Audit Trail</span></div>,
            key: 'audit-trail',
            children: <AuditTrail />,
        },
        {
            label: <div className='flex flex-rows'><MdOutlineUpdate style={{ fontSize: '20px', marginRight: 5 }} /><span>Update Status</span></div>,
            key: 'last-update-by',
            children: <LastUpdateBy isEdit={true} data={value} />,
        },
    ];

    return (
        <>
            <Tabs defaultActiveKey={tabs} type="card" size="middle" onChange={onChangeTab} items={TabsItems} />
        </>
    );
}

export default LoanTabs;
