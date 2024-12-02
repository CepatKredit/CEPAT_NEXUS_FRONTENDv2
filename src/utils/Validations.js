import dayjs from "dayjs";

const isValidEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// Age validation function for date
const isValidAge = (dateStr) => {
  const birthDate = dayjs(dateStr, "MM-DD-YYYY");
  if (!birthDate.isValid()) return false;

  const age = dayjs().diff(birthDate, 'year');
  return age >= 20 && age <= 65;
};

const isPrefixMatch = (value, format) => {
  const data = value.replace(format, '');
  if (data.length === 9) return true;
  return false;
}

const isValidDeployDate = (dateStr) => {
  return !(!dayjs().isBefore(dateStr, 'day') && !dayjs().isSame(dayjs(dateStr), 'day'));
}

const isValidFbLink = (value) => {
  return value.startsWith('https://');
}

export const CheckAmountValid = (value) => {
  return parseFloat(value ? value.toString().replaceAll(',', '') : 0) >= 30000;
}

export const CheckIncomeValid = (value) => {
  return parseFloat(value ? value.toString().replaceAll(',', '') : 0) >= 25000;
}

export const CheckRentAmortValid = (value) => {
  return parseFloat(value ? value.toString().replaceAll(',', '') : 0) >= 0;
}

export const CheckContactNo = (value, format) => { // Format = Prefix
  return value ? isPrefixMatch(value, format) : false;
}

export const CheckEmailValid = (input) => {
  return isValidEmail(input);
}

export const CheckFBLinkValid = (input) => {
  return isValidFbLink(input);
}

export const CheckDateValid = (dateValue) => {
  const date = dayjs(dateValue, 'MM-DD-YYYY', true); // `true` ensures strict parsing
  return date.isValid();
};

export const checkAgeisValid = (dateValue) => {
  return isValidAge(dateValue);
}

export const checkDeployisValid = (dateValue) => {
  return isValidDeployDate(dateValue);
}


export const isValidLoanDetails = (getAppDetails) => {
  const {
    loanProd,
    loanPurpose,
    loanAmount,
    loanTerms,
    loanDateDep,
    hckfi,
    consultName,
    consultNumber,
    loanReferredBy,
    loanBranch,
  } = getAppDetails;

  return (
    loanProd &&
    loanPurpose &&
    loanAmount &&
    loanTerms &&
    hckfi &&
    (["0303-DHW", "0303-VL", "0303-WL"].includes(loanProd) ? !!loanDateDep : true) &&
    (hckfi !== 10 || (consultName && consultNumber && loanBranch)) &&
    (hckfi !== 14 || loanReferredBy)
  );
};

export const isValidLoanDetailsLc = (getAppDetails) => {
  const {
    loanProd,
    loanPurpose,
    loanAmount,
    loanTerms,
    loanDateDep,
    hckfi,
    consultName,
    consultNumber,
    loanReferredBy,
    loanBranch,
  } = getAppDetails;

  return (
    loanProd &&
    loanPurpose &&
    loanAmount &&
    loanTerms &&
    (["0303-DHW", "0303-VL", "0303-WL"].includes(loanProd) ? !!loanDateDep : true) &&
    (hckfi !== 10 || (consultName && consultNumber && loanBranch)) &&
    (hckfi !== 14 || loanReferredBy)
  );
};

export const isValidOFWDetailsLc = (getAppDetails) => {
  const {
    ofwfname,
    ofwlname,
    ofwsuffix,
    ofwbdate,
    ofwgender,
    ofwmstatus,
    ofwemail,
    ofwmobile,
    ofwresidences,
    ofwsalary,
    ofwPresProv,
    ofwPresMunicipality,
    ofwPresBarangay,
    ofwPresStreet
  } = getAppDetails;

  return (
    ofwfname &&
    ofwlname &&
    ofwsuffix &&
    isValidAge(ofwbdate) &&
    ofwgender &&
    ofwmstatus &&
    isValidEmail(ofwemail) &&
    ofwmobile &&
    ofwresidences &&
    ofwsalary &&
    ofwPresProv &&
    ofwPresMunicipality &&
    ofwPresBarangay &&
    ofwPresStreet
  );
};

export const isValidOFWDetails = (getAppDetails) => {
  const {
    ofwfname,
    ofwlname,
    ofwsuffix,
    ofwbdate,
    ofwgender,
    ofwmstatus,
    ofwemail,
    ofwmobile,
    ofwresidences,
    ofwsalary,
    ofwPresProv,
    ofwPresMunicipality,
    ofwPresBarangay,
    ofwPresStreet,
    ofwPermProv,
    ofwPermMunicipality,
    ofwPermBarangay,
    ofwPermStreet,
    ofwcountry,
    ofwjobtitle,
    ofwcompany,
    rentAmount,
  } = getAppDetails;

  return (
    ofwfname &&
    ofwlname &&
    ofwsuffix &&
    isValidAge(ofwbdate) &&
    ofwgender &&
    ofwmstatus &&
    isValidEmail(ofwemail) &&
    ofwmobile &&
    ofwresidences &&
    ofwsalary &&
    ofwPresProv &&
    ofwPresMunicipality &&
    ofwPresBarangay &&
    ofwPresStreet &&
    ofwPermProv &&
    ofwPermMunicipality &&
    ofwPermBarangay &&
    ofwPermStreet &&
    ofwcountry &&
    ofwjobtitle &&
    ofwcompany &&
    (ofwresidences !== 3 || rentAmount)
  );
};

export const isValidBeneficiaryDetails = (getAppDetails) => {
  const {
    benfname,
    benlname,
    bensuffix,
    benbdate,
    bengender,
    benmstatus,
    benemail,
    bennumber,
    benrelationship,
    benpresprov,
    benpresmunicipality,
    benpresbarangay,
    benpresstreet,
  } = getAppDetails;

  return (
    benfname &&
    benlname &&
    bensuffix &&
    isValidAge(benbdate) &&
    bengender &&
    benmstatus &&
    isValidEmail(benemail) &&
    bennumber &&
    benrelationship &&
    benpresprov &&
    benpresmunicipality &&
    benpresbarangay &&
    benpresstreet
  );
};

export const getLoanDetailUpdatedFields = (e) => {
  switch (e.name) {
    case "consultant":
      return {
        withConsultant: 1,
        consultName: "",
        consultNumber: "",
      };
    case "notconsultant":
      return { withConsultant: 0 };
    case "selectFb":
      return { loanBranch: 11 }; //Fb
    case "selectNone":
      return { loanBranch: "" };
    case "resetReferredby":
      return { loanReferredBy: "" };
    case "resetDepartureDate":
      return {};
    default:
      return {};
  }
};

export const getOfwAddressUpdatedFields = (e, getAppDetails) => {
  switch (e.name) {
    case "resetmname":
      return { ofwmname: "" };
    case "ofwPresProv":
      return {
        ofwPresMunicipality: "",
        ofwPresBarangay: "",
        ofwPresStreet: "",
      };
    case "ofwPresMunicipality":
      return {
        ofwPresBarangay: "",
        ofwPresStreet: "",
      };
    case "ofwPresBarangay":
      return { ofwPresStreet: "" };
    case "ofwPermProv":
      return {
        ofwPermMunicipality: "",
        ofwPermBarangay: "",
        ofwPermStreet: "",
      };
    case "ofwPermMunicipality":
      return {
        ofwPermBarangay: "",
        ofwPermStreet: "",
      };
    case "ofwPermBarangay":
      return { ofwPermStreet: "" };
    case "ofwPerm":
      return {
        ofwPermProv: getAppDetails.ofwPresProv,
        ofwPermMunicipality: getAppDetails.ofwPresMunicipality,
        ofwPermBarangay: getAppDetails.ofwPresBarangay,
        ofwPermStreet: getAppDetails.ofwPresStreet,
      };
    case "ofwSameAdd":
      return {
        ofwPermProv: "",
        ofwPermMunicipality: "",
        ofwPermBarangay: "",
        ofwPermStreet: "",
      };
    default:
      return {};
  }
};

export const getBeneficiaryAddressUpdatedFields = (e, getAppDetails) => {
  switch (e.name) {
    case "benpres":
      return {
        benpresprov: getAppDetails.ofwPresProv,
        benpresmunicipality: getAppDetails.ofwPresMunicipality,
        benpresbarangay: getAppDetails.ofwPresBarangay,
        benpresstreet: getAppDetails.ofwPresStreet,
      };
      break;
    case "bensameadd":
      return {
        benpresprov: "",
        benpresmunicipality: "",
        benpresbarangay: "",
        benpresstreet: "",
      };
      break;
    case "benpresprov":
      return {
        benpresmunicipality: "",
        benpresbarangay: "",
        benpresstreet: "",
      };
      break;
    case "benpresmunicipality":
      return {
        benpresbarangay: "",
        benpresstreet: "",
      };
      break;
    case "benpresbarangay":
      return {
        benpresstreet: "",
      };
      break;
    case "resetBenMiddleName":
      return {
        benmname: "",
      };
    default:
      return {};
  }
}

export const getHCKFILoanCases = (e, loanDatailCases) => {
  // Reset referred by
  loanDatailCases({ name: 'resetReferredby', value: null });

  // Check if e is 10 to set consultant or not consultant
  if (e === 10) {
    loanDatailCases({ name: 'consultant', value: null });
  } else {
    loanDatailCases({ name: 'notconsultant', value: null });
  }
  // Handle the selection for FB/Online
  if ([16, 1, 3, 2, 4, 11, 12, 13, 8, 5, 14].includes(e)) {
    loanDatailCases({ name: 'selectFb', value: null });
  } else {
    loanDatailCases({ name: 'selectNone', value: null });
  }

  return {
    name: 'hckfi',
    value: e,
  };
};
