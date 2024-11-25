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
    const { getAppDetails, setAppDetails, queryDetails } = React.useContext(LoanApplicationContext)


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
        queryKey: ['ClientDataListQuery', toDecrypt(localStorage.getItem('SIDC'))],
        queryFn: async () => {
            try {
                const result = await GET_LIST(`/GET/G3CD/${toDecrypt(localStorage.getItem('SIDC'))}`);
                const data = result.list;
                setDetails({
                    ClientId: data?.LoanDetails?.loanAppId,
                    FileType: data?.LoanDetails?.productId,
                    BorrowerId: data?.OfwDetails?.borrowersCode
                })
                setCoborrowfname(data?.CoborrowDetails?.firstName || '');
                setBenfname(data?.BeneficiaryDetails?.firstName || '');
                
                queryDetails([
                    { name: 'loanAppCode', value: data?.LoanDetails?.loanAppCode || '' },
                    { name: 'loanIdCode', value: data?.LoanDetails?.loanAppId || '' },
                    { name: 'loanDateDep', value: data?.LoanDetails?.departureDate ? mmddyy(data.LoanDetails.departureDate) : '' },
                    { name: 'loanCreated', value: data?.LoanDetails?.recDate ? mmddyy(data.LoanDetails.recDate) : 'No Date Created!' },
                    { name: 'loanAppStat', value: data?.LoanDetails?.status || '' },
                    { name: 'loanAppStatId', value: data?.LoanDetails?.statusId || '' },
                    { name: 'loanProd', value: data?.LoanDetails?.productId || '' },
                    { name: 'ofwDeptDate', value: data?.LoanDetails?.departureDate || '' },
                    { name: 'loanPurpose', value: data?.LoanDetails?.purposeId || '' },
                    { name: 'loanType', value: data?.LoanDetails?.loanTypeId || '' },
                    { name: 'loanBranchId', value: data?.LoanDetails?.branchId || '' },
                    { name: 'loanBranch', value: data?.LoanDetails?.branch || '' },
                    { name: 'loanAmount', value: data?.LoanDetails?.amount || '' },
                    { name: 'channel', value: data?.LoanDetails?.channel || '' },
                    { name: 'channelId', value: data?.LoanDetails?.channelId || '' },
                    { name: 'loanTerms', value: data?.LoanDetails?.terms || '' },
                    { name: 'consultName', value: data?.LoanDetails?.consultant || '' },
                    { name: 'consultNumber', value: data?.LoanDetails?.consultantNo || '' },
                    { name: 'consultantfblink', value: data?.LoanDetails?.consultantProfile || '' },

                    { name: 'statusCraf', value: data?.LoanDetails?.statusCraf || '' },
                    { name: 'statusFfcc', value: data?.LoanDetails?.statusFfcc || '' },
                    { name: 'statusAgencyVerification', value: data?.LoanDetails?.statusAgencyVerification || '' },
                    { name: 'statusKaiser', value: data?.LoanDetails?.statusKaiser || '' },
                    { name: 'statusMasterlist', value: data?.LoanDetails?.statusMasterlist || '' },
                    { name: 'statusShareLocation', value: data?.LoanDetails?.statusShareLocation || '' },
                    { name: 'statusVideoCall', value: data?.LoanDetails?.statusVideoCall || '' },

                    { name: 'ofwBorrowersCode', value: data?.OfwDetails?.borrowersCode || '' },
                    { name: 'ofwfname', value: data?.OfwDetails?.firstName || '' },
                    { name: 'ofwmname', value: data?.OfwDetails?.middleName || '' },
                    { name: 'ofwlname', value: data?.OfwDetails?.lastName || '' },
                    { name: 'ofwsuffix', value: data?.OfwDetails?.suffix || '' },
                    { name: 'ofwbdate', value: data?.OfwDetails?.birthdate ? mmddyy(data.OfwDetails.birthdate) : '' },
                    { name: 'ofwgender', value: data?.OfwDetails?.genderId || '' },
                    { name: 'ofwmstatus', value: data?.OfwDetails?.civilStatusId || '' },
                    { name: 'ofwspouse', value: data?.OfwDetails?.spouseName || '' },
                    { name: 'ofwspousebdate', value: data?.OfwDetails?.spouseBirthday ? mmddyy(data?.OfwDetails?.spouseBirthday) : '' },
                    { name: 'ofwemail', value: data?.OfwDetails?.email || '' },
                    { name: 'ofwmobile', value: data?.OfwDetails?.mobileNo || '' },
                    { name: 'ofwothermobile', value: data?.OfwDetails?.mobileNo2 || '' },
                    { name: 'ofwfblink', value: data?.OfwDetails?.fbProfile || '' },
                    { name: 'ofwdependents', value: data?.OfwDetails?.withDependent || '' },
                    { name: 'ofwvalidid', value: data?.OfwDetails?.validId || '' },
                    { name: 'ofwidnumber', value: data?.OfwDetails?.validIdNo || '' },
                    { name: 'ofwcountry', value: data?.OfwDetails?.country || '' },
                    { name: 'ofwjobtitle', value: data?.OfwDetails?.jobTitle || '' },
                    { name: 'ofwcompany', value: data?.OfwDetails?.employer || '' },
                    { name: 'ofwsalary', value: data?.OfwDetails?.salary || '' },
                    { name: 'ofwHighestEdu', value: data?.OfwDetails?.educationLevelId || null },
                    { name: 'ofwschool', value: data?.OfwDetails?.school || '' },
                    { name: 'ofwcourse', value: data?.OfwDetails?.course || '' },
                    { name: 'ofwgroupchat', value: data?.OfwDetails?.groupChat || '' },
                    { name: 'ofwrelationship', value: data?.OfwDetails?.relationshipID || '' },

                    { name: 'ofwresidences', value: data?.OfwPresAddress?.ownershipId || '' },
                    { name: 'ofwPresProv', value: data?.OfwPresAddress?.provinceId || '' },
                    { name: 'ofwPresProvname', value: data?.OfwPresAddress?.province || '' },
                    { name: 'ofwPresMunicipality', value: data?.OfwPresAddress?.municipalityId || '' },
                    { name: 'ofwPresMunicipalityname', value: data?.OfwPresAddress?.municipality || '' },
                    { name: 'ofwPresBarangay', value: data?.OfwPresAddress?.barangayId || '' },
                    { name: 'ofwPresBarangayname', value: data?.OfwPresAddress?.barangay || '' },
                    { name: 'ofwPresStreet', value: data?.OfwPresAddress?.address1 || '' },
                    { name: 'ofwrent', value: data?.OfwPresAddress?.rentAmount === null ? '' : data?.OfwPresAddress?.rentAmount },
                    { name: 'ofwlosMonth', value: data?.OfwPresAddress?.stayMonths || '' },
                    { name: 'ofwlosYear', value: data?.OfwPresAddress?.stayYears || '' },
                    { name: 'collectionarea', value: data?.OfwPresAddress?.collectionAreaId || '' },
                    { name: 'collectionareaname', value: data?.OfwPresAddress?.collectionArea || '' },

                    { name: 'landmark', value: data?.OfwPresAddress?.landmark || '' },
                    { name: 'ofwSameAdd', value: data?.OfwPresAddress?.provinceId && (data?.OfwPermAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.OfwPermAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0 },
                    { name: 'ofwProvSameAdd', value: data?.OfwPermAddress?.provinceId && (data?.OfwPermAddress?.address1 == data?.OfwProvAddress?.address1) && (data?.OfwPermAddress?.barangayId == data?.OfwProvAddress?.barangayId) ? 1 : 0 },
                    { name: 'bensameadd', value: data?.OfwPresAddress?.provinceId && (data?.BeneficiaryPresAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.BeneficiaryPresAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0 },
                    { name: 'coborrowSameAdd', value: data?.OfwPresAddress?.provinceId && (data?.CoborrowPresAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.CoborrowPresAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0 },

                    { name: 'ofwPermProv', value: data?.OfwPermAddress?.provinceId || '' },
                    { name: 'ofwPermProvname', value: data?.OfwPermAddress?.province || '' },
                    { name: 'ofwPermMunicipality', value: data?.OfwPermAddress?.municipalityId || '' },
                    { name: 'ofwPermMunicipalityname', value: data?.OfwPermAddress?.municipality || '' },
                    { name: 'ofwPermBarangay', value: data?.OfwPermAddress?.barangayId || '' },
                    { name: 'ofwPermBarangayname', value: data?.OfwPermAddress?.barangay || '' },
                    { name: 'ofwPermStreet', value: data?.OfwPermAddress?.address1 || '' },

                    { name: 'ofwprovProv', value: data?.OfwProvAddress?.provinceId || '' },
                    { name: 'ofwprovProvname', value: data?.OfwProvAddress?.province || '' },
                    { name: 'ofwprovMunicipality', value: data?.OfwProvAddress?.municipalityId || '' },
                    { name: 'ofwprovMunicipalityname', value: data?.OfwProvAddress?.municipality || '' },
                    { name: 'ofwprovBarangay', value: data?.OfwProvAddress?.barangayId || '' },
                    { name: 'ofwprovBarangayname', value: data?.OfwProvAddress?.barangay || '' },
                    { name: 'ofwprovStreet', value: data?.OfwProvAddress?.address1 || '' },

                    { name: 'benfname', value: data?.BeneficiaryDetails?.firstName || '' },
                    { name: 'benmname', value: data?.BeneficiaryDetails?.middleName || '' },
                    { name: 'benlname', value: data?.BeneficiaryDetails?.lastName || '' },
                    { name: 'bensuffix', value: data?.BeneficiaryDetails?.suffix || '' },
                    { name: 'benbdate', value: data?.BeneficiaryDetails?.birthdate ? mmddyy(data.BeneficiaryDetails?.birthdate) : '' },
                    { name: 'bengender', value: data?.BeneficiaryDetails?.genderId || '' },
                    { name: 'benmstatus', value: data?.BeneficiaryDetails?.civilStatusId || '' },
                    { name: 'benfblink', value: data?.BeneficiaryDetails?.fbProfile || '' },
                    { name: 'benemail', value: data?.BeneficiaryDetails?.email || '' },
                    { name: 'benmobile', value: data?.BeneficiaryDetails?.mobileNo || '' },
                    { name: 'benothermobile', value: data?.BeneficiaryDetails?.mobileNo2 || '' },
                    { name: 'benrelationship', value: data?.BeneficiaryDetails?.relationshipID || '' },
                    { name: 'bendependents', value: data?.BeneficiaryDetails?.withDependent || '' },
                    { name: 'benspouse', value: data?.BeneficiaryDetails?.spouseName || '' },
                    { name: 'benspousebdate', value: data?.BeneficiaryDetails?.spouseBirthday ? mmddyy(data?.BeneficiaryDetails?.spouseBirthday) : '' },

                    { name: 'benresidences', value: data?.BeneficiaryPresAddress?.ownershipId || '' },
                    { name: 'benpresprov', value: data?.BeneficiaryPresAddress?.provinceId || '' },
                    { name: 'benpresprovname', value: data?.BeneficiaryPresAddress?.province || '' },
                    { name: 'benpresmunicipality', value: data?.BeneficiaryPresAddress?.municipalityId || '' },
                    { name: 'benpresmunicipalityname', value: data?.BeneficiaryPresAddress?.municipality || '' },
                    { name: 'benpresbarangay', value: data?.BeneficiaryPresAddress?.barangayId || '' },
                    { name: 'benpresbarangayname', value: data?.BeneficiaryPresAddress?.barangay || '' },
                    { name: 'benpresstreet', value: data?.BeneficiaryPresAddress?.address1 || '' },
                    { name: 'benstaymonths', value: data?.BeneficiaryPresAddress?.stayMonths || '' },
                    { name: 'benstayyears', value: data?.BeneficiaryPresAddress?.stayYears || '' },

                    { name: 'coborrowfname', value: data?.CoborrowDetails?.firstName || '' },
                    { name: 'coborrowmname', value: data?.CoborrowDetails?.middleName || '' },
                    { name: 'coborrowlname', value: data?.CoborrowDetails?.lastName || '' },
                    { name: 'coborrowsuffix', value: data?.CoborrowDetails?.suffix || '' },
                    { name: 'coborrowbdate', value: data?.CoborrowDetails?.birthdate ? mmddyy(data.CoborrowDetails?.birthdate) : '' },
                    { name: 'coborrowgender', value: data?.CoborrowDetails?.genderId || '' },
                    { name: 'coborrowmstatus', value: data?.CoborrowDetails?.civilStatusId || '' },
                    { name: 'coborrowemail', value: data?.CoborrowDetails?.email || '' },
                    { name: 'coborrowmobile', value: data?.CoborrowDetails?.mobileNo || '' },
                    { name: 'coborrowothermobile', value: data?.CoborrowDetails?.mobileNo2 || '' },
                    { name: 'coborrowdependents', value: data?.CoborrowDetails?.withDependent || '' },
                    { name: 'coborrowfblink', value: data?.CoborrowDetails?.fbProfile || '' },
                    { name: 'coborrowspousename', value: data?.CoborrowDetails?.spouseName || '' },
                    { name: 'coborrowerspousebdate', value: data?.CoborrowDetails?.spouseBirthday ? mmddyy(data?.CoborrowDetails?.spouseBirthday) : '' },

                    { name: 'PrevAmount', value: data?.LoanDetails?.prevApprovedAmnt || '' },
                    { name: 'CRAApprvRec', value: data?.LoanDetails?.craApprovedRec || '' },
                    { name: 'CRARemarks', value: data?.LoanDetails?.craRemarks || '' },
                    { name: 'ApprvAmount', value: data?.LoanDetails?.approvedAmount || '' },
                    { name: 'ApprvTerms', value: data?.LoanDetails?.approvedTerms || '' },
                    { name: 'ApprvInterestRate', value: data?.LoanDetails?.apprvInterestRate || '' },
                    { name: 'MonthlyAmort', value: data?.LoanDetails?.monthlyAmort || '' },
                    { name: 'OtherExposure', value: data?.LoanDetails?.otherExposure || '' },
                    { name: 'TotalExposure', value: data?.LoanDetails?.totalExposure || '' },
                    { name: 'CRORemarks', value: data?.LoanDetails?.croRemarks || '' },
                    { name: 'ForApprovalBy', value: data?.LoanDetails?.forApprovalBy || '' },
                    { name: 'ForApprovalDate', value: data?.LoanDetails?.forApprovalDate ? mmddyy(data.LoanDetails.forApprovalDate) : '' },
                    { name: 'CremanBy', value: data?.LoanDetails?.cremanBy || '' },
                    { name: 'CremanDate', value: data?.LoanDetails?.cremanDate ? mmddyy(data.LoanDetails.cremanDate) : '' },

                    { name: 'OfwPoBRemarks', value: data?.OfwPresAddress?.billingRemarks || '' },
                    { name: 'BenPoBRemarks', value: data?.BeneficiaryPresAddress?.billingRemarks || '' },
                    { name: 'AcbPoBRemarks', value: data?.CoborrowPresAddress?.billingRemarks || '' },
                    { name: 'BenRentAmount', value: data?.BeneficiaryPresAddress?.rentAmount || '' },
                    { name: 'AcbRentAmount', value: data?.CoborrowPresAddress?.rentAmount || '' },
                    { name: 'BenLandMark', value: data?.BeneficiaryPresAddress?.landMark || '' },
                    { name: 'AcbLandMark', value: data?.CoborrowPresAddress?.landMark || '' },
                    { name: 'SpSrcIncome', value: data?.OfwDetails?.spouseSourceIncome || '' },
                    { name: 'SpIncome', value: data?.OfwDetails?.spouseIncome || '' },
                    { name: 'SrcIncome', value: data?.OfwDetails?.cbAcbIncomeSource || '' },
                    { name: 'Religion', value: data?.OfwDetails?.religion || '' },
                    { name: 'PEP', value: data?.OfwDetails?.isPeP || '' },
                    { name: 'MarriedPBCB', value: data?.OfwDetails?.isPbCbMarried || '' },
                    { name: 'RelationshipBen', value: data?.OfwDetails?.relationshipToBen || '' },
                    { name: 'RelationshipAdd', value: data?.OfwDetails?.relationshipToAcb || '' },
                    { name: 'OfwRemrks', value: data?.OfwDetails?.remarks || '' },
                    { name: 'PEmployer', value: data?.OfwEmploymentDetails?.principalEmployer || '' },
                    { name: 'ContractDate', value: data?.OfwEmploymentDetails?.contractDate ? mmddyy(data.OfwEmploymentDetails.contractDate) : '' },
                    { name: 'ContractDuration', value: data?.OfwEmploymentDetails?.contractDuration || '' },
                    { name: 'UnliContract', value: data?.OfwEmploymentDetails?.contractUnli || '' },
                    { name: 'JobCategory', value: data?.OfwEmploymentDetails?.jobCategory || '' },
                    { name: 'EmpStatus', value: data?.OfwEmploymentDetails?.employmentStatus || '' },
                    { name: 'FCurrency', value: data?.OfwEmploymentDetails?.foreignCurrency || '' },
                    { name: 'FSalary', value: data?.OfwEmploymentDetails?.salaryInForeign || '' },
                    { name: 'PSalary', value: data?.OfwEmploymentDetails?.salaryInPeso || '' },
                    { name: 'YrsOfwSeafarer', value: data?.OfwEmploymentDetails?.yearOFW || '' },
                    { name: 'VesselName', value: data?.OfwEmploymentDetails?.vesselName || '' },
                    { name: 'VesselType', value: data?.OfwEmploymentDetails?.vesselType || '' },
                    { name: 'VesselIMO', value: data?.OfwEmploymentDetails?.vesselImo || '' },
                    { name: 'AllotName', value: data?.OfwEmploymentDetails?.remittanceRecipient || '' },
                    { name: 'AllotAmount', value: data?.OfwEmploymentDetails?.remittanceAmount || '' },
                    { name: 'AllotChannel', value: data?.OfwEmploymentDetails?.remittanceChannel || '' },
                    { name: 'ExactLocation', value: data?.OfwEmploymentDetails?.exactLocation || '' },
                    { name: 'PossVacation', value: data?.OfwEmploymentDetails?.possibleVacation || '' },

                    { name: 'BenMarriedPBCB', value: data?.BeneficiaryDetails?.isPbCbMarried || '' },
                    { name: 'BenSpSrcIncome', value: data?.BeneficiaryDetails?.spouseSourceIncome || '' },
                    { name: 'BenSpIncome', value: data?.BeneficiaryDetails?.spouseIncome || '' },
                    { name: 'BenGrpChat', value: data?.BeneficiaryDetails?.groupChat || '' },
                    { name: 'BenSrcIncome', value: data?.BeneficiaryDetails?.cbAcbIncomeSource || '' },
                    { name: 'BenReligion', value: data?.BeneficiaryDetails?.religion || '' },
                    { name: 'BenPEP', value: data?.BeneficiaryDetails?.isPeP || '' },
                    { name: 'BenPlanAbroad', value: data?.BeneficiaryDetails?.plantoAbroad || '' },
                    { name: 'BenFormerOFW', value: data?.BeneficiaryDetails?.isFormerOfw || '' },
                    { name: 'BenLastReturn', value: data?.BeneficiaryDetails?.lastReturnHome || '' },
                    { name: 'BenRemarks', value: data?.BeneficiaryDetails?.remarks || '' },
                    { name: 'AcbSpSrcIncome', value: data?.CoborrowDetails?.spouseSourceIncome || '' },
                    { name: 'AcbSpIncome', value: data?.CoborrowDetails?.spouseIncome || '' },
                    { name: 'AcbGrpChat', value: data?.CoborrowDetails?.groupchat || '' },
                    { name: 'AcbSrcIncome', value: data?.CoborrowDetails?.cbAcbIncomeSource || '' },
                    { name: 'AcbReligion', value: data?.CoborrowDetails?.religion || '' },
                    { name: 'AcbFormerOFW', value: data?.CoborrowDetails?.isFormerOfw || '' },
                    { name: 'AcbLastReturn', value: data?.CoborrowDetails?.lastReturnHome || '' },
                    { name: 'AcbPlanAbroad', value: data?.CoborrowDetails?.plantoAbroad || '' },
                    { name: 'AcbPEP', value: data?.CoborrowDetails?.isPeP || '' },
                    { name: 'AcbRemarks', value: data?.CoborrowDetails?.remarks || '' },
                    { name: 'AcbRelationship', value: data?.CoborrowDetails?.relationshipID || '' },
                    { name: 'AcbRelationshipName', value: data?.CoborrowDetails?.relationship || '' },
                    { name: 'ofwfirstname', value: data?.OfwDetails?.firstName || '' },
                    { name: 'ofwlastname', value: data?.OfwDetails?.lastName || '' },
                    { name: 'benfirstname', value: data?.BeneficiaryDetails?.firstName || '' },
                    { name: 'benlastname', value: data?.BeneficiaryDetails?.lastName || '' },
                    { name: 'acbfirstname', value: data?.CoborrowDetails?.firstName || '' },
                    { name: 'acblastname', value: data?.CoborrowDetails?.lastName || '' },
                    { name: 'addCoborrower', value: data?.CoborrowDetails?.firstName || '' },
                    
                ]);/*
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
                    ofwSameAdd: data?.OfwPresAddress?.provinceId && (data?.OfwPermAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.OfwPermAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,
                    ofwProvSameAdd: data?.OfwPermAddress?.provinceId && (data?.OfwPermAddress?.address1 == data?.OfwProvAddress?.address1) && (data?.OfwPermAddress?.barangayId == data?.OfwProvAddress?.barangayId) ? 1 : 0,
                    bensameadd: data?.OfwPresAddress?.provinceId && (data?.BeneficiaryPresAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.BeneficiaryPresAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,
                    coborrowSameAdd: data?.OfwPresAddress?.provinceId && (data?.CoborrowPresAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.CoborrowPresAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,

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
                    ForApprovalBy: data?.LoanDetails?.forApprovalBy || '',
                    ForApprovalDate: data?.LoanDetails?.forApprovalDate ? mmddyy(data.LoanDetails.forApprovalDate) : '',
                    CremanBy: data?.LoanDetails?.cremanBy || '',
                    CremanDate: data?.LoanDetails?.cremanDate ? mmddyy(data.LoanDetails.cremanDate) : '',

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
                    AcbSpIncome: data?.CoborrowDetails?.spouseIncome || '',
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
                }));*/
                //console.log('RE-FETCH DONE')
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

    React.useEffect(() => {
        console.log('CLientdatalist', ClientDataListQuery.data)
    }, [])

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
    // TriggerFields({ getAppDetails, setAppDetails });

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
                                    : GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '55' || GetData('ROLE').toString() === '60'
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