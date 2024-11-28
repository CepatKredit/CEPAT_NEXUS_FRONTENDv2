import createInitialAppDetails from "@utils/IntialValues";
import { getBeneficiaryAddressUpdatedFields, getLoanDetailUpdatedFields, getOfwAddressUpdatedFields } from "@utils/Validations";
import React from "react";
import { notification } from 'antd'
import { FocusHook } from "@hooks/ComponentHooks";
import { debouncef } from "@utils/Debounce";

export const LoanApplicationContext = React.createContext();

export const LoanApplicationProvider = ({ children, direct }) => {
  const [api, contextHolder] = notification.useNotification();
  const [getAppDetails, setAppDetails] = React.useState(
    createInitialAppDetails(direct)
  );
  const [getOldData, setOldData] = React.useState({
    FirstName: "",
    LastName: "",
    Suffix: "",
    Birthday: "",
  });
  /*
    // Ref to store the previous value of getAppDetails
    const prevAppDetailsRef = React.useRef(getAppDetails);
  
    React.useEffect(() => {
      const prevAppDetails = prevAppDetailsRef.current;
  
      // Find the updated keys and log the changes
      const updatedData = Object.keys(getAppDetails).reduce((acc, key) => {
        if (getAppDetails[key] !== prevAppDetails[key]) {
          acc[key] = { oldValue: prevAppDetails[key], newValue: getAppDetails[key] };
        }
        return acc;
      }, {});
  
      if (Object.keys(updatedData).length > 0) {
        console.log("Updated data:", updatedData);
      }
  
      // Update the ref to the current state
      prevAppDetailsRef.current = getAppDetails;
    }, [getAppDetails]);
  */
  const setOldClientNameAndBDay = (result) => {
    const ofwDetails = result?.data?.list?.OfwDetails || {};

    setOldData((prevOldData) => ({
      ...prevOldData,
      FirstName: ofwDetails.firstName || "",
      LastName: ofwDetails.lastName || "",
      Suffix: parseInt(ofwDetails.suffix) || "",
      Birthday: ofwDetails.birthdate || "",
    }));
  };

  const updateAppDetails = React.useCallback((e) => {
    if (!e || !e.name) return;
    setAppDetails((prevDetails) => {
      const newValue = e.value;
      if (prevDetails[e.name] === newValue) {
        return prevDetails;
      }
      const updatedDetails = {
        ...prevDetails,
        [e.name]: newValue,
      };
      return updatedDetails;
    });
  }, []);

  const queryDetails = React.useCallback((updates) => {
    if (!updates) return;

    // Normalize single update vs batch updates
    const updatesArray = Array.isArray(updates) ? updates : [updates];

    setAppDetails((prevDetails) => {
      // Filter out updates that don't actually change the state
      const filteredUpdates = updatesArray.filter(
        ({ name, value }) => name && prevDetails[name] !== value
      );

      if (filteredUpdates.length === 0) {
        // No changes detected, return previous state
        return prevDetails;
      }

      // Apply changes to the new state
      const newDetails = filteredUpdates.reduce((details, { name, value }) => {
        details[name] = value;
        return details;
      }, { ...prevDetails });

      return newDetails;
    });
  }, []);

  const handleLoanDetailCases = (e) => {
    setAppDetails((prevDetails) => ({
      ...prevDetails,
      ...getLoanDetailUpdatedFields(e),
      [e.name]: e.value,
    }));
  };

  const handleAddressCases = (e, type) => {
    if (type === "beneficiary") {
      // Call the beneficiary address handler
      setAppDetails((prevDetails) => ({
        ...prevDetails,
        ...getBeneficiaryAddressUpdatedFields(e, getAppDetails),
        [e.name]: e.value,
      }));
    } else {
      // Call the OFW/present/permanent address handler
      setAppDetails((prevDetails) => ({
        ...prevDetails,
        ...getOfwAddressUpdatedFields(e, getAppDetails),
        [e.name]: e.value,
      }));
    }
  };

  const populateClientDetails = (result) => {
    const loanDetails = result?.data?.list?.LoanDetails || {};
    const ofwDetails = result?.data?.list?.OfwDetails || {};
    const ofwPresAddress = result?.data?.list?.OfwPresAddress || {};
    const ofwPermAddress = result?.data?.list?.OfwPermAddress || {};
    const beneficiaryDetails = result?.data?.list?.BeneficiaryDetails || {};
    const beneficiaryPresAddress = result?.data?.list?.BeneficiaryPresAddress || {};

    setAppDetails((prevDetails) => ({
      ...prevDetails,
      // Loan Details
      loanAppCode: loanDetails.loanAppCode,
      loanIdCode: loanDetails.loanAppId,
      loanProd: loanDetails.productId,
      loanDateDep: loanDetails.departureDate,
      loanPurpose: loanDetails.purposeId,
      loanAmount: loanDetails.amount?.toString(),
      ApprvAmount: loanDetails.approvedAmount,
      loanTerms: loanDetails.terms,
      ApprvTerms: loanDetails.approvedTerms,
      loanBranchId: loanDetails.branchId,
      loanBranch: loanDetails.branch,
      loanStatus: loanDetails.status,
      hckfi: loanDetails.channelId,
      consultant: loanDetails.consultant,
      consultNumber: loanDetails.consultantNo,
      consultProfile: loanDetails.consultantProfile,
      referredby: loanDetails.ReferredBy || "",

      // OFW Details
      borrowersCode: ofwDetails.borrowersCode,
      ofwfname: ofwDetails.firstName,
      ofwmname: ofwDetails.middleName,
      ofwlname: ofwDetails.lastName,
      ofwsuffix: ofwDetails.suffix,
      ofwbdate: ofwDetails.birthdate,
      ofwgender: ofwDetails.genderId,
      ofwmstatus: ofwDetails.civilStatusId,
      ofwdependents: ofwDetails.withDependent,
      ofwemail: ofwDetails.email,
      ofwmobile: ofwDetails.mobileNo,
      ofwfblink: ofwDetails.fbProfile,
      ofwvalidid: ofwDetails.validId,
      ofwidnumber: ofwDetails.validIdNo,
      ofwcountry: ofwDetails.country,
      ofwjobtitle: ofwDetails.jobTitle,
      ofwcompany: ofwDetails.employer,
      ofwsalary: ofwDetails.salary?.toString(),

      // OFW Present Address
      ofwresidences: ofwPresAddress.ownershipId || "",
      ofwPresProv: ofwPresAddress.provinceId || "",
      ofwPresProvname: ofwPresAddress.province || "",
      ofwPresMunicipality: ofwPresAddress.municipalityId || "",
      ofwPresMunicipalityname: ofwPresAddress.municipality || "",
      ofwPresBarangay: ofwPresAddress.barangayId || "",
      ofwPresBarangayname: ofwPresAddress.barangay || "",
      ofwPresStreet: ofwPresAddress.address1 || "",
      ofwrent: ofwPresAddress.rentAmount?.toString() || 0,

      ofwSameAdd:
        !ofwPresAddress.ofwPresProv &&
          ofwPermAddress.address1 === ofwPresAddress.address1 &&
          ofwPermAddress.barangayId === ofwPresAddress.barangayId
          ? 1
          : 0,

      // OFW Permanent Address
      ofwPermProv: ofwPermAddress.provinceId || "",
      ofwPermProvname: ofwPermAddress.province || "",
      ofwPermMunicipality: ofwPermAddress.municipalityId || "",
      ofwPermMunicipalityname: ofwPermAddress.municipality || "",
      ofwPermBarangay: ofwPermAddress.barangayId || "",
      ofwPermBarangayname: ofwPermAddress.barangay || "",
      ofwPermStreet: ofwPermAddress.address1 || "",

      // Beneficiary Details
      benfname: beneficiaryDetails.firstName || "",
      benmname: beneficiaryDetails.middleName || "",
      benlname: beneficiaryDetails.lastName || "",
      bensuffix: beneficiaryDetails.suffix || "",
      benbdate: beneficiaryDetails.birthdate || "",
      bengender: beneficiaryDetails.genderId || 0,
      benmstatus: beneficiaryDetails.civilStatusId || 0,
      benemail: beneficiaryDetails.email || "",
      benmobile: beneficiaryDetails.mobileNo || "",
      benFb: beneficiaryDetails.fbProfile || "",
      benrelationship: beneficiaryDetails.relationshipID || 0,

      // Beneficiary Present Address
      benpresprov: beneficiaryPresAddress.provinceId || "",
      benpresprovname: beneficiaryPresAddress.province || "",
      benpresmunicipality: beneficiaryPresAddress.municipalityId || "",
      benpresmunicipalityname: beneficiaryPresAddress.municipality || "",
      benpresbarangay: beneficiaryPresAddress.barangayId || "",
      benpresbarangayname: beneficiaryPresAddress.barangay || "",
      benpresstreet: beneficiaryPresAddress.address1 || "",

      // Beneficiary Same Address Flag
      bensameadd:
        !ofwPresAddress.ofwPresProv &&
          beneficiaryPresAddress.address1 === ofwPresAddress.address1 &&
          beneficiaryPresAddress.barangayId === ofwPresAddress.barangayId
          ? 1
          : 0,
    }));
  };

  const resetAppDetails = () => {

    setAppDetails(createInitialAppDetails(direct));
    localStorage.removeItem('CLID');
  };

  const [getLoading, setLoading] = React.useState({
    Deduplication: false,
    EmploymentHistoryTABLE: false,
    LoanInfo: false,
    NDIOFW: false,
    KaiserOFW: false,
    FinancialChecker: false,
    UploadDocs: false,
    BorrowerNDI: false,
    ACBNDI: false,
    StatusRemarks: false,
    ReleaseFile: false,
    CharRefTABLE: false,
    CreditHistoryTABLE: false,
    AssetTABLE: false,
    PropertiesTABLE: false,
    DependentsTABLE: false,

  })

  const SET_LOADING_INTERNAL = (POINTER, STATUS) => { setLoading({ ...getLoading, [POINTER]: STATUS }) }
  const GET_LOADING_INTERNAL = () => {
    if (getLoading.Deduplication === true || getLoading.EmploymentHistoryTABLE === true || getLoading.LoanInfo === true ||
      getLoading.NDIOFW === true || getLoading.KaiserOFW === true || getLoading.FinancialChecker === true || getLoading.UploadDocs === true ||
      getLoading.BorrowerNDI === true || getLoading.ACBNDI === true || getLoading.StatusRemarks === true || getLoading.ReleaseFile === true ||
      getLoading.CharRefTABLE === true || getLoading.CreditHistoryTABLE === true || getLoading.AssetTABLE === true || getLoading.PropertiesTABLE === true ||
      getLoading.DependentsTABLE === true) { return true }
    else { return false }
    /* const LOAD_DATA = Object.values(getLoading).some(value => value === true)
     return LOAD_DATA*/
  }

  const { focus, setfocus } = FocusHook();

  // const {refetch} = useQuery({
  //   queryKey: ['ClientDataListQuery', toDecrypt(localStorage.getItem('SIDC'))],
  //   queryFn: async () => {
  //     try {
  //       const result = await GET_LIST(`/getClientDataList/${toDecrypt(localStorage.getItem('SIDC'))}`);
  //       const data = result.list;

  //       // Populate app details and old client data when data is fetched
  //       setAppDetails(prevDetails => ({
  //         ...prevDetails,
  //         loanAppCode: data?.LoanDetails?.loanAppCode || '',
  //         loanIdCode: data?.LoanDetails?.loanAppId || '',
  //         loanDateDep: data?.LoanDetails?.departureDate ? mmddyy(data.LoanDetails.departureDate) : '',
  //         loanCreated: data?.LoanDetails?.recDate ? mmddyy(data.LoanDetails.recDate) : 'No Date Created!',
  //         loanAppStat: data?.LoanDetails?.status || '',
  //         loanAppStatId: data?.LoanDetails?.statusId || '',
  //         loanProd: data?.LoanDetails?.productId || '',
  //         ofwDeptDate: data?.LoanDetails?.departureDate || '',
  //         loanPurpose: data?.LoanDetails?.purposeId || '',
  //         loanType: data?.LoanDetails?.loanTypeId || '',
  //         loanBranchId: data?.LoanDetails?.branchId || '',
  //         loanBranch: data?.LoanDetails?.branch || '',
  //         loanAmount: data?.LoanDetails?.amount || '',
  //         channel: data?.LoanDetails?.channel || '',
  //         channelId: data?.LoanDetails?.channelId || '',
  //         loanTerms: data?.LoanDetails?.terms || '',
  //         consultName: data?.LoanDetails?.consultant || '',
  //         consultNumber: data?.LoanDetails?.consultantNo || '',
  //         consultantfblink: data?.LoanDetails?.consultantProfile || '',

  //         statusCraf: data?.LoanDetails?.statusCraf || '',
  //         statusFfcc: data?.LoanDetails?.statusFfcc || '',
  //         statusAgencyVerification: data?.LoanDetails?.statusAgencyVerification || '',
  //         statusKaiser: data?.LoanDetails?.statusKaiser || '',
  //         statusMasterlist: data?.LoanDetails?.statusMasterlist || '',
  //         statusShareLocation: data?.LoanDetails?.statusShareLocation || '',
  //         statusVideoCall: data?.LoanDetails?.statusVideoCall || '',
  //         // OFW Details
  //         ofwBorrowersCode: data?.OfwDetails?.borrowersCode || '',
  //         ofwfname: data?.OfwDetails?.firstName || '',
  //         ofwmname: data?.OfwDetails?.middleName || '',
  //         ofwlname: data?.OfwDetails?.lastName || '',
  //         ofwsuffix: data?.OfwDetails?.suffix || '',
  //         ofwbdate: data?.OfwDetails?.birthdate ? mmddyy(data.OfwDetails.birthdate) : '',
  //         ofwgender: data?.OfwDetails?.genderId || '',
  //         ofwmstatus: data?.OfwDetails?.civilStatusId || '',
  //         ofwspouse: data?.OfwDetails?.spouseName || '',
  //         ofwspousebdate: data?.OfwDetails?.spouseBirthday ? mmddyy(data?.OfwDetails?.spouseBirthday) : '',
  //         ofwemail: data?.OfwDetails?.email || '',
  //         ofwmobile: data?.OfwDetails?.mobileNo || '',
  //         ofwothermobile: data?.OfwDetails?.mobileNo2 || '',
  //         ofwfblink: data?.OfwDetails?.fbProfile || '',
  //         ofwdependents: data?.OfwDetails?.withDependent || '',
  //         ofwvalidid: data?.OfwDetails?.validId || '',
  //         ofwidnumber: data?.OfwDetails?.validIdNo || '',
  //         ofwcountry: data?.OfwDetails?.country || '',
  //         ofwjobtitle: data?.OfwDetails?.jobTitle || '',
  //         ofwcompany: data?.OfwDetails?.employer || '',
  //         ofwsalary: data?.OfwDetails?.salary || '',
  //         ofwHighestEdu: data?.OfwDetails?.educationLevelId || null, //check if it is the value
  //         ofwschool: data?.OfwDetails?.school || '',
  //         ofwcourse: data?.OfwDetails?.course || '',
  //         ofwgroupchat: data?.OfwDetails?.groupChat || '',
  //         ofwrelationship: data?.OfwDetails?.relationshipID || '',

  //         // OFW Addressesg
  //         ofwresidences: data?.OfwPresAddress?.ownershipId || '',
  //         ofwPresProv: data?.OfwPresAddress?.provinceId || '',
  //         ofwPresProvname: data?.OfwPresAddress?.province || '',
  //         ofwPresMunicipality: data?.OfwPresAddress?.municipalityId || '',
  //         ofwPresMunicipalityname: data?.OfwPresAddress?.municipality || '',
  //         ofwPresBarangay: data?.OfwPresAddress?.barangayId || '',
  //         ofwPresBarangayname: data?.OfwPresAddress?.barangay || '',
  //         ofwPresStreet: data?.OfwPresAddress?.address1 || '',
  //         ofwrent: data?.OfwPresAddress?.rentAmount === null ? '' : data?.OfwPresAddress?.rentAmount,
  //         ofwlosMonth: data?.OfwPresAddress?.stayMonths || '',
  //         ofwlosYear: data?.OfwPresAddress?.stayYears || '',
  //         collectionarea: data?.OfwPresAddress?.collectionAreaId || '',
  //         collectionareaname: data?.OfwPresAddress?.collectionArea || '',

  //         landmark: data?.OfwPresAddress?.landmark || '',
  //         ofwSameAdd: data.OfwPresAddress.provinceId && (data?.OfwPermAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.OfwPermAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,
  //         ofwProvSameAdd: data.OfwPermAddress.provinceId && (data?.OfwPermAddress?.address1 == data?.OfwProvAddress?.address1) && (data?.OfwPermAddress?.barangayId == data?.OfwProvAddress?.barangayId) ? 1 : 0,
  //         bensameadd: data.OfwPresAddress.provinceId && (data?.BeneficiaryPresAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.BeneficiaryPresAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,
  //         coborrowSameAdd: data.OfwPresAddress.provinceId && (data?.CoborrowPresAddress?.address1 == data?.OfwPresAddress?.address1) && (data?.CoborrowPresAddress?.barangayId == data?.OfwPresAddress?.barangayId) ? 1 : 0,

  //         ofwPermProv: data?.OfwPermAddress?.provinceId || '',
  //         ofwPermProvname: data?.OfwPermAddress?.province || '',
  //         ofwPermMunicipality: data?.OfwPermAddress?.municipalityId || '',
  //         ofwPermMunicipalityname: data?.OfwPermAddress?.municipality || '',
  //         ofwPermBarangay: data?.OfwPermAddress?.barangayId || '',
  //         ofwPermBarangayname: data?.OfwPermAddress?.barangay || '',
  //         ofwPermStreet: data?.OfwPermAddress?.address1 || '',

  //         ofwprovProv: data?.OfwProvAddress?.provinceId || '',
  //         ofwprovProvname: data?.OfwProvAddress?.province || '',
  //         ofwprovMunicipality: data?.OfwProvAddress?.municipalityId || '',
  //         ofwprovMunicipalityname: data?.OfwProvAddress?.municipality || '',
  //         ofwprovBarangay: data?.OfwProvAddress?.barangayId || '',
  //         ofwprovBarangayname: data?.OfwProvAddress?.barangay || '',
  //         ofwprovStreet: data?.OfwProvAddress?.address1 || '',

  //         // Beneficiary Details
  //         benfname: data?.BeneficiaryDetails?.firstName || '',
  //         benmname: data?.BeneficiaryDetails?.middleName || '',
  //         benlname: data?.BeneficiaryDetails?.lastName || '',
  //         bensuffix: data?.BeneficiaryDetails?.suffix || '',
  //         benbdate: data?.BeneficiaryDetails?.birthdate ? mmddyy(data.BeneficiaryDetails?.birthdate) : '',
  //         bengender: data?.BeneficiaryDetails?.genderId || '',
  //         benmstatus: data?.BeneficiaryDetails?.civilStatusId || '',
  //         benfblink: data?.BeneficiaryDetails?.fbProfile || '',
  //         benemail: data?.BeneficiaryDetails?.email || '',
  //         benmobile: data?.BeneficiaryDetails?.mobileNo || '',
  //         benothermobile: data?.BeneficiaryDetails?.mobileNo2 || '',
  //         benrelationship: data?.BeneficiaryDetails?.relationshipID || '',
  //         bendependents: data?.BeneficiaryDetails?.withDependent || '',

  //         benspouse: data?.BeneficiaryDetails?.spouseName || '',
  //         benspousebdate: data?.BeneficiaryDetails?.spouseBirthday ? mmddyy(data?.BeneficiaryDetails?.spouseBirthday) : '',

  //         // Beneficiary Addresses
  //         benresidences: data?.BeneficiaryPresAddress?.ownershipId || '',
  //         benpresprov: data?.BeneficiaryPresAddress?.provinceId || '',
  //         benpresprovname: data?.BeneficiaryPresAddress?.province || '',
  //         benpresmunicipality: data?.BeneficiaryPresAddress?.municipalityId || '',
  //         benpresmunicipalityname: data?.BeneficiaryPresAddress?.municipality || '',
  //         benpresbarangay: data?.BeneficiaryPresAddress?.barangayId || '',
  //         benpresbarangayname: data?.BeneficiaryPresAddress?.barangay || '',
  //         benpresstreet: data?.BeneficiaryPresAddress?.address1 || '',
  //         benstaymonths: data?.BeneficiaryPresAddress?.stayMonths || '',
  //         benstayyears: data?.BeneficiaryPresAddress?.stayYears || '',

  //         // Co-Borrower Details
  //         coborrowfname: data?.CoborrowDetails?.firstName || '',
  //         coborrowmname: data?.CoborrowDetails?.middleName || '',
  //         coborrowlname: data?.CoborrowDetails?.lastName || '',
  //         coborrowsuffix: data?.CoborrowDetails?.suffix || '',
  //         coborrowbdate: data?.CoborrowDetails?.birthdate ? mmddyy(data.CoborrowDetails?.birthdate) : '',
  //         coborrowgender: data?.CoborrowDetails?.genderId || '',
  //         coborrowmstatus: data?.CoborrowDetails?.civilStatusId || '',
  //         coborrowemail: data?.CoborrowDetails?.email || '',
  //         coborrowmobile: data?.CoborrowDetails?.mobileNo || '',
  //         coborrowothermobile: data?.CoborrowDetails?.mobileNo2 || '',
  //         coborrowdependents: data?.CoborrowDetails?.withDependent || '',
  //         coborrowfblink: data?.CoborrowDetails?.fbProfile || '',
  //         coborrowspousename: data?.CoborrowDetails?.spouseName || '',
  //         coborrowerspousebdate: data?.CoborrowDetails?.spouseBirthday ? mmddyy(data?.CoborrowDetails?.spouseBirthday) : '',


  //         // Co-Borrower Addresses
  //         coborrowresidences: data?.CoborrowPresAddress?.ownershipId || '',
  //         coborrowProv: data?.CoborrowPresAddress?.provinceId || '',
  //         coborrowProvname: data?.CoborrowPresAddress?.province || '',
  //         coborrowMunicipality: data?.CoborrowPresAddress?.municipalityId || '',
  //         coborrowMunicipalityname: data?.CoborrowPresAddress?.municipality || '',
  //         coborrowBarangay: data?.CoborrowPresAddress?.barangayId || '',
  //         coborrowBarangayname: data?.CoborrowPresAddress?.barangay || '',
  //         coborrowStreet: data?.CoborrowPresAddress?.address1 || '',
  //         AcbStayMonths: data?.CoborrowPresAddress?.stayMonths || '',
  //         AcbStayYears: data?.CoborrowPresAddress?.stayYears || '',

  //         //CRAM Data
  //         PrevAmount: data?.LoanDetails?.prevApprovedAmnt || '',
  //         CRAApprvRec: data?.LoanDetails?.craApprovedRec || '',
  //         CRARemarks: data?.LoanDetails?.craRemarks || '',
  //         ApprvAmount: data?.LoanDetails?.approvedAmount || '',
  //         ApprvTerms: data?.LoanDetails?.approvedTerms || '',
  //         ApprvInterestRate: data?.LoanDetails?.apprvInterestRate || '',
  //         MonthlyAmort: data?.LoanDetails?.monthlyAmort || '',
  //         OtherExposure: data?.LoanDetails?.otherExposure || '',
  //         TotalExposure: data?.LoanDetails?.totalExposure || '',
  //         CRORemarks: data?.LoanDetails?.croRemarks || '',
  //         // Present Address Tables
  //         OfwPoBRemarks: data?.OfwPresAddress?.billingRemarks || '',
  //         BenPoBRemarks: data?.BeneficiaryPresAddress?.billingRemarks || '',
  //         AcbPoBRemarks: data?.CoborrowPresAddress?.billingRemarks || '',
  //         BenRentAmount: data?.BeneficiaryPresAddress?.rentAmount || '',
  //         AcbRentAmount: data?.CoborrowPresAddress?.rentAmount || '',
  //         BenLandMark: data?.BeneficiaryPresAddress?.landMark || '',
  //         AcbLandMark: data?.CoborrowPresAddress?.landMark || '',
  //         // Ofw Details
  //         SpSrcIncome: data?.OfwDetails?.spouseSourceIncome || '',
  //         SpIncome: data?.OfwDetails?.spouseIncome || '',
  //         SrcIncome: data?.OfwDetails?.cbAcbIncomeSource || '',
  //         Religion: data?.OfwDetails?.religion || '',
  //         PEP: data?.OfwDetails?.isPeP || '',
  //         MarriedPBCB: data?.OfwDetails?.isPbCbMarried || '',
  //         RelationshipBen: data?.OfwDetails?.relationshipToBen || '',
  //         RelationshipAdd: data?.OfwDetails?.relationshipToAcb || '',
  //         OfwRemrks: data?.OfwDetails?.remarks || '',
  //         PEmployer: data?.OfwEmploymentDetails?.principalEmployer || '',
  //         ContractDate: data?.OfwEmploymentDetails?.contractDate ? mmddyy(data.OfwEmploymentDetails.contractDate) : '',
  //         ContractDuration: data?.OfwEmploymentDetails?.contractDuration || '',
  //         UnliContract: data?.OfwEmploymentDetails?.contractUnli || '',
  //         JobCategory: data?.OfwEmploymentDetails?.jobCategory || '',
  //         EmpStatus: data?.OfwEmploymentDetails?.employmentStatus || '',
  //         FCurrency: data?.OfwEmploymentDetails?.foreignCurrency || '',
  //         FSalary: data?.OfwEmploymentDetails?.salaryInForeign || '',
  //         PSalary: data?.OfwEmploymentDetails?.salaryInPeso || '',
  //         YrsOfwSeafarer: data?.OfwEmploymentDetails?.yearOFW || '',
  //         VesselName: data?.OfwEmploymentDetails?.vesselName || '',
  //         VesselType: data?.OfwEmploymentDetails?.vesselType || '',
  //         VesselIMO: data?.OfwEmploymentDetails?.vesselImo || '',
  //         AllotName: data?.OfwEmploymentDetails?.remittanceRecipient || '',
  //         AllotAmount: data?.OfwEmploymentDetails?.remittanceAmount || '',
  //         AllotChannel: data?.OfwEmploymentDetails?.remittanceChannel || '',
  //         ExactLocation: data?.OfwEmploymentDetails?.exactLocation || '',
  //         PossVacation: data?.OfwEmploymentDetails?.possibleVacation || '',
  //         // Co-Borrower/Beneficiary Table
  //         BenMarriedPBCB: data?.BeneficiaryDetails?.isPbCbMarried || '',//
  //         BenSpSrcIncome: data?.BeneficiaryDetails?.spouseSourceIncome || '',//
  //         BenSpIncome: data?.BeneficiaryDetails?.spouseIncome || '',//
  //         BenGrpChat: data?.BeneficiaryDetails?.groupChat || '',
  //         BenSrcIncome: data?.BeneficiaryDetails?.cbAcbIncomeSource || '',//
  //         BenReligion: data?.BeneficiaryDetails?.religion || '',
  //         BenPEP: data?.BeneficiaryDetails?.isPeP || '',
  //         BenPlanAbroad: data?.BeneficiaryDetails?.plantoAbroad || '',
  //         BenFormerOFW: data?.BeneficiaryDetails?.isFormerOfw || '',//
  //         BenLastReturn: data?.BeneficiaryDetails?.lastReturnHome || '',//
  //         BenRemarks: data?.BeneficiaryDetails?.remarks || '',//
  //         // Additional Co-Borrower Table
  //         AcbSpSrcIncome: data?.CoborrowDetails?.spouseSourceIncome || '',//
  //         AcbSpIncome: data.CoborrowDetails?.spouseIncome || '',//
  //         AcbGrpChat: data?.CoborrowDetails?.groupchat || '',
  //         AcbSrcIncome: data?.CoborrowDetails?.cbAcbIncomeSource || '',//
  //         AcbReligion: data?.CoborrowDetails?.religion || '',
  //         AcbFormerOFW: data?.CoborrowDetails?.isFormerOfw || '',
  //         AcbLastReturn: data?.CoborrowDetails?.lastReturnHome || '',//
  //         AcbPlanAbroad: data?.CoborrowDetails?.plantoAbroad || '',//
  //         AcbPEP: data?.CoborrowDetails?.isPeP || '',//
  //         AcbRemarks: data?.CoborrowDetails?.remarks || '',//
  //         AcbRelationship: data?.CoborrowDetails?.relationshipID || '',
  //         AcbRelationshipName: data?.CoborrowDetails?.relationship || '',

  //         //Kaiser checker
  //         ofwfirstname: data?.OfwDetails?.firstName || '',
  //         ofwlastname: data?.OfwDetails?.lastName || '',
  //         benfirstname: data?.BeneficiaryDetails?.firstName || '',
  //         benlastname: data?.BeneficiaryDetails?.lastName || '',
  //         acbfirstname: data?.CoborrowDetails?.firstName || '',
  //         acblastname: data?.CoborrowDetails?.lastName || '',
  //         //Acb show Status
  //         addCoborrower: data?.CoborrowDetails?.firstName || '',
  //     }));

  //       return data;
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   },
  //   enabled: true,
  // });

  return (
    <LoanApplicationContext.Provider
      value={{
        focus, setfocus,
        getAppDetails,
        setAppDetails,
        direct,
        updateAppDetails,
        handleLoanDetailCases,
        api,
        handleAddressCases,
        resetAppDetails,
        getOldData,
        setOldClientNameAndBDay,
        populateClientDetails,
        GET_LOADING_INTERNAL,
        SET_LOADING_INTERNAL,
        queryDetails,
      }}
    >
      {contextHolder}
      {children}
    </LoanApplicationContext.Provider>
  );
};
