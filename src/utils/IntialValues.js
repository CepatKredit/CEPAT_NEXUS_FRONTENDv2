import { toDecrypt } from "./Converter";
import { GetData } from "./UserData";

const createInitialAppDetails = (direct) => {
  const USRNAME = toDecrypt(localStorage.getItem("USRFN"));
  const ROLE = GetData('ROLE');
  const BRANCH = GetData("BRANCH");
  console.log("ROLE from localStorage:", ROLE);

  return {
    // Initial data setup
    ofwcontactNo: "",
    ls_year: "",
    ls_month: "",
    dataPrivacy: 0,
    loanProd: "",
    loanRenewal: 0,
    loanDateDep: "",
    loanBranch: ROLE && ROLE.toString() === "20" ? parseInt(BRANCH) : 0,
    loanPurpose: "",
    loanAmount: "",
    loanTerms: "",
    hckfi: "",
    withConsultant: direct ? 0 : 1,
    consultName: direct ? "" : ROLE && ROLE.toString() === "20" ? USRNAME : "",
    consultNumber: "",
    consultProfile: "",
    loanReferredBy: "",
    rentAmount: 0,

    // OFW Details
    ofwfname: "",
    ofwmname: "",
    withOfwMName: 0,
    ofwlname: "",
    ofwsuffix: "",
    ofwbdate: "",
    ofwgender: "",
    ofwmstatus: "",
    ofwemail: "",
    ofwmobile: "",
    ofwfblink: "",
    ofwresidences: "",
    ofwPresProv: "",
    ofwPresMunicipality: "",
    ofwPresBarangay: "",
    ofwPresStreet: "",
    ofwSameAdd: 0,
    ofwPermProv: "",
    ofwPermMunicipality: "",
    ofwPermBarangay: "",
    ofwPermStreet: "",
    ofwdependents: "",
    ofwvalidid: "",
    ofwidnumber: "",
    ofwcountry: "",
    ofwjobtitle: "",
    ofwcompany: "",
    ofwsalary: "",
    ofwHighestEdu: "",
    ofwschool: "",
    ofwcourse: "",
    ofwCurrencyName: "",
    ofwPesoSalary: 0,
    ofwProvSameAdd: false,
    ofwprovProv: "",
    ofwprovMunicipality: "",
    ofwprovBarangay: "",
    ofwprovStreet: "",
    ofwBorrowersCode: "",
    ofwlosYear: "",
    ofwlosMonth: "",
    
    // Beneficiary Details
    benfname: "",
    benmname: "",
    withBenMName: 0,
    benlname: "",
    bensuffix: "",
    benbdate: "",
    bengender: "",
    benmstatus: "",
    benspousename: "",
    benspousebdate: "",
    benemail: "",
    benmobile: "",
    benothermobile: "",
    benfblink: "",
    bendepents: "",
    benrelationship: "",
    bensameadd: false,
    benpresprov: "",
    benpresmunicipality: "",
    benpresbarangay: "",
    benpresstreet: "",
    benresidences: "",
    benstaymonths: "",
    benstayyears: "",
    bendependents:"",
    benrelationship: "",

    // Co-Borrower Details
    coborrowfname: "",
    coborrowmname: "",
    coborrowlname: "",
    coborrowsuffix: "",
    coborrowbdate: "",
    coborrowgender: "",
    coborrowmstatus: "",
    coborrowemail: "",
    coborrowmobile: "",
    coborrowothermobile: "",
    coborrowdependents: "",
    coborrowfblink: "",
    coborrowspousename: "",
    coborrowerspousebdate: "",
    coborrowsameadd: 0,
    coborrowProv: "",
    coborrowMunicipality: "",
    coborrowBarangay: "",
    coborrowStreet: "",
    coborrowresidences: "",
    AcbStayMonths: "",
    AcbStayYears: "",
    coborrowProvname: "",
    coborrowMunicipalityname: "",
    coborrowBarangayname: "",
    sepcoborrowfname: "",

    // CRAM Data
    PrevAmount: "",
    CRAApprvRec: "",
    CRARemarks: "",
    ApprvAmount: "",
    ApprvInterestRate: "",
    MonthlyAmort: "",
    OtherExposure: "",
    TotalExposure: "",
    ApprvTerms: "",
    CRORemarks: "",

    // Present Address Tables
    OfwPoBRemarks: "",
    BenPoBRemarks: "",
    AcbPoBRemarks: "",
    BenRentAmount: "",
    AcbRentAmount: "",
    BenLandMark: "",
    AcbLandMark: "",

    // OFW Additional Details
    SpSrcIncome: "",
    SpIncome: "",
    Religion: "",
    PEP: "",
    MarriedPBCB: "",
    RelationshipBen: "",
    RelationshipAdd: "",
    OfwRemrks: "",
    PEmployer: "",
    ContractDate: "",
    ContractDuration: "",
    UnliContract: "",
    JobCategory: "",
    EmpStatus: "",
    FCurrency: "",
    FCurValue: "",
    FSalary: "",
    PSalary: "",
    YrsOfwSeafarer: "",
    VesselName: "",
    VesselType: "",
    VesselIMO: "",
    AllotName: "",
    AllotAmount: "",
    AllotChannel: "",
    ExactLocation: "",
    PossVacation: "",

    // Co-Borrower/Beneficiary Table
    BenMarriedPBCB: "",
    BenSpSrcIncome: "",
    BenSpIncome: "",
    BenGrpChat: "",
    BenSrcIncome: "",
    BenReligion: "",
    BenFormerOFW: "",
    BenLastReturn: "",
    BenPlanAbroad: "",
    BenPEP: "",
    BenRemarks: "",

    // Additional Co-Borrower Table
    AcbRelationship: "",
    AcbRelationshipName: "",
    AcbSpSrcIncome: "",
    AcbSpIncome: "",
    AcbGrpChat: "",
    AcbSrcIncome: "",
    AcbReligion: "",
    AcbFormerOFW: "",
    AcbLastReturn: "",
    AcbPlanAbroad: "",
    AcbPEP: "",
    AcbRemarks: "",

    // Kaiser Checker
    ofwfirstname: "",
    ofwlastname: "",
    benfirstname: "",
    benlastname: "",
    acbfirstname: "",
    acblastname: "",

    // Show ACB state
    addCoborrower: "",

    // Tracking Fields
    loanAppCode: "",
    loanIdCode: "",
    loanBranchId: "",
    loanStatus: "",
    consultant: "",
    referredby: "",
    borrowersCode: "",
    ofwPresProvname: "",
    ofwPresMunicipalityname: "",
    ofwPresBarangayname: "",
    ofwrent: "",
    ofwPermProvname: "",
    ofwPermMunicipalityname: "",
    ofwPermBarangayname: "",
    benFb: "",
    benpresprovname: "",
    benpresmunicipalityname: "",
    benpresbarangayname: "",

    //getClientData Extras
    // statusMasterlist:"",
    // statusFfcc:"",
    // statusCraf:"",
    // statusVideoCall:"",
    // statusShareLocation:"",
    // statusAgencyVerification:"",
    // groupChat:"",
    // relationship: "",
    // relationshipID: "",


  };
};

export default createInitialAppDetails;