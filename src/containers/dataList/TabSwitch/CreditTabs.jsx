import React, { useEffect, useRef } from 'react';
import { Tabs, Space, Anchor, Button, notification, ConfigProvider, Modal, message } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { MdApproval } from "react-icons/md";
import { MdOutlineUpdate } from "react-icons/md";
import { GrDuplicate } from "react-icons/gr";
import { IoTrailSign } from "react-icons/io5";
import { MdOutlineUploadFile } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { MdOutlineCalculate } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";
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
import NDI from '../TabList/NDI';
import ApprovalAmount from '../TabList/ApprovalAmount';
import EmploymentHistoryTable from '../TabList/EmploymentHistoryTable';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import CreditHistory from '../TabList/CreditHistory';
import AssetTable from '../TabList/OwnedAssetTable';
import { GET_LIST } from '@api/base-api/BaseApi';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mmddyy } from '@utils/Converter';
import { jwtDecode } from 'jwt-decode';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import StatusRemarks from '../TabList/StatusRemarks';
import { FocusHook } from '@hooks/ComponentHooks';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import TriggerFields from '@utils/TriggerFields';

function CreditTabs({ presaddress, BorrowerId, sepcoborrowfname, sepBenfname, Uploader, value, valueAmount, ClientId, FileType, loading, User }) {
    //React.useEffect(() => { console.log(ClientId+' = CLientTabs.jsx') }, [ClientId])
    const [isEdit, setEdit] = React.useState(false);
    const [relativesCount, setRelativesCount] = React.useState(0);
    const { GetStatus } = ApplicationStatus();
    const { getAppDetails, updateAppDetails, showSaveButtonContext } = React.useContext(LoanApplicationContext)
    const [activeKey, setActiveKey] = React.useState(localStorage.getItem('activeTab') || 'deduplication');
    const navigate = useNavigate();
    const { id, tabs } = useParams();
    const { confirm } = Modal;

    function onChangeTab(e) {
        if (isEdit && e !== 'CRAM') {
            confirm({
                title: "Are you sure you want to cancel?",
                content: "All unsaved changes will be lost if you proceed.",
                okText: "Cancel Editing",
                cancelText: "Continue Editing",
                okType: "danger",
                centered: true,
                onOk() {
                    message.success("All changes were canceled.");
                    setActiveKey(e);
                    localStorage.setItem('activeTab', e);
                    navigate(`${localStorage.getItem('SP')}/${id}/${e}`);
                    setEdit(false)
                },
                onCancel() {
                    message.info("Continue editing.");
                    return;
                },
            });
        }
        setActiveKey(e);
        localStorage.setItem('activeTab', e);
        navigate(`${localStorage.getItem('SP')}/${id}/${e}`);
    }


    const [addCoborrower, setAddCoborrower] = React.useState(false);
    const token = localStorage.getItem('UTK')
    const queryClient = useQueryClient();
    const [api, contextHolder] = notification.useNotification();

    const addCoborrow = (getValue) => {
        setAddCoborrower(getValue);
    };



    const fetchRelativesAndUpdateCount = async () => {
        if (BorrowerId) {
            try {
                const result = await GET_LIST(`/GET/G35R/${BorrowerId}`);
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
    const loanRequired = ['CRAApprvRec', 'loanPurpose', 'loanProd', 'channelId', 'loanAmount']
    const ofwReqPersonal1 = ['ofwfname', 'ofwlname', 'ofwsuffix', 'ofwbdate', 'ofwgender', 'ofwmstatus']
    const ofwReqSpouse = ['ofwspouse', 'ofwspousebdate', 'SpSrcIncome', 'SpIncome']//If married/live in partner
    const ofwReqAdd1 = ['ofwresidences', 'ofwPresProv', 'ofwPresMunicipality', 'ofwPresBarangay', 'ofwPresStreet', 'ofwlosYear', 'ofwlosMonth', 'landmark', 'OfwPoBRemarks', 'collectionarea']
    const ofwReqAdd2 = ['ofwPermProv', 'ofwPermMunicipality', 'ofwPermBarangay', 'ofwPermStreet', 'ofwprovProv', 'ofwprovMunicipality', 'ofwprovBarangay', 'ofwprovStreet']
    const ofwEducAtt = ['ofwHighestEdu', 'ofwcourse', 'PEmployer', 'ofwcompany'] //only OFW
    const ofwReqVessel = ['VesselName', 'VesselType', 'VesselIMO'];
    const ofwRequiredOther = ['ofwemail', 'ofwmobile', 'ofwfblink', 'ofwgroupchat', 'RelationshipBen', 'Religion', 'PEP'];
    const ofwRequiredWork1 = ['ContractDate', 'ContractDuration', 'ofwcountry', 'JobCategory', 'ofwjobtitle', 'EmpStatus', 'FCurrency', 'FSalary', 'PSalary', 'YrsOfwSeafarer'];
    const ofwRequiredAllot = ['AllotName', 'AllotAmount', 'AllotChannel'];
    const benReqPersonal1 = ['benfname', 'benlname', 'bensuffix', 'benbdate', 'bengender', 'benmstatus']
    const benReqSpouse = ['benspouse', 'benspousebdate', 'BenSrcIncome', 'BenSpIncome']
    const benReqAdd = ['benpresprov', 'benpresmunicipality', 'benpresbarangay', 'benpresstreet', 'benstaymonths', 'benstayyears', 'BenLandMark', 'BenPoBRemarks']
    const benReqOther = ['bendependents', 'benemail', 'benmobile', 'benfblink', 'BenGrpChat', 'benrelationship', 'BenSrcIncome', 'BenReligion', 'BenPlanAbroad', 'BenPEP', 'BenFormerOFW']
    const acbReqPersonal = ['coborrowfname', 'coborrowlname', 'coborrowsuffix', 'coborrowbdate', 'coborrowgender', 'coborrowmstatus'];
    const acbReqSpouse = ['coborrowspousename', 'coborrowerspousebdate', 'AcbSpSrcIncome', 'AcbSpIncome'];
    const acbReqAdd = ['coborrowProv', 'coborrowMunicipality', 'coborrowBarangay', 'coborrowStreet', 'AcbStayMonths', 'AcbStayYears', 'AcbPoBRemarks', 'AcbLandMark'];
    const acbReqOther = ['coborrowdependents', 'coborrowemail', 'coborrowmobile', 'coborrowfblink', 'AcbGrpChat', 'AcbRelationship', 'AcbSrcIncome', 'AcbReligion', 'AcbFormerOFW', 'AcbPlanAbroad', 'AcbPEP'];


    const Required = () => {
        return [
            ...loanRequired,
            ...ofwReqPersonal1,
            ...(value.ofwmstatus === 2 || value.ofwmstatus === 5 || value.ofwmstatus === 6 ? ofwReqSpouse : []),
            ...ofwReqAdd1,
            ...((value.ofwresidences === 2 || value.ofwresidences === 3) ? ['ofwrent'] : []),
            ...ofwReqAdd2,
            ...(value.loanProd === '0303-WA' || value.loanProd === '0303-WL' ? ofwEducAtt : []), //Ofw only
            ...(!addCoborrower ? ['RelationshipAdd'] : []),
            ...(value.loanProd === '0303-VA' || value.loanProd === '0303-VL' ? ofwReqVessel : []),
            //...(value.loanProd === '0303-VA' ? ['ExactLocation'] : []),
            ...(value.loanProd === '0303-WA' ? ['PossVacation'] : []),
            ...ofwRequiredOther,
            ...ofwRequiredWork1,
            ...ofwRequiredAllot,
            //Beneficiary
            ...benReqPersonal1,
            ...(value.benmstatus === 2 || value.benmstatus === 5 || value.benmstatus === 6 ? benReqSpouse : []),
            ...benReqAdd,
            ...((value.benresidences === 2 || value.benresidences === 3) ? ['BenRentAmount'] : []),
            ...benReqOther,
            ...(value.BenFormerOFW === 1 ? ['BenLastReturn'] : []),
            ...(value.BenPlanAbroad === 1 ? ['BenRemarks'] : []),
            ...(!addCoborrower ? [
                //Additional Co-Borrower
                ...acbReqPersonal,
                ...(value.coborrowmstatus === 2 || value.coborrowmstatus === 5 || value.coborrowmstatus === 6 ? acbReqSpouse : []),
                ...acbReqAdd,
                ...((value.coborrowresidences === 2 || value.coborrowresidences === 3) ? ['AcbRentAmount'] : []),
                ...acbReqOther,
                ...(value.AcbFormerOFW === 1 ? ['AcbLastReturn'] : []),
                ...(value.AcbPlanAbroad === 1 ? ['AcbRemarks'] : []),
            ] : []),

        ].some(field => {
            // console.log(`field: ${field}, value:`, value[field]);
            const condition = value[field] === undefined || value[field] === '' || value[field] === false;
            //console.log(`result field ${field}:`, condition);
            return condition;
        });
    };

    const { focus } = React.useContext(LoanApplicationContext)


    const toggleEditMode = async () => {
        if (isEdit) { //Add validation
            //console.log(!Required())
            if (true) { // Assuming validation passes for this example
                //focus('ofwbdate') working na to
                updateData();
            } else {
                api['warning']({
                    message: 'Incomplete Details',
                    description: 'Please complete all required details.',
                });
            }
            setEdit(false)
        } else {
            setEdit(true)
        }
    };


    async function updateData() {

        if (getAppDetails.ofwfname === '' || getAppDetails.ofwlname === '' || getAppDetails.ofwbdate === '' || getAppDetails.ofwbdate === undefined) {
            api['warning']({
                message: 'Incomplete OFW Basic Information',
                description: "OFW Details must have a First Name, Last Name and Birthdate before saving",
            });
            return;
        }

        const data_loan = {
            LoanAppId: value.loanIdCode,
            BorrowersCode: value.ofwBorrowersCode,
            Tab: 1,
            PrevAmount: value.PrevAmount ? parseFloat(value.PrevAmount.toString().replaceAll(',', '')) : 0.00, //No function regarding here
            CRAApprvRec: value.CRAApprvRec ? parseFloat(value.CRAApprvRec.toString().replaceAll(',', '')) : 0.00,
            CRARemarks: value.CRARemarks || '',
            //ApprvAmount: value.ApprvAmount ? parseFloat(value.ApprvAmount.toString().replaceAll(',', '')) : null,
            Product: value.loanProd,
            DepartureDate: value.ofwDeptDate ? mmddyy(value.ofwDeptDate) : '',
            LoanType: value.loanType,
            Purpose: value.loanPurpose,
            Amount: value.loanAmount ? parseFloat(value.loanAmount.toString().replaceAll(',', '')) : 0.00,
            //Channel: value.channelId,
            //Consultant: value.consultName,
            //ConsultantNo: value.consultNumber,
            //ConsultantProfile: value.consultantfblink,

            ModUser: jwtDecode(token).USRID,
        }

        const data_ofw = {
            LoanAppId: value.loanIdCode,
            BorrowersCode: value.ofwBorrowersCode,
            Tab: 2,
            DuplicateChecker: false,
            FirstName: value.ofwfname,
            MiddleName: value.ofwmname || '',
            LastName: value.ofwlname,
            Suffix: value.ofwsuffix || null,
            BirthDay: value.ofwbdate ? mmddyy(value.ofwbdate) : '',
            Gender: value.ofwgender || null,
            MobileNo: value.ofwmobile || '',
            MobileNo2: value.ofwothermobile || '',
            Email: value.ofwemail || '',
            FbProfile: value.ofwfblink || '',
            GroupChat: value.ofwgroupchat || '',
            //Relationship: value.ofwrelationship || null,
            Religion: value.Religion || 0,
            PEP: value.PEP || null,
            CivilStatus: value.ofwmstatus || 0,
            SpouseName: value.ofwspouse || '',
            SpouseBirthday: value.ofwspousebdate ? mmddyy(value.ofwspousebdate) : '',
            SpSrcIncome: value.SpSrcIncome || 0,
            SpIncome: value.SpIncome ? parseFloat(value.SpIncome.toString().replaceAll(',', '')) : 0.00,
            MarriedPBCB: value.MarriedPBCB ? 1 : 0,
            RelationshipBen: value.RelationshipBen || 0,
            RelationshipAdd: value.RelationshipAdd || 0, // if there is additional cb
            Dependent: value.ofwdependents,

            ProvinceId: value.ofwPresProv || '',
            MunicipalityId: value.ofwPresMunicipality || '',
            BarangayId: value.ofwPresBarangay || '',
            Address1: value.ofwPresStreet || '',
            Ownership: value.ofwresidences || 0,
            RentAmount: value.ofwrent ? parseFloat(value.ofwrent.toString().replaceAll(',', '')) : 0.00,
            Landmark: value.landmark || '',
            StayYears: value.ofwlosYear || 0,
            StayMonths: value.ofwlosMonth || 0,
            CollectionArea: value.collectionarea || '',
            OfwPoBRemarks: value.OfwPoBRemarks || '',

            IsCurrPerm: value.ofwSameAdd ? 1 : 0,
            PerProvinceId: value.ofwPermProv || '',
            PerMunicipalityId: value.ofwPermMunicipality || '',
            PerBarangayId: value.ofwPermBarangay || '',
            PerAddress1: value.ofwPermStreet || '',

            IsPermProv: value.ofwProvSameAdd ? 1 : 0,
            ProAddress1: value.ofwprovStreet || '',
            ProBarangayId: value.ofwprovBarangay || '',
            ProMunicipalityId: value.ofwprovMunicipality || '',
            ProProvinceId: value.ofwprovProv || '',

            ValidId: value.ofwvalidid ? parseInt(value.ofwvalidid) : 0,
            ValidIdNo: value.ofwidnumber || '',

            Country: value.ofwcountry || '',
            JobCategory: value.JobCategory || 0,
            JobTitle: value.ofwjobtitle || '',
            PEmployer: value.PEmployer || '',
            EmpStatus: value.EmpStatus || 0,
            FCurrency: value.FCurrency || '',
            FSalary: value.FSalary ? parseFloat(value.FSalary.toString().replaceAll(',', '')) : 0.00,
            PSalary: value.PSalary ? parseFloat(value.PSalary.toString().replaceAll(',', '')) : 0.00,
            Salary: value.ofwsalary ? parseFloat(value.ofwsalary.toString().replaceAll(',', '')) : 0.00,
            ContractDate: value.ContractDate ? mmddyy(value.ContractDate) : '',
            ContractDuration: value.ContractDuration ? parseInt(value.ContractDuration) : null,
            UnliContract: value.UnliContract ? 1 : 0,//Use when checkbox
            //departure date in the loan details
            YrsOfwSeafarer: value.YrsOfwSeafarer || null,
            //++++++ For shipping vessel info ++++++++++++
            VesselName: value.VesselName || null,
            VesselType: value.VesselType || null,
            VesselIMO: value.VesselIMO || null,
            ExactLocation: value.ExactLocation || null,
            PossVacation: value.PossVacation || null,
            //+++++++++++++++++++++++++++++++
            AllotName: value.AllotName || null,
            AllotAmount: value.AllotAmount ? parseFloat(value.AllotAmount.toString().replaceAll(',', '')) : 0.00,
            AllotChannel: value.AllotChannel || 0,
            School: value.ofwschool || '',
            //Dont know if it is included
            Employer: value.ofwcompany || null,//agency
            EducationLevel: value.ofwHighestEdu || null,
            Course: value.ofwcourse || '',

            ModUser: jwtDecode(token).USRID,

        }
        const data_bene = {
            LoanAppId: value.loanIdCode,
            BorrowersCode: value.ofwBorrowersCode,
            Tab: 3,
            BenFirstName: value.benfname || '',
            BenMiddleName: value.benmname || '',
            BenLastName: value.benlname || '',
            BenSuffix: value.bensuffix || null,
            BenBirthday: value.benbdate ? mmddyy(value.benbdate) : '',
            BenGender: value.bengender || null,
            BenEmail: value.benemail || '',
            BenMobileNo: value.benmobile || null,
            BenMobileNo2: value.benothermobile || null,
            BenDependent: parseInt(value.bendependents) || 0,
            BenCivilStatus: value.benmstatus || 0,
            BenSpouseName: value.benspouse || '',
            BenSpouseBirthday: mmddyy(value.benspousebdate),
            BenMarriedPBCB: value.BenMarriedPBCB == 1 ? 1 : 0,
            BenSpSrcIncome: value.BenSpSrcIncome || null,
            BenSpIncome: value.BenSpIncome ? parseFloat(value.BenSpIncome.toString().replaceAll(',', '')) : 0.00,
            BenFbProfile: value.benfblink || '',
            BenGrpChat: value.BenGrpChat || '',
            BenRelationship: value.benrelationship || 0,
            BenSrcIncome: value.BenSrcIncome || null,
            BenReligion: value.BenReligion || null,
            BenFormerOFW: value.BenFormerOFW || null,
            BenLastReturn: value.BenLastReturn || null,
            BenPlanAbroad: value.BenPlanAbroad || null,
            BenRemarks: value.BenRemarks || null,
            BenPEP: value.BenPEP || null,

            BenOwnership: value.benresidences || 0,
            BenStayYears: value.benstayyears || 0,
            BenStayMonths: value.benstaymonths || 0,
            BenProvinceId: value.benpresprov || '',
            BenMunicipalityId: value.benpresmunicipality || '',
            BenBarangayId: value.benpresbarangay || '',
            BenAddress1: value.benpresstreet || '',
            BenPoBRemarks: value.BenPoBRemarks || '',
            BenRentAmount: value.BenRentAmount ? parseFloat(value.BenRentAmount.toString().replaceAll(',', '')) : 0.00,
            BenLandMark: value.BenLandMark || '',

            ModUser: jwtDecode(token).USRID,

            //Additiona CB
            ...(!addCoborrower && { //if acb is showed
                AcbFirstName: value.coborrowfname || '',
                AcbMiddleName: value.coborrowmname || '',
                AcbLastName: value.coborrowlname || '',
                AcbSuffix: value.coborrowsuffix || null,
                AcbBirthday: value.coborrowbdate ? mmddyy(value.coborrowbdate) : null,
                AcbGender: value.coborrowgender || null,
                AcbEmail: value.coborrowemail || '',
                AcbMobileNo: value.coborrowmobile || null,
                AcbMobileNo2: value.coborrowothermobile || null,
                AcbDependent: value.coborrowdependents || 0,
                AcbCivilStatus: value.coborrowmstatus || 0,
                AcbSpouseName: value.coborrowspousename || null,
                AcbSpouseBirthday: mmddyy(value.coborrowerspousebdate),
                AcbSpSrcIncome: value.AcbSpSrcIncome || null,
                AcbSpIncome: value.AcbSpIncome ? parseFloat(value.AcbSpIncome.toString().replaceAll(',', '')) : 0.00,
                AcbFbProfile: value.coborrowfblink,
                AcbGrpChat: value.AcbGrpChat || '',
                AcbRelationship: value.AcbRelationship || 0,
                AcbSrcIncome: value.AcbSrcIncome || 0,
                AcbReligion: value.AcbReligion || 0,
                AcbFormerOFW: value.AcbFormerOFW ? 1 : 0,
                AcbLastReturn: value.AcbLastReturn || '',
                AcbPlanAbroad: value.AcbPlanAbroad ? (value.AcbPlanAbroad == 1 ? 1 : 0) : null,
                AcbRemarks: value.AcbRemarks || '',
                AcbPEP: value.AcbPEP ? 1 : 0,

                AcbOwnership: value.coborrowresidences || 0,
                AcbAddress1: value.coborrowStreet || '',
                AcbBarangay: value.coborrowBarangay || '',
                AcbMunicipality: value.coborrowMunicipality || '',
                AcbProvince: value.coborrowProv || '',
                AcbStayMonths: value.AcbStayMonths || 0,
                AcbStayYears: value.AcbStayYears || 0,
                AcbLandMark: value.AcbLandMark || '',
                AcbPoBRemarks: value.AcbPoBRemarks || '',
                AcbRentAmount: value.AcbRentAmount ? parseFloat(value.AcbRentAmount.toString().replaceAll(',', '')) : 0.00,
            })
        };

        const acb_data = {
            BorrowersCode: BorrowerId,
            Tab: 3,
            AcbFirstName: value.coborrowfname || '',
            AcbMiddleName: value.coborrowmname || '',
            AcbLastName: value.coborrowlname || '',
            AcbSuffix: value.coborrowsuffix || 0,
            AcbBirthday: value.coborrowbdate ? mmddyy(value.coborrowbdate) : '',
            AcbGender: value.coborrowgender || 0,
            AcbCivilStatus: value.coborrowmstatus || 0,
            AcbDependent: value.coborrowdependents || 0,
            AcbEmail: value.coborrowemail || '',
            AcbMobileNo: value.coborrowmobile || '',
            AcbMobileNo2: value.coborrowothermobile || '',
            AcbFbProfile: value.coborrowfblink || '',
            AcbSpouseName: value.coborrowspousename || '',
            AcbSpouseBirthday: value.coborrowerspousebdate ? mmddyy(value.coborrowerspousebdate) : '',
            AcbOwnership: value.coborrowresidences || 0,
            AcbAddress1: value.coborrowStreet || '',
            AcbBarangayId: value.coborrowBarangay || '',
            AcbMunicipalityId: value.coborrowMunicipality || '',
            AcbProvinceId: value.coborrowProv || '',
            AcbStayMonths: value.AcbStayMonths || 0,
            AcbStayYears: value.AcbStayYears || 0,
            RecUser: jwtDecode(token).USRID
        };

        const checkLoan = {
            LoanAppId: value.loanIdCode,
            FirstName: value.ofwfname,
            LastName: value.ofwlname,
            Birthday: value.ofwbdate,
        }
        console.log('Update ', data_loan, data_ofw)
        if (value.ofwfname !== null || value.ofwlname !== null) {
            await axios.post('/POST/P47CL', checkLoan)
                .then((result) => {
                    if (result.data.list != 0) {
                        api['info']({
                            message: 'Loan Already Exists',
                            description: `Please be advised that you have an ongoing application with Cepat Kredit ${result.data?.list[0].branch} branch with Loan Application No. 
                            ${result.data?.list[0].loanAppCode}. For further concerns, please email our Customer Service Department at customerservice@cepatkredit.com. Thank you!`
                        });
                        return; //stop the process
                    } else {
                        console.log('Continue....')
                    }
                })
                .catch((error) => {
                    console.log(error);
                    api['warning']({
                        message: 'Error Check Duplicate: Failed API',
                        description: "Failed to Connect into API",
                    });
                    return; //stop the process
                });
        }

        if (!sepcoborrowfname && !addCoborrower) { //if no add coborrow and showaddcoborrow is true
            //Start to insert Acb and then update all
            //   console.log('Insert ACB', !sepcoborrowfname, !addCoborrower, acb_data)
            try {
                const result2 = await axios.post('/POST/P43AACB', acb_data);
                api[result2.data.status]({
                    message: result2.data.message,
                    description: result2.data.description
                });

            } catch (error) {
                console.log('Error ', error)
                api['warning']({
                    message: 'Error Insert ACB: Failed API',
                    description: "Failed to Connect into API",
                });
                return; //Important !!!
            }
        }

        try {
            const [resLoan, resOFW, resBene] = await Promise.all([UpdateLoanDetails(data_loan), UpdateLoanDetails(data_ofw), UpdateLoanDetails(data_bene)]);
            if (resLoan.data.status === "success" && resOFW.data.status === "success" && resBene.data.status === "success") {
                api[resLoan.data.status]({
                    message: resLoan.data.message,
                    description: resLoan.data.description,
                });

            } else {

                api['warning']({
                    message: 'Update Failed.',
                    description: "Something went wrong.",
                });
            }
        } catch (error) {
            console.log(error)
            api['warning']({
                message: 'Update Failed.',
                description: "Something went wrong.",
            });
        }
        queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
        setEdit(!isEdit);
    }
    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    const GetVesselInfo = useQuery({
        queryKey: ['GetVesselInfo'],
        queryFn: async () => {
            if (!value || !value.VesselIMO || value.VesselIMO.length < 6) return null;
            try {
                const result = await axios.get(`/GET/G113SVD/${value.VesselIMO}`);
                updateAppDetails({ name: 'VesselInfo', value: typeof result.data === 'string' ? result.data : 'No Gathered Data!' });
            } catch (error) {
                updateAppDetails({ name: 'VesselInfo', value: 'No Gathered Data!' });
                // console.log(error);
            }
            return null;
        },
        enabled: !!value.VesselIMO,
    });

    React.useEffect(() => {
        const fetchVesselInfo = async () => {
            if (GetVesselInfo.refetch) {
                await GetVesselInfo.refetch();
            }
        };
        fetchVesselInfo();
        return () => {
            if (GetVesselInfo.cancel) {
                GetVesselInfo.cancel();
            }
        };
    }, [value.VesselIMO]);

    React.useEffect(() => {
        if (BorrowerId !== '' || BorrowerId !== undefined) {
            fetchRelativesAndUpdateCount();
        }
    }, [BorrowerId]);

    function DISABLE_STATUS(LOCATION) {
        if (GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '55') {
            {
                if (LOCATION === '/ckfi/for-approval' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('CRA')
                    return true
                }
                else { return false }
            }
        }
        else if (GetData('ROLE').toString() === '60') {
            if (LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/queue-bucket' || LOCATION === '/ckfi/under-lp'
                || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                console.log('CRO')
                return true
            }
            else { return false }
        }
    }
    const disabledStatuses = [
        'FOR APPROVAL', 'RELEASED', 'CANCELLED', 'DECLINED', 'FOR RE-APPLICATION',
        'FOR DOCUSIGN', 'OK FOR DOCUSIGN', 'TAGGED FOR RELEASE', 'ON WAIVER',
        'CONFIRMATION', 'CONFIRMED', 'UNDECIDED', 'FOR DISBURSEMENT', 'RETURN TO LOANS PROCESSOR', 'APPROVED (TRANS-OUT)',
         'COMPLIED - LACK OF DOCUMENTS'
    ];


    // Utility function for dynamic anchor items
    const getAnchorItems = () => {
        if (["0303-DHW", "0303-VL", "0303-WL"].includes(getAppDetails.loanProd)) {
            // For specific loan products
            return [
                { key: 'Loan-Details', href: '#Loan-Details', title: 'Loan Details' },
                { key: 'OFW-Details', href: '#OFW-Details', title: 'OFW Details' },
                { key: 'Employment-History', href: '#Employment-History', title: 'Employment History' },
                { key: 'Credit-History', href: '#Credit-History', title: 'Credit History' },
                { key: 'Owned-Assets', href: '#Owned-Assets', title: 'Owned Assets' },
                { key: 'Character-Reference', href: '#Character-Reference', title: 'Character Reference' },
                { key: 'Beneficiary-Details', href: '#Beneficiary-Details', title: 'Beneficiary Details' },
            ];
        } else {
            // Default anchor items for other loan products
            return [
                { key: 'Loan-Details', href: '#Loan-Details', title: 'Loan Details' },
                { key: 'Beneficiary-Details', href: '#Beneficiary-Details', title: 'Beneficiary Details' },
                { key: 'OFW-Details', href: '#OFW-Details', title: 'OFW Details' },
                { key: 'Employment-History', href: '#Employment-History', title: 'Employment History' },
                { key: 'Credit-History', href: '#Credit-History', title: 'Credit History' },
                { key: 'Owned-Assets', href: '#Owned-Assets', title: 'Owned Assets' },
                { key: 'Character-Reference', href: '#Character-Reference', title: 'Character Reference' },
            ];
        }
    };


    /*React.useEffect(() => {
        console.log('jjjjjjjjjjjjjjjjjjjjjj', getAppDetails.MarriedPBCB)
    },[getAppDetails])*/


    //Trigger Fields
    TriggerFields('CREDIT');

    const TabsItems = [
        {
            label: <div className='flex flex-row'><GrDuplicate style={{ fontSize: '20px', marginRight: 5 }} /><span>Deduplication</span></div>,
            key: 'deduplication',
            children: <Deduplication data={value} />,
        },
        {
            label: (
                <div className='flex flex-row'>
                    <TbFileDescription style={{ fontSize: '20px', marginRight: 5 }} />
                    <span>CRAM</span>
                </div>
            ),
            key: 'CRAM',
            children: (
                <div className='w-full flex flex-col'>
                    <StatusRemarks isEdit={!isEdit} User={'Credit'} data={value} />
                    <div className='flex flex-row'>
                        <div
                            id="scrollable-container"
                            className={`w-full overflow-y-auto mx-2 mb-9 ${isEdit ? 'h-[70vh] xs:h-[40vh] sm:h-[43vh] md:h-[45vh] lg:h-[48vh] xl:h-[52vh] 2xl:h-[58vh] 3xl:h-[65vh]' : 'h-[58vh] xs:h-[30vh] sm:h-[33vh] md:h-[35vh] lg:h-[38vh] xl:h-[42vh] 2xl:h-[48vh] 3xl:h-[57vh]'}`}
                        >
                            <div id='Loan-Details'>
                                <LoanDetails loading={loading} getTab={'loan-details'} classname={'h-auto'} data={value} receive={(e) => { updateAppDetails(e); }} creditisEdit={isEdit} User={'Credit'} />
                            </div>
                            {getAppDetails.loanProd === '0303-DHW' || getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-WL' ? (
                                <>
                                    {/* Container A */}
                                    <div id='OFW-Details'>
                                        <OfwDetails
                                            loading={loading}
                                            isEditCRAM={isEdit}
                                            getTab={'ofw-details'}
                                            classname={'h-auto'}
                                            presaddress={presaddress}
                                            data={value}
                                            receive={(e) => { updateAppDetails(e) }}
                                            BorrowerId={BorrowerId}
                                            creditisEdit={isEdit}
                                            User={'Credit'}
                                            addCoborrower={addCoborrower}
                                        />
                                        {/* Additional Sections inside Container A */}
                                        <div id="Employment-History" className="w-full">
                                            <EmploymentHistoryTable data={value} isEdit={isEdit} />
                                        </div>
                                        <div id='Credit-History' className="w-full ">
                                            <CreditHistory data={value} receive={updateAppDetails} isEdit={isEdit} />
                                        </div>
                                        <div id='Owned-Assets' className="w-full">
                                            <AssetTable data={value} receive={updateAppDetails} isEdit={isEdit} />
                                        </div>
                                        <div id='Character-Reference' className="w-full">
                                            <CharacterReference
                                                loading={loading}
                                                BorrowerId={BorrowerId}
                                                Creator={Uploader}
                                                data={value}
                                                User={'Credit'}
                                                isEdit={isEdit}
                                            />
                                        </div>
                                    </div>
                                    {/* Container B */}
                                    <div id='Beneficiary-Details'>
                                        <BeneficiaryDetails
                                            loading={loading}
                                            getTab={'beneficiary-details'}
                                            presaddress={presaddress}
                                            classname={'h-auto'}
                                            data={value}
                                            receive={(e) => { updateAppDetails(e); }}
                                            BorrowerId={BorrowerId}
                                            User={'Credit'}
                                            creditisEdit={isEdit}
                                            sepcoborrowfname={sepcoborrowfname}
                                            sepBenfname={sepBenfname}
                                            setAddCoborrow={addCoborrow}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Switch positions */}
                                    {/* Container B */}
                                    <div id='Beneficiary-Details'>
                                        <BeneficiaryDetails
                                            loading={loading}
                                            getTab={'beneficiary-details'}
                                            presaddress={presaddress}
                                            classname={'h-auto'}
                                            data={value}
                                            receive={(e) => { updateAppDetails(e); }}
                                            BorrowerId={BorrowerId}
                                            User={'Credit'}
                                            creditisEdit={isEdit}
                                            sepcoborrowfname={sepcoborrowfname}
                                            sepBenfname={sepBenfname}
                                            setAddCoborrow={addCoborrow}
                                        />
                                    </div>
                                    {/* Container A */}
                                    <div
                                        id="OFW-Details"
                                        style={{
                                            marginTop: isEdit
                                                ? getAppDetails?.MarriedPBCB === 1
                                                    ? showSaveButtonContext
                                                        ? '50rem'
                                                        : '125rem'
                                                    : getAppDetails?.MarriedPBCB !== 1
                                                        ? showSaveButtonContext
                                                            ? '77rem'
                                                            : '152rem'
                                                        : undefined
                                                : undefined, // Fallback if isEdit is false
                                            transition: 'margin-top 0.5s ease', // Smooth transition for marginTop
                                        }}
                                    >

                                        <OfwDetails
                                            loading={loading}
                                            isEditCRAM={isEdit}
                                            getTab={'ofw-details'}
                                            presaddress={presaddress}
                                            data={value}
                                            classname={'h-auto'}
                                            receive={(e) => { updateAppDetails(e) }}
                                            BorrowerId={BorrowerId}
                                            creditisEdit={isEdit}
                                            User={'Credit'}
                                            addCoborrower={addCoborrower}
                                        />
                                        {/* Additional Sections inside Container A */}
                                        <div id="Employment-History" className="w-full">
                                            <EmploymentHistoryTable data={value} isEdit={isEdit} />
                                        </div>
                                        <div id='Credit-History' className="w-full ">
                                            <CreditHistory data={value} receive={updateAppDetails} isEdit={isEdit} />
                                        </div>
                                        <div id='Owned-Assets' className="w-full">
                                            <AssetTable data={value} receive={updateAppDetails} isEdit={isEdit} />
                                        </div>
                                        <div id='Character-Reference' className="w-full">
                                            <CharacterReference
                                                loading={loading}
                                                BorrowerId={BorrowerId}
                                                Creator={Uploader}
                                                data={value}
                                                User={'Credit'}
                                                isEdit={isEdit}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                        <div className={`bg-[#f0f0f0] p-2 rounded-lg rounded-tr-none rounded-br-none ${isEdit ? 'h-[40vh] xs:h-[40vh] sm:h-[43vh] md:h-[45vh] lg:h-[48vh] xl:h-[52vh] 2xl:h-[58vh] 3xl:h-[65vh]' : 'h-[30vh] xs:h-[30vh] sm:h-[33vh] md:h-[35vh] lg:h-[38vh] xl:h-[42vh] 2xl:h-[48vh] 3xl:h-[57vh]'}`}>
                            <ConfigProvider theme={{ token: { colorSplit: 'rgba(60,7,100,0.55)', colorPrimary: 'rgb(52,179,49)' } }}>

                                <Anchor
                                    replace
                                    affix={false}
                                    targetOffset={50}
                                    getContainer={() => document.getElementById('scrollable-container')}
                                    items={getAnchorItems()}
                                />

                            </ConfigProvider>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            label: (<div className='flex flex-row'> <MdOutlineCalculate style={{ fontSize: '20px', marginRight: 5 }} /><span>NDI</span></div>),
            key: 'NDI',
            children: <NDI valueAmount={valueAmount} event={(e) => { event(e) }} isEdit={true} data={value} isReadOnly={true} activeKey={activeKey} sepcoborrowfname={sepcoborrowfname} />
        },
        {
            label: <div className='flex flex-row'><AiOutlineAudit style={{ fontSize: '20px', marginRight: 5 }} /><span>Internal Checking</span></div>,
            key: 'internal-checking',
            children: <InternalChecking classname={'h-[65vh] w-full mx-auto overflow-y-auto'} data={value} activeKey={activeKey} valueAmount={valueAmount} event={(e) => { event(e) }} sepcoborrowfname={sepcoborrowfname} ClientId={ClientId} Uploader={Uploader} />,
        },
        {
            label: <div className='flex flex-row'><MdOutlineUploadFile style={{ fontSize: '20px', marginRight: 5 }} /><span>Upload Documents</span></div>,
            key: 'upload-documents',
            children: <UploadDocs Display={'USER'} classname={'xs:h-[35vh] sm:h-[50vh] md:h-[50vh] lg:h-[55vh] xl:h-[50vh] 2xl:h-[48vh] 3xl:h-[52vh] pt-[.3rem] overflow-y-hidden hover:overflow-y-auto'} ClientId={ClientId} FileType={FileType} Uploader={Uploader} data={value} LoanStatus={GetStatus} User={'Credit'} ModUser={jwtDecode(token).USRID} />,
        },
        GetData('ROLE').toString() === '60' && {
            label: <div className="flex flex-row"><MdApproval style={{ fontSize: '20px', marginRight: 5 }} /><span>Approval Amount</span> </div>,
            key: 'approval-amount',
            children: <ApprovalAmount classname={'h-[14rem]'} loading={loading} valueAmount={valueAmount} event={(e) => { event(e) }} data={value} receive={(e) => { updateAppDetails(e) }} />,
        },
        {
            label: <div className='flex flex-row'><IoTrailSign style={{ fontSize: '20px', marginRight: 5 }} /><span>Audit Trail</span></div>,
            key: 'audit-trail',
            children: <AuditTrail />,
        },
        {
            label: <div className='flex flex-row'><MdOutlineUpdate style={{ fontSize: '20px', marginRight: 5 }} /><span>Update Status</span></div>,
            key: 'last-update-by',
            children: <div className="max-h-[80vh] overflow-y-auto"><LastUpdateBy isEdit={true} data={value} setActiveKey={setActiveKey} /></div>,
        },
    ].filter(Boolean);

    React.useEffect(() => {
        setActiveKey(tabs || 'deduplication');
        //console.log("HALAAA", tabs)
    }, [tabs]);

    return (
        <div>
            {contextHolder}
            <div className="w-full">
                <Tabs
                    defaultActiveKey={tabs}
                    activeKey={activeKey}
                    type="card"
                    size="middle"
                    onChange={onChangeTab}
                    items={TabsItems}
                />
                { activeKey === 'CRAM' && value.loanIdCode !== '' && !DISABLE_STATUS(localStorage.getItem('SP')) && !disabledStatuses.includes(GetStatus) && (
                    <ConfigProvider
                        theme={{
                            token: {
                                fontSize: 14,
                                borderRadius: 8,
                                fontWeightStrong: 600,
                                colorText: '#ffffff',
                            },
                        }}
                    >
                        <div className="flex justify-center items-center mr-40 mb-2 xs:mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-14 3xl:mb-16 space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-8">
                            {isEdit ? (
                                <>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#2b972d',
                                                colorPrimaryHover: '#34b330',
                                            },
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            icon={<SaveOutlined />}
                                            onClick={toggleEditMode}
                                            size="large"
                                            className="-mt-5"
                                        >
                                            SAVE
                                        </Button>
                                    </ConfigProvider>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#dc3545',
                                                colorPrimaryHover: '#f0aab1',
                                            },
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            icon={<CloseOutlined />}
                                            onClick={() => { setEdit(false); queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true }); }}
                                            size="large"
                                            className="-mt-5"
                                        >
                                            CANCEL
                                        </Button>
                                    </ConfigProvider>
                                </>
                            ) : (
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#3b0764', // Purple color for EDIT button
                                            colorPrimaryHover: '#6b21a8', // Darker purple on hover
                                        },
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={toggleEditMode}
                                        size="large"
                                        className="-mt-5"
                                    >
                                        EDIT
                                    </Button>
                                </ConfigProvider>
                            )}
                        </div>
                    </ConfigProvider>
                )}
            </div>
        </div>
    );
}

export default CreditTabs;