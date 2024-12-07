import createInitialAppDetails from "@utils/IntialValues";
import { getBeneficiaryAddressUpdatedFields, getLoanDetailUpdatedFields, getOfwAddressUpdatedFields } from "@utils/Validations";
import React from "react";
import { notification } from 'antd'
import { FocusHook } from "@hooks/ComponentHooks";

export const LoanApplicationContext = React.createContext();

export const LoanApplicationProvider = ({ children, direct }) => {
  const [showSaveButtonContext, setShowSaveButtonContext] = React.useState(true);
  const [showBenDependents, setBenDependents] = React.useState(true);
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

//Updating and Monitoring of Client Details
  const proxiedAppDetails = React.useMemo(() => {
    return new Proxy(getAppDetails, {
      set(target, key, value) {
        if (target[key] === value) return true; // Skip if no change
        console.log(`Field changed: ${key}, New value: ${value}, Old value: ${target[key]}`);
        const updatedDetails = { ...target, [key]: value }; // Clone and update
        setAppDetails(updatedDetails); // Update React state
        return true;
      },
    });
  }, [getAppDetails]);

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

  const updateAppDetails = React.useCallback(
    (e) => {
      if (!e || !e.name) return;
      proxiedAppDetails[e.name] = e.value; // Directly update proxied object
    },
    [proxiedAppDetails]
  );

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
  }

  const { focus, setfocus } = FocusHook();

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
        showSaveButtonContext,
        setShowSaveButtonContext,
        setBenDependents,
        showBenDependents,
      }}
    >
      {contextHolder}
      {children}
    </LoanApplicationContext.Provider>
  );
};
