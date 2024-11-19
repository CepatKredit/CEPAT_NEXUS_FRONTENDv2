import React, { useContext, useState } from 'react';
import { notification, Spin, ConfigProvider } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { toDecrypt, mmddyy } from '@utils/Converter';
import MarketingTabs from './TabSwitch/MarketingTabs';
import CreditTabs from './TabSwitch/CreditTabs';
import LoanTabs from './TabSwitch/LoanTabs';
import LcTabs from './TabSwitch/LcTabs';
import AccountingTabs from './TabSwitch/AccountingTabs';
import { jwtDecode } from 'jwt-decode';
import { GetData } from '@utils/UserData';
import TriggerFields from '@utils/TriggerFields';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function LoanApplicationInfo() {
    const { GET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    const [api, contextHolder] = notification.useNotification();
    const [sepcoborrowfname, setCoborrowfname] = React.useState('');
    const [sepBenfname, setBenfname] = React.useState('');
    const { getAppDetails, setAppDetails, populateClientDetails } = React.useContext(LoanApplicationContext)


    React.useEffect(() => {
        ClientDataListQuery.refetch();
        SET_LOADING_INTERNAL('ClientDataInfo', true);
    }, [localStorage.getItem('SIDC')]);

    const [getDetails, setDetails] = React.useState({
        ClientId: '',
        FileType: '',
        BorrowerId: ''
    })

    const ClientDataListQuery = useQuery({
        queryKey: ['ClientDataListQuery'],
        queryFn: async () => {
            try {
                const result = await GET_LIST(`/GroupGet/G3CD/${toDecrypt(localStorage.getItem('SIDC'))}`);
                const data = result.list;
                console.log(data)
                setDetails({
                    ClientId: data?.LoanDetails?.loanAppId,
                    FileType: data?.LoanDetails?.productId,
                    BorrowerId: data?.OfwDetails?.borrowersCode
                })
                setCoborrowfname(data?.CoborrowDetails?.firstName || '');
                setBenfname(data?.BeneficiaryDetails?.firstName || '')
                setAppDetails(prevDetails => ({
                    ...prevDetails,
                    loanAppCode: data?.LoanDetails?.loanAppCode || '',
                    loanIdCode: data?.LoanDetails?.loanAppId || '',
                    loanDateDep: data?.LoanDetails?.departureDate ? mmddyy(data.LoanDetails.departureDate) : '',
                    loanCreated: data?.LoanDetails?.recDate ? mmddyy(data.LoanDetails.recDate) : 'No Date Created!',
                    loanAppStat: data?.LoanDetails?.status || '',
                    loanAppStatId: data?.LoanDetails?.statusId || '',
                    loanProd: data?.LoanDetails?.productId || '',
                    ofwDeptDate: data?.LoanDetails?.departureDate || '',
                    loanPurpose: data?.LoanDetails?.purposeId || '',
                    loanType: data?.LoanDetails?.loanTypeId || '',
                    loanBranchId: data?.LoanDetails?.branchId || '',
                    loanBranch: data?.LoanDetails?.branch || '',
                    loanAmount: data?.LoanDetails?.amount || '',
                    channel: data?.LoanDetails?.channel || '',
                    channelId: data?.LoanDetails?.channelId || '',
                    loanTerms: data?.LoanDetails?.terms || '',
                    consultName: data?.LoanDetails?.consultant || '',
                    consultNumber: data?.LoanDetails?.consultantNo || '',
                    consultantfblink: data?.LoanDetails?.consultantProfile || '',

                    statusCraf: data?.LoanDetails?.statusCraf || '',
                    statusFfcc: data?.LoanDetails?.statusFfcc || '',
                    statusAgencyVerification: data?.LoanDetails?.statusAgencyVerification || '',
                    statusKaiser: data?.LoanDetails?.statusKaiser || '',
                    statusMasterlist: data?.LoanDetails?.statusMasterlist || '',
                    statusShareLocation: data?.LoanDetails?.statusShareLocation || '',
                    statusVideoCall: data?.LoanDetails?.statusVideoCall || '',
                    // OFW Details
                    ofwBorrowersCode: data?.OfwDetails?.borrowersCode || '',
                    ofwfname: data?.OfwDetails?.firstName || '',
                    ofwmname: data?.OfwDetails?.middleName || '',
                    ofwlname: data?.OfwDetails?.lastName || '',
                    ofwsuffix: data?.OfwDetails?.suffix || '',
                    ofwbdate: data?.OfwDetails?.birthdate ? mmddyy(data.OfwDetails.birthdate) : '',
                    ofwgender: data?.OfwDetails?.genderId || '',
                    ofwmstatus: data?.OfwDetails?.civilStatusId || '',
                    ofwspouse: data?.OfwDetails?.spouseName || '',
                    ofwspousebdate: data?.OfwDetails?.spouseBirthday ? mmddyy(data?.OfwDetails?.spouseBirthday) : '',
                    ofwemail: data?.OfwDetails?.email || '',
                    ofwmobile: data?.OfwDetails?.mobileNo || '',
                    ofwothermobile: data?.OfwDetails?.mobileNo2 || '',
                    ofwfblink: data?.OfwDetails?.fbProfile || '',
                    ofwdependents: data?.OfwDetails?.withDependent || '',
                    ofwvalidid: data?.OfwDetails?.validId || '',
                    ofwidnumber: data?.OfwDetails?.validIdNo || '',
                    ofwcountry: data?.OfwDetails?.country || '',
                    ofwjobtitle: data?.OfwDetails?.jobTitle || '',
                    ofwcompany: data?.OfwDetails?.employer || '',
                    ofwsalary: data?.OfwDetails?.salary || '',
                    ofwHighestEdu: data?.OfwDetails?.educationLevelId || null, //check if it is the value
                    ofwschool: data?.OfwDetails?.school || '',
                    ofwcourse: data?.OfwDetails?.course || '',
                    ofwgroupchat: data?.OfwDetails?.groupChat || '',
                    ofwrelationship: data?.OfwDetails?.relationshipID || '',

                    // OFW Addressesg
                    ofwresidences: data?.OfwPresAddress?.ownershipId || '',
                    ofwPresProv: data?.OfwPresAddress?.provinceId || '',
                    ofwPresProvname: data?.OfwPresAddress?.province || '',
                    ofwPresMunicipality: data?.OfwPresAddress?.municipalityId || '',
                    ofwPresMunicipalityname: data?.OfwPresAddress?.municipality || '',
                    ofwPresBarangay: data?.OfwPresAddress?.barangayId || '',
                    ofwPresBarangayname: data?.OfwPresAddress?.barangay || '',
                    ofwPresStreet: data?.OfwPresAddress?.address1 || '',
                    ofwrent: data?.OfwPresAddress?.rentAmount === null ? '' : data?.OfwPresAddress?.rentAmount,
                    ofwlosMonth: data?.OfwPresAddress?.stayMonths || '',
                    ofwlosYear: data?.OfwPresAddress?.stayYears || '',
                    collectionarea: data?.OfwPresAddress?.collectionAreaId || '',
                    collectionareaname: data?.OfwPresAddress?.collectionArea || '',

                    landmark: data?.OfwPresAddress?.landmark || '',
                    ofwSameAdd: data.OfwPresAddress.provinceId && (data?.OfwPermAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.OfwPermAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,
                    ofwProvSameAdd: data.OfwPermAddress.provinceId && (data?.OfwPermAddress?.address1 == data?.OfwProvAddress?.address1) && (data?.OfwPermAddress?.barangayId == data?.OfwProvAddress?.barangayId) ? 1 : 0,
                    bensameadd: data.OfwPresAddress.provinceId && (data?.BeneficiaryPresAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.BeneficiaryPresAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,
                    coborrowSameAdd: data.OfwPresAddress.provinceId && (data?.CoborrowPresAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.CoborrowPresAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,

                    ofwPermProv: data?.OfwPermAddress?.provinceId || '',
                    ofwPermProvname: data?.OfwPermAddress?.province || '',
                    ofwPermMunicipality: data?.OfwPermAddress?.municipalityId || '',
                    ofwPermMunicipalityname: data?.OfwPermAddress?.municipality || '',
                    ofwPermBarangay: data?.OfwPermAddress?.barangayId || '',
                    ofwPermBarangayname: data?.OfwPermAddress?.barangay || '',
                    ofwPermStreet: data?.OfwPermAddress?.address1 || '',

                    ofwprovProv: data?.OfwProvAddress?.provinceId || '',
                    ofwprovProvname: data?.OfwProvAddress?.province || '',
                    ofwprovMunicipality: data?.OfwProvAddress?.municipalityId || '',
                    ofwprovMunicipalityname: data?.OfwProvAddress?.municipality || '',
                    ofwprovBarangay: data?.OfwProvAddress?.barangayId || '',
                    ofwprovBarangayname: data?.OfwProvAddress?.barangay || '',
                    ofwprovStreet: data?.OfwProvAddress?.address1 || '',

                    // Beneficiary Details
                    benfname: data?.BeneficiaryDetails?.firstName || '',
                    benmname: data?.BeneficiaryDetails?.middleName || '',
                    benlname: data?.BeneficiaryDetails?.lastName || '',
                    bensuffix: data?.BeneficiaryDetails?.suffix || '',
                    benbdate: data?.BeneficiaryDetails?.birthdate ? mmddyy(data.BeneficiaryDetails?.birthdate) : '',
                    bengender: data?.BeneficiaryDetails?.genderId || '',
                    benmstatus: data?.BeneficiaryDetails?.civilStatusId || '',
                    benfblink: data?.BeneficiaryDetails?.fbProfile || '',
                    benemail: data?.BeneficiaryDetails?.email || '',
                    benmobile: data?.BeneficiaryDetails?.mobileNo || '',
                    benothermobile: data?.BeneficiaryDetails?.mobileNo2 || '',
                    benrelationship: data?.BeneficiaryDetails?.relationshipID || '',
                    bendependents: data?.BeneficiaryDetails?.withDependent || '',

                    benspouse: data?.BeneficiaryDetails?.spouseName || '',
                    benspousebdate: data?.BeneficiaryDetails?.spouseBirthday ? mmddyy(data?.BeneficiaryDetails?.spouseBirthday) : '',

                    // Beneficiary Addresses
                    benresidences: data?.BeneficiaryPresAddress?.ownershipId || '',
                    benpresprov: data?.BeneficiaryPresAddress?.provinceId || '',
                    benpresprovname: data?.BeneficiaryPresAddress?.province || '',
                    benpresmunicipality: data?.BeneficiaryPresAddress?.municipalityId || '',
                    benpresmunicipalityname: data?.BeneficiaryPresAddress?.municipality || '',
                    benpresbarangay: data?.BeneficiaryPresAddress?.barangayId || '',
                    benpresbarangayname: data?.BeneficiaryPresAddress?.barangay || '',
                    benpresstreet: data?.BeneficiaryPresAddress?.address1 || '',
                    benstaymonths: data?.BeneficiaryPresAddress?.stayMonths || '',
                    benstayyears: data?.BeneficiaryPresAddress?.stayYears || '',

                    // Co-Borrower Details
                    coborrowfname: data?.CoborrowDetails?.firstName || '',
                    coborrowmname: data?.CoborrowDetails?.middleName || '',
                    coborrowlname: data?.CoborrowDetails?.lastName || '',
                    coborrowsuffix: data?.CoborrowDetails?.suffix || '',
                    coborrowbdate: data?.CoborrowDetails?.birthdate ? mmddyy(data.CoborrowDetails?.birthdate) : '',
                    coborrowgender: data?.CoborrowDetails?.genderId || '',
                    coborrowmstatus: data?.CoborrowDetails?.civilStatusId || '',
                    coborrowemail: data?.CoborrowDetails?.email || '',
                    coborrowmobile: data?.CoborrowDetails?.mobileNo || '',
                    coborrowothermobile: data?.CoborrowDetails?.mobileNo2 || '',
                    coborrowdependents: data?.CoborrowDetails?.withDependent || '',
                    coborrowfblink: data?.CoborrowDetails?.fbProfile || '',
                    coborrowspousename: data?.CoborrowDetails?.spouseName || '',
                    coborrowerspousebdate: data?.CoborrowDetails?.spouseBirthday ? mmddyy(data?.CoborrowDetails?.spouseBirthday) : '',


                    // Co-Borrower Addresses
                    coborrowresidences: data?.CoborrowPresAddress?.ownershipId || '',
                    coborrowProv: data?.CoborrowPresAddress?.provinceId || '',
                    coborrowProvname: data?.CoborrowPresAddress?.province || '',
                    coborrowMunicipality: data?.CoborrowPresAddress?.municipalityId || '',
                    coborrowMunicipalityname: data?.CoborrowPresAddress?.municipality || '',
                    coborrowBarangay: data?.CoborrowPresAddress?.barangayId || '',
                    coborrowBarangayname: data?.CoborrowPresAddress?.barangay || '',
                    coborrowStreet: data?.CoborrowPresAddress?.address1 || '',
                    AcbStayMonths: data?.CoborrowPresAddress?.stayMonths || '',
                    AcbStayYears: data?.CoborrowPresAddress?.stayYears || '',

                    //CRAM Data
                    PrevAmount: data?.LoanDetails?.prevApprovedAmnt || '',
                    CRAApprvRec: data?.LoanDetails?.craApprovedRec || '',
                    CRARemarks: data?.LoanDetails?.craRemarks || '',
                    ApprvAmount: data?.LoanDetails?.approvedAmount || '',
                    ApprvTerms: data?.LoanDetails?.approvedTerms || '',
                    ApprvInterestRate: data?.LoanDetails?.apprvInterestRate || '',
                    MonthlyAmort: data?.LoanDetails?.monthlyAmort || '',
                    OtherExposure: data?.LoanDetails?.otherExposure || '',
                    TotalExposure: data?.LoanDetails?.totalExposure || '',
                    CRORemarks: data?.LoanDetails?.croRemarks || '',
                    // Present Address Tables
                    OfwPoBRemarks: data?.OfwPresAddress?.billingRemarks || '',
                    BenPoBRemarks: data?.BeneficiaryPresAddress?.billingRemarks || '',
                    AcbPoBRemarks: data?.CoborrowPresAddress?.billingRemarks || '',
                    BenRentAmount: data?.BeneficiaryPresAddress?.rentAmount || '',
                    AcbRentAmount: data?.CoborrowPresAddress?.rentAmount || '',
                    BenLandMark: data?.BeneficiaryPresAddress?.landMark || '',
                    AcbLandMark: data?.CoborrowPresAddress?.landMark || '',
                    // Ofw Details
                    SpSrcIncome: data?.OfwDetails?.spouseSourceIncome || '',
                    SpIncome: data?.OfwDetails?.spouseIncome || '',
                    SrcIncome: data?.OfwDetails?.cbAcbIncomeSource || '',
                    Religion: data?.OfwDetails?.religion || '',
                    PEP: data?.OfwDetails?.isPeP || '',
                    MarriedPBCB: data?.OfwDetails?.isPbCbMarried || '',
                    RelationshipBen: data?.OfwDetails?.relationshipToBen || '',
                    RelationshipAdd: data?.OfwDetails?.relationshipToAcb || '',
                    OfwRemrks: data?.OfwDetails?.remarks || '',
                    PEmployer: data?.OfwEmploymentDetails?.principalEmployer || '',
                    ContractDate: data?.OfwEmploymentDetails?.contractDate ? mmddyy(data.OfwEmploymentDetails.contractDate) : '',
                    ContractDuration: data?.OfwEmploymentDetails?.contractDuration || '',
                    UnliContract: data?.OfwEmploymentDetails?.contractUnli || '',
                    JobCategory: data?.OfwEmploymentDetails?.jobCategory || '',
                    EmpStatus: data?.OfwEmploymentDetails?.employmentStatus || '',
                    FCurrency: data?.OfwEmploymentDetails?.foreignCurrency || '',
                    FSalary: data?.OfwEmploymentDetails?.salaryInForeign || '',
                    PSalary: data?.OfwEmploymentDetails?.salaryInPeso || '',
                    YrsOfwSeafarer: data?.OfwEmploymentDetails?.yearOFW || '',
                    VesselName: data?.OfwEmploymentDetails?.vesselName || '',
                    VesselType: data?.OfwEmploymentDetails?.vesselType || '',
                    VesselIMO: data?.OfwEmploymentDetails?.vesselImo || '',
                    AllotName: data?.OfwEmploymentDetails?.remittanceRecipient || '',
                    AllotAmount: data?.OfwEmploymentDetails?.remittanceAmount || '',
                    AllotChannel: data?.OfwEmploymentDetails?.remittanceChannel || '',
                    ExactLocation: data?.OfwEmploymentDetails?.exactLocation || '',
                    PossVacation: data?.OfwEmploymentDetails?.possibleVacation || '',
                    // Co-Borrower/Beneficiary Table
                    BenMarriedPBCB: data?.BeneficiaryDetails?.isPbCbMarried || '',
                    BenSpSrcIncome: data?.BeneficiaryDetails?.spouseSourceIncome || '',
                    BenSpIncome: data?.BeneficiaryDetails?.spouseIncome || '',
                    BenGrpChat: data?.BeneficiaryDetails?.groupChat || '',
                    BenSrcIncome: data?.BeneficiaryDetails?.cbAcbIncomeSource || '',
                    BenReligion: data?.BeneficiaryDetails?.religion || '',
                    BenPEP: data?.BeneficiaryDetails?.isPeP || '',
                    BenPlanAbroad: data?.BeneficiaryDetails?.plantoAbroad || '',
                    BenFormerOFW: data?.BeneficiaryDetails?.isFormerOfw || '',
                    BenLastReturn: data?.BeneficiaryDetails?.lastReturnHome || '',
                    BenRemarks: data?.BeneficiaryDetails?.remarks || '',
                    // Additional Co-Borrower Table
                    AcbSpSrcIncome: data?.CoborrowDetails?.spouseSourceIncome || '',
                    AcbSpIncome: data.CoborrowDetails?.spouseIncome || '',
                    AcbGrpChat: data?.CoborrowDetails?.groupchat || '',
                    AcbSrcIncome: data?.CoborrowDetails?.cbAcbIncomeSource || '',
                    AcbReligion: data?.CoborrowDetails?.religion || '',
                    AcbFormerOFW: data?.CoborrowDetails?.isFormerOfw || '',
                    AcbLastReturn: data?.CoborrowDetails?.lastReturnHome || '',
                    AcbPlanAbroad: data?.CoborrowDetails?.plantoAbroad || '',
                    AcbPEP: data?.CoborrowDetails?.isPeP || '',
                    AcbRemarks: data?.CoborrowDetails?.remarks || '',
                    AcbRelationship: data?.CoborrowDetails?.relationshipID || '',
                    AcbRelationshipName: data?.CoborrowDetails?.relationship || '',

                    //Kaiser checker
                    ofwfirstname: data?.OfwDetails?.firstName || '',
                    ofwlastname: data?.OfwDetails?.lastName || '',
                    benfirstname: data?.BeneficiaryDetails?.firstName || '',
                    benlastname: data?.BeneficiaryDetails?.lastName || '',
                    acbfirstname: data?.CoborrowDetails?.firstName || '',
                    acblastname: data?.CoborrowDetails?.lastName || '',
                    //Acb show Status
                    addCoborrower: data?.CoborrowDetails?.firstName || '',
                }));
                SET_LOADING_INTERNAL('ClientDataInfo', false);
                return data;
            } catch (error) {
                console.error('Error fetching data:', error);
                SET_LOADING_INTERNAL('ClientDataInfo', false);
                return null;
            }
        },
        enabled: true,
    });

    console.log("LOAN INFO API", ClientDataListQuery.data)
    console.log("LOAN INFO API PERO", getAppDetails)

    const [getCRDValue, setCRDValue] = React.useState({
        TotalSalary: 0,
        OtherIncome: 0,
        TotalNetIncome: 0,

        RemittanceToPH: 0,
        MonthlyFood: 0,
        MonthlyRent: 0,
        MiscExpense: 0,
        Others: 0,
        TotalExpense: 0,
        NetDisposable: 0
    })

    const token = localStorage.getItem('UTK');

    //Manipulate Fields on trigger
    TriggerFields({ getAppDetails, setAppDetails });

    const [getLoading, setLoading] = React.useState(false)
    React.useEffect(() => { setLoading(GET_LOADING_INTERNAL) }, [GET_LOADING_INTERNAL])

    return (
        <div className="px-7 mt-[2%] h-[500px] w-full">
            <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(7, 175, 4)' } } }}>
                <Spin spinning={ClientDataListQuery.isFetching} tip={<span style={{ color: 'rgb(59,7,100)' }}>Please wait...</span>} className="flex justify-center items-center mt-[8%]" size='large'>
                    {contextHolder}
                    <div className="h-[100%] mt-[1%]">
                        {
                            GetData('ROLE').toString() === '20'
                                ? (<LcTabs
                                    value={getAppDetails} receive={(e) => setAppDetails(prevDetails => ({ ...prevDetails, [e.name]: e.value }))}
                                    sepcoborrowfname={sepcoborrowfname}
                                    sepBenfname={sepBenfname}
                                    presaddress={(e) => {
                                        setAppDetails((prevDetails) => {
                                            let updatedFields = {};
                                            switch (e.name) {
                                                case 'ofwPresProv': updatedFields = { ofwPresMunicipality: '', ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                case 'ofwPresMunicipality': updatedFields = { ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                case 'ofwPresBarangay': updatedFields = { ofwPresStreet: '' }; break;
                                                case 'ofwPermProv': updatedFields = { ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                case 'ofwPermMunicipality': updatedFields = { ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                case 'ofwPermBarangay': updatedFields = { ofwPermStreet: '' }; break;
                                                case 'ofwPerm': updatedFields = {
                                                    ofwPermProv: getAppDetails.ofwPresProv, ofwPermMunicipality: getAppDetails.ofwPresMunicipality,
                                                    ofwPermBarangay: getAppDetails.ofwPresBarangay, ofwPermStreet: getAppDetails.ofwPresStreet,
                                                }; break;
                                                case 'ofwSameAdd': updatedFields = { ofwPermProv: '', ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                case 'ofwprovProv': updatedFields = { ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                case 'ofwprovMunicipality': updatedFields = { ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                case 'ofwprovBarangay': updatedFields = { ofwprovStreet: '' }; break;
                                                case 'provpres': updatedFields = {
                                                    ofwprovProv: getAppDetails.ofwPermProv, ofwprovMunicipality: getAppDetails.ofwPermMunicipality,
                                                    ofwprovBarangay: getAppDetails.ofwPermBarangay, ofwprovStreet: getAppDetails.ofwPermStreet
                                                }; break;
                                                case 'ofwProvSameAdd': updatedFields = { ofwprovProv: '', ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                case 'resetMiddleName': updatedFields = { ofwmname: '', }; break;
                                                case 'benpres':
                                                    updatedFields = {
                                                        benpresprov: getAppDetails.ofwPresProv,
                                                        benpresmunicipality: getAppDetails.ofwPresMunicipality,
                                                        benpresbarangay: getAppDetails.ofwPresBarangay,
                                                        benpresstreet: getAppDetails.ofwPresStreet,
                                                    };
                                                    break;
                                                case 'bensameadd':
                                                    updatedFields = {
                                                        benpresprov: '',
                                                        benpresmunicipality: '',
                                                        benpresbarangay: '',
                                                        benpresstreet: ''
                                                    };
                                                    break;
                                                case 'benpresprov':
                                                    updatedFields = {
                                                        benpresmunicipality: '',
                                                        benpresbarangay: '',
                                                        benpresstreet: ''
                                                    };
                                                    break;
                                                case 'benpresmunicipality':
                                                    updatedFields = {
                                                        benpresbarangay: '',
                                                        benpresstreet: ''
                                                    };
                                                    break;
                                                case 'benpresbarangay':
                                                    updatedFields = {
                                                        benpresstreet: ''
                                                    };
                                                    break;
                                                case 'resetBenMiddleName':
                                                    updatedFields = {
                                                        benmname: ''
                                                    };
                                                    break;
                                                case 'coborrowProv':
                                                    updatedFields = {
                                                        coborrowBarangay: '',
                                                        coborrowMunicipality: '',
                                                        coborrowStreet: '',
                                                    }
                                                    break;
                                                case 'coborrowMunicipality':
                                                    updatedFields = {
                                                        coborrowBarangay: '',
                                                        coborrowStreet: '',
                                                    }
                                                    break;
                                                case 'coborrowBarangay':
                                                    updatedFields = {
                                                        coborrowStreet: ''
                                                    }
                                                    break;
                                                case 'coborrowSameAdd':
                                                    updatedFields = {
                                                        coborrowProv: '', coborrowMunicipality: '',
                                                        coborrowBarangay: '', coborrowStreet: '',
                                                    }
                                                    break;
                                                case 'coborrowpres':
                                                    updatedFields = {
                                                        coborrowProv: getAppDetails.ofwPresProv, coborrowMunicipality: getAppDetails.ofwPresMunicipality,
                                                        coborrowBarangay: getAppDetails.ofwPresBarangay, coborrowStreet: getAppDetails.ofwPresStreet,
                                                    }
                                                    break;
                                                default: break;
                                            }
                                            return { ...prevDetails, [e.name]: e.value, ...updatedFields, };
                                        });
                                    }}
                                    ClientId={getDetails.ClientId} FileType={getDetails.FileType} Uploader={jwtDecode(token).USRID} BorrowerId={getDetails.BorrowerId} LoanStatus={getAppDetails?.loanAppStat} />)
                                : GetData('ROLE').toString() === '30' || GetData('ROLE').toString() === '40'
                                    ? (<MarketingTabs
                                        value={getAppDetails} receive={(e) => setAppDetails(prevDetails => ({ ...prevDetails, [e.name]: e.value }))}
                                        valueAmount={getCRDValue} event={(e) => { setCRDValue({ ...getCRDValue, [e.name]: e.value }) }}
                                        sepcoborrowfname={sepcoborrowfname}
                                        sepBenfname={sepBenfname}
                                        presaddress={(e) => {
                                            setAppDetails((prevDetails) => {
                                                let updatedFields = {};
                                                switch (e.name) {
                                                    case 'ofwPresProv': updatedFields = { ofwPresMunicipality: '', ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                    case 'ofwPresMunicipality': updatedFields = { ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                    case 'ofwPresBarangay': updatedFields = { ofwPresStreet: '' }; break;
                                                    case 'ofwPermProv': updatedFields = { ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                    case 'ofwPermMunicipality': updatedFields = { ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                    case 'ofwPermBarangay': updatedFields = { ofwPermStreet: '' }; break;
                                                    case 'ofwPerm': updatedFields = {
                                                        ofwPermProv: getAppDetails.ofwPresProv, ofwPermMunicipality: getAppDetails.ofwPresMunicipality,
                                                        ofwPermBarangay: getAppDetails.ofwPresBarangay, ofwPermStreet: getAppDetails.ofwPresStreet,
                                                    }; break;
                                                    case 'ofwSameAdd': updatedFields = { ofwPermProv: '', ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                    case 'ofwprovProv': updatedFields = { ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                    case 'ofwprovMunicipality': updatedFields = { ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                    case 'ofwprovBarangay': updatedFields = { ofwprovStreet: '' }; break;
                                                    case 'provpres': updatedFields = {
                                                        ofwprovProv: getAppDetails.ofwPermProv, ofwprovMunicipality: getAppDetails.ofwPermMunicipality,
                                                        ofwprovBarangay: getAppDetails.ofwPermBarangay, ofwprovStreet: getAppDetails.ofwPermStreet
                                                    }; break;
                                                    case 'ofwProvSameAdd': updatedFields = { ofwprovProv: '', ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                    case 'resetMiddleName': updatedFields = { ofwmname: '', }; break;
                                                    case 'benpres':
                                                        updatedFields = {
                                                            benpresprov: getAppDetails.ofwPresProv,
                                                            benpresmunicipality: getAppDetails.ofwPresMunicipality,
                                                            benpresbarangay: getAppDetails.ofwPresBarangay,
                                                            benpresstreet: getAppDetails.ofwPresStreet,
                                                        };
                                                        break;
                                                    case 'bensameadd':
                                                        updatedFields = {
                                                            benpresprov: '',
                                                            benpresmunicipality: '',
                                                            benpresbarangay: '',
                                                            benpresstreet: ''
                                                        };
                                                        break;
                                                    case 'benpresprov':
                                                        updatedFields = {
                                                            benpresmunicipality: '',
                                                            benpresbarangay: '',
                                                            benpresstreet: ''
                                                        };
                                                        break;
                                                    case 'benpresmunicipality':
                                                        updatedFields = {
                                                            benpresbarangay: '',
                                                            benpresstreet: ''
                                                        };
                                                        break;
                                                    case 'benpresbarangay':
                                                        updatedFields = {
                                                            benpresstreet: ''
                                                        };
                                                        break;
                                                    case 'resetBenMiddleName':
                                                        updatedFields = {
                                                            benmname: ''
                                                        };
                                                        break;
                                                    case 'coborrowProv':
                                                        updatedFields = {
                                                            coborrowBarangay: '',
                                                            coborrowMunicipality: '',
                                                            coborrowStreet: '',
                                                        }
                                                        break;
                                                    case 'coborrowMunicipality':
                                                        updatedFields = {
                                                            coborrowBarangay: '',
                                                            coborrowStreet: '',
                                                        }
                                                        break;
                                                    case 'coborrowBarangay':
                                                        updatedFields = {
                                                            coborrowStreet: ''
                                                        }
                                                        break;
                                                    case 'coborrowSameAdd':
                                                        updatedFields = {
                                                            coborrowProv: '', coborrowMunicipality: '',
                                                            coborrowBarangay: '', coborrowStreet: '',
                                                        }
                                                        break;
                                                    case 'coborrowpres':
                                                        updatedFields = {
                                                            coborrowProv: getAppDetails.ofwPresProv, coborrowMunicipality: getAppDetails.ofwPresMunicipality,
                                                            coborrowBarangay: getAppDetails.ofwPresBarangay, coborrowStreet: getAppDetails.ofwPresStreet,
                                                        }
                                                        break;
                                                    default: break;
                                                }
                                                return { ...prevDetails, [e.name]: e.value, ...updatedFields, };
                                            });
                                        }}
                                        ClientId={getDetails.ClientId} FileType={getDetails.FileType} Uploader={jwtDecode(token).USRID} BorrowerId={getDetails.BorrowerId} LoanStatus={getAppDetails?.loanAppStat} />)
                                    : GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '60'
                                        ? (<CreditTabs
                                            value={getAppDetails} receive={(e) => setAppDetails(prevDetails => ({ ...prevDetails, [e.name]: e.value }))}
                                            valueAmount={getCRDValue} event={(e) => { setCRDValue({ ...getCRDValue, [e.name]: e.value }) }}
                                            sepcoborrowfname={sepcoborrowfname}
                                            sepBenfname={sepBenfname}
                                            presaddress={(e) => {
                                                setAppDetails((prevDetails) => {
                                                    let updatedFields = {};
                                                    switch (e.name) {
                                                        case 'ofwPresProv': updatedFields = { ofwPresMunicipality: '', ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                        case 'ofwPresMunicipality': updatedFields = { ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                        case 'ofwPresBarangay': updatedFields = { ofwPresStreet: '' }; break;
                                                        case 'ofwPermProv': updatedFields = { ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                        case 'ofwPermMunicipality': updatedFields = { ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                        case 'ofwPermBarangay': updatedFields = { ofwPermStreet: '' }; break;
                                                        case 'ofwPerm': updatedFields = {
                                                            ofwPermProv: getAppDetails.ofwPresProv, ofwPermMunicipality: getAppDetails.ofwPresMunicipality,
                                                            ofwPermBarangay: getAppDetails.ofwPresBarangay, ofwPermStreet: getAppDetails.ofwPresStreet,
                                                        }; break;
                                                        case 'ofwSameAdd': updatedFields = { ofwPermProv: '', ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                        case 'ofwprovProv': updatedFields = { ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                        case 'ofwprovMunicipality': updatedFields = { ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                        case 'ofwprovBarangay': updatedFields = { ofwprovStreet: '' }; break;
                                                        case 'provpres': updatedFields = {
                                                            ofwprovProv: getAppDetails.ofwPermProv, ofwprovMunicipality: getAppDetails.ofwPermMunicipality,
                                                            ofwprovBarangay: getAppDetails.ofwPermBarangay, ofwprovStreet: getAppDetails.ofwPermStreet
                                                        }; break;
                                                        case 'ofwProvSameAdd': updatedFields = { ofwprovProv: '', ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                        case 'resetMiddleName': updatedFields = { ofwmname: '', }; break;
                                                        case 'benpres':
                                                            updatedFields = {
                                                                benpresprov: getAppDetails.ofwPresProv,
                                                                benpresmunicipality: getAppDetails.ofwPresMunicipality,
                                                                benpresbarangay: getAppDetails.ofwPresBarangay,
                                                                benpresstreet: getAppDetails.ofwPresStreet,
                                                            };
                                                            break;
                                                        case 'bensameadd':
                                                            updatedFields = {
                                                                benpresprov: '',
                                                                benpresmunicipality: '',
                                                                benpresbarangay: '',
                                                                benpresstreet: ''
                                                            };
                                                            break;
                                                        case 'benpresprov':
                                                            updatedFields = {
                                                                benpresmunicipality: '',
                                                                benpresbarangay: '',
                                                                benpresstreet: ''
                                                            };
                                                            break;
                                                        case 'benpresmunicipality':
                                                            updatedFields = {
                                                                benpresbarangay: '',
                                                                benpresstreet: ''
                                                            };
                                                            break;
                                                        case 'benpresbarangay':
                                                            updatedFields = {
                                                                benpresstreet: ''
                                                            };
                                                            break;
                                                        case 'resetBenMiddleName':
                                                            updatedFields = {
                                                                benmname: ''
                                                            };
                                                            break;
                                                        case 'coborrowProv':
                                                            updatedFields = {
                                                                coborrowBarangay: '',
                                                                coborrowMunicipality: '',
                                                                coborrowStreet: '',
                                                            }
                                                            break;
                                                        case 'coborrowMunicipality':
                                                            updatedFields = {
                                                                coborrowBarangay: '',
                                                                coborrowStreet: '',
                                                            }
                                                            break;
                                                        case 'coborrowBarangay':
                                                            updatedFields = {
                                                                coborrowStreet: ''
                                                            }
                                                            break;
                                                        case 'coborrowSameAdd':
                                                            updatedFields = {
                                                                coborrowProv: '', coborrowMunicipality: '',
                                                                coborrowBarangay: '', coborrowStreet: '',
                                                            }
                                                            break;
                                                        case 'coborrowpres':
                                                            updatedFields = {
                                                                coborrowProv: getAppDetails.ofwPresProv, coborrowMunicipality: getAppDetails.ofwPresMunicipality,
                                                                coborrowBarangay: getAppDetails.ofwPresBarangay, coborrowStreet: getAppDetails.ofwPresStreet,
                                                            }
                                                            break;
                                                        default: break;
                                                    }
                                                    return { ...prevDetails, [e.name]: e.value, ...updatedFields, };
                                                });
                                            }}
                                            ClientId={getDetails.ClientId} FileType={getDetails.FileType} Uploader={jwtDecode(token).USRID} BorrowerId={getDetails.BorrowerId} LoanStatus={getAppDetails?.loanAppStat} />)
                                        : GetData('ROLE').toString() === '90'
                                            ? (<AccountingTabs
                                                value={getAppDetails} receive={(e) => setAppDetails(prevDetails => ({ ...prevDetails, [e.name]: e.value }))}
                                                valueAmount={getCRDValue} event={(e) => { setCRDValue({ ...getCRDValue, [e.name]: e.value }) }}
                                                sepcoborrowfname={sepcoborrowfname}
                                                sepBenfname={sepBenfname}
                                                presaddress={(e) => {
                                                    setAppDetails((prevDetails) => {
                                                        let updatedFields = {};
                                                        switch (e.name) {
                                                            case 'ofwPresProv': updatedFields = { ofwPresMunicipality: '', ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                            case 'ofwPresMunicipality': updatedFields = { ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                            case 'ofwPresBarangay': updatedFields = { ofwPresStreet: '' }; break;
                                                            case 'ofwPermProv': updatedFields = { ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                            case 'ofwPermMunicipality': updatedFields = { ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                            case 'ofwPermBarangay': updatedFields = { ofwPermStreet: '' }; break;
                                                            case 'ofwPerm': updatedFields = {
                                                                ofwPermProv: getAppDetails.ofwPresProv, ofwPermMunicipality: getAppDetails.ofwPresMunicipality,
                                                                ofwPermBarangay: getAppDetails.ofwPresBarangay, ofwPermStreet: getAppDetails.ofwPresStreet,
                                                            }; break;
                                                            case 'ofwSameAdd': updatedFields = { ofwPermProv: '', ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                            case 'ofwprovProv': updatedFields = { ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                            case 'ofwprovMunicipality': updatedFields = { ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                            case 'ofwprovBarangay': updatedFields = { ofwprovStreet: '' }; break;
                                                            case 'provpres': updatedFields = {
                                                                ofwprovProv: getAppDetails.ofwPermProv, ofwprovMunicipality: getAppDetails.ofwPermMunicipality,
                                                                ofwprovBarangay: getAppDetails.ofwPermBarangay, ofwprovStreet: getAppDetails.ofwPermStreet
                                                            }; break;
                                                            case 'ofwProvSameAdd': updatedFields = { ofwprovProv: '', ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                            case 'resetMiddleName': updatedFields = { ofwmname: '', }; break;
                                                            case 'benpres':
                                                                updatedFields = {
                                                                    benpresprov: getAppDetails.ofwPresProv,
                                                                    benpresmunicipality: getAppDetails.ofwPresMunicipality,
                                                                    benpresbarangay: getAppDetails.ofwPresBarangay,
                                                                    benpresstreet: getAppDetails.ofwPresStreet,
                                                                };
                                                                break;
                                                            case 'bensameadd':
                                                                updatedFields = {
                                                                    benpresprov: '',
                                                                    benpresmunicipality: '',
                                                                    benpresbarangay: '',
                                                                    benpresstreet: ''
                                                                };
                                                                break;
                                                            case 'benpresprov':
                                                                updatedFields = {
                                                                    benpresmunicipality: '',
                                                                    benpresbarangay: '',
                                                                    benpresstreet: ''
                                                                };
                                                                break;
                                                            case 'benpresmunicipality':
                                                                updatedFields = {
                                                                    benpresbarangay: '',
                                                                    benpresstreet: ''
                                                                };
                                                                break;
                                                            case 'benpresbarangay':
                                                                updatedFields = {
                                                                    benpresstreet: ''
                                                                };
                                                                break;
                                                            case 'resetBenMiddleName':
                                                                updatedFields = {
                                                                    benmname: ''
                                                                };
                                                                break;
                                                            case 'coborrowProv':
                                                                updatedFields = {
                                                                    coborrowBarangay: '',
                                                                    coborrowMunicipality: '',
                                                                    coborrowStreet: '',
                                                                }
                                                                break;
                                                            case 'coborrowMunicipality':
                                                                updatedFields = {
                                                                    coborrowBarangay: '',
                                                                    coborrowStreet: '',
                                                                }
                                                                break;
                                                            case 'coborrowBarangay':
                                                                updatedFields = {
                                                                    coborrowStreet: ''
                                                                }
                                                                break;
                                                            case 'coborrowSameAdd':
                                                                updatedFields = {
                                                                    coborrowProv: '', coborrowMunicipality: '',
                                                                    coborrowBarangay: '', coborrowStreet: '',
                                                                }
                                                                break;
                                                            case 'coborrowpres':
                                                                updatedFields = {
                                                                    coborrowProv: getAppDetails.ofwPresProv, coborrowMunicipality: getAppDetails.ofwPresMunicipality,
                                                                    coborrowBarangay: getAppDetails.ofwPresBarangay, coborrowStreet: getAppDetails.ofwPresStreet,
                                                                }
                                                                break;
                                                            default: break;
                                                        }
                                                        return { ...prevDetails, [e.name]: e.value, ...updatedFields, };
                                                    });
                                                }}
                                                ClientId={getDetails.ClientId} FileType={getDetails.FileType} Uploader={jwtDecode(token).USRID} BorrowerId={getDetails.BorrowerId} LoanStatus={getAppDetails?.loanAppStat} />)
                                            : (<LoanTabs
                                                value={getAppDetails} receive={(e) => setAppDetails(prevDetails => ({ ...prevDetails, [e.name]: e.value }))}
                                                valueAmount={getCRDValue} event={(e) => { setCRDValue({ ...getCRDValue, [e.name]: e.value }) }}
                                                sepcoborrowfname={sepcoborrowfname}
                                                sepBenfname={sepBenfname}
                                                presaddress={(e) => {
                                                    setAppDetails((prevDetails) => {
                                                        let updatedFields = {};
                                                        switch (e.name) {
                                                            case 'ofwPresProv': updatedFields = { ofwPresMunicipality: '', ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                            case 'ofwPresMunicipality': updatedFields = { ofwPresBarangay: '', ofwPresStreet: '' }; break;
                                                            case 'ofwPresBarangay': updatedFields = { ofwPresStreet: '' }; break;
                                                            case 'ofwPermProv': updatedFields = { ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                            case 'ofwPermMunicipality': updatedFields = { ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                            case 'ofwPermBarangay': updatedFields = { ofwPermStreet: '' }; break;
                                                            case 'ofwPerm': updatedFields = {
                                                                ofwPermProv: getAppDetails.ofwPresProv, ofwPermMunicipality: getAppDetails.ofwPresMunicipality,
                                                                ofwPermBarangay: getAppDetails.ofwPresBarangay, ofwPermStreet: getAppDetails.ofwPresStreet,
                                                            }; break;
                                                            case 'ofwSameAdd': updatedFields = { ofwPermProv: '', ofwPermMunicipality: '', ofwPermBarangay: '', ofwPermStreet: '' }; break;
                                                            case 'ofwprovProv': updatedFields = { ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                            case 'ofwprovMunicipality': updatedFields = { ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                            case 'ofwprovBarangay': updatedFields = { ofwprovStreet: '' }; break;
                                                            case 'provpres': updatedFields = {
                                                                ofwprovProv: getAppDetails.ofwPermProv, ofwprovMunicipality: getAppDetails.ofwPermMunicipality,
                                                                ofwprovBarangay: getAppDetails.ofwPermBarangay, ofwprovStreet: getAppDetails.ofwPermStreet
                                                            }; break;
                                                            case 'ofwProvSameAdd': updatedFields = { ofwprovProv: '', ofwprovMunicipality: '', ofwprovBarangay: '', ofwprovStreet: '' }; break;
                                                            case 'resetMiddleName': updatedFields = { ofwmname: '', }; break;
                                                            case 'benpres':
                                                                updatedFields = {
                                                                    benpresprov: getAppDetails.ofwPresProv,
                                                                    benpresmunicipality: getAppDetails.ofwPresMunicipality,
                                                                    benpresbarangay: getAppDetails.ofwPresBarangay,
                                                                    benpresstreet: getAppDetails.ofwPresStreet,
                                                                };
                                                                break;
                                                            case 'bensameadd':
                                                                updatedFields = {
                                                                    benpresprov: '',
                                                                    benpresmunicipality: '',
                                                                    benpresbarangay: '',
                                                                    benpresstreet: ''
                                                                };
                                                                break;
                                                            case 'benpresprov':
                                                                updatedFields = {
                                                                    benpresmunicipality: '',
                                                                    benpresbarangay: '',
                                                                    benpresstreet: ''
                                                                };
                                                                break;
                                                            case 'benpresmunicipality':
                                                                updatedFields = {
                                                                    benpresbarangay: '',
                                                                    benpresstreet: ''
                                                                };
                                                                break;
                                                            case 'benpresbarangay':
                                                                updatedFields = {
                                                                    benpresstreet: ''
                                                                };
                                                                break;
                                                            case 'resetBenMiddleName':
                                                                updatedFields = {
                                                                    benmname: ''
                                                                };
                                                                break;
                                                            case 'coborrowProv':
                                                                updatedFields = {
                                                                    coborrowBarangay: '',
                                                                    coborrowMunicipality: '',
                                                                    coborrowStreet: '',
                                                                }
                                                                break;
                                                            case 'coborrowMunicipality':
                                                                updatedFields = {
                                                                    coborrowBarangay: '',
                                                                    coborrowStreet: '',
                                                                }
                                                                break;
                                                            case 'coborrowBarangay':
                                                                updatedFields = {
                                                                    coborrowStreet: ''
                                                                }
                                                                break;
                                                            case 'coborrowSameAdd':
                                                                updatedFields = {
                                                                    coborrowProv: '', coborrowMunicipality: '',
                                                                    coborrowBarangay: '', coborrowStreet: '',
                                                                }
                                                                break;
                                                            case 'coborrowpres':
                                                                updatedFields = {
                                                                    coborrowProv: getAppDetails.ofwPresProv, coborrowMunicipality: getAppDetails.ofwPresMunicipality,
                                                                    coborrowBarangay: getAppDetails.ofwPresBarangay, coborrowStreet: getAppDetails.ofwPresStreet,
                                                                }
                                                                break;
                                                            default: break;
                                                        }
                                                        return { ...prevDetails, [e.name]: e.value, ...updatedFields, };
                                                    });
                                                }}
                                                ClientId={getDetails.ClientId} FileType={getDetails.FileType} Uploader={jwtDecode(token).USRID} BorrowerId={getDetails.BorrowerId} LoanStatus={getAppDetails?.loanAppStat} />)
                        }
                    </div>
                </Spin>
            </ConfigProvider>
        </div>
    );
}

export default LoanApplicationInfo;