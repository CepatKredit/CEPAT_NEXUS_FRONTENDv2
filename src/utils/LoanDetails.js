import axios from 'axios';

export const UpdateLoanDetails = async ({
    //VALUES HERE ARE NOW DEFAULT, IT CAN BE CHANGED BUT IT WILL AFFECT OTHER FUNCTIONS CONNECTED HERE. IF YOU WANT TO REPLACE VALUE ONE TIME, PLEASE ADD A PARAMETER ON BY CALLING THIS FUNCTION.
    //LoanDetails
    LoanAppId, //Not null
    Tab = null, //if null it will not update
    BorrowersCode = null,
    Origin = null,
    Dpa = null,
    Product = null,
    BranchId = null,
    DepartureDate = null,
    Purpose = null,
    LoanType = null,
    Amount = null,
    Terms = null,
    Channel = null,
    Consultant = null,
    ConsultantNo = null,
    ConsultantProfile = null,
    ReferredBy = null,
    FirstName = null,
    MiddleName = null,
    LastName = null,
    Suffix = null,
    BirthDay = null,
    Gender = null,
    CivilStatus = null,
    Dependent = null,
    Email = null,
    MobileNo = null,
    MobileNo2 = null,
    FbProfile = null,
    Country = null,
    JobTitle = null,
    Employer = null,
    Salary = null,
    Relationship = null,
    GroupChat = null,
    SpouseName = null,
    SpouseBirthday = null,
    Ownership = null,
    RentAmount = null,
    IsCurrPerm = null,
    IsPermProv = null,
    Landmark = null,
    StayYears = null,
    StayMonths = null,
    CollectionArea = null,

    EducationLevel = null,
    School = null,
    Course = null,
    PerAddExist = null,
    ProAddExist = null,
    ProvinceId = null,
    MunicipalityId = null,
    BarangayId = null,
    Address1 = null,
    PerProvinceId = null,
    PerMunicipalityId = null,
    PerBarangayId = null,
    PerAddress1 = null,
    ProAddress1 = null,
    ProBarangayId = null,
    ProMunicipalityId = null,
    ProProvinceId = null,
    ProCountryId = null,
    ValidId = null,
    ValidIdNo = null,
    BenFirstName = null,
    BenMiddleName = null,
    BenLastName = null,
    BenSuffix = null,
    BenBirthday = null,
    BenGender = null,
    BenCivilStatus = null,
    BenSpouseName = null,
    BenSpouseBirthday = null,
    BenEmail = null,
    BenDependent = null,
    BenMobileNo = null,
    BenMobileNo2 = null,
    BenRelationship = null,
    BenFbProfile = null,
    BenOwnership = null,
    BenStayYears = null,
    BenStayMonths = null,
    BenProvinceId = null,
    BenMunicipalityId = null,
    BenBarangayId = null,
    BenAddress1 = null,
    BenIsCurrPerm = null,
    //Add co-borrow
    AcbFirstName = null,
    AcbMiddleName = null,
    AcbLastName = null,
    AcbSuffix = null,
    AcbBirthday = null,
    AcbGender = null,
    AcbCivilStatus = null,
    AcbDependent = null,
    AcbEmail = null,
    AcbMobileNo = null,
    AcbMobileNo2 = null,
    AcbFbProfile = null,
    AcbSpouseName = null,
    AcbSpouseBirthday = null,
    AcbOwnership = null,
    AcbAddress1 = null,
    AcbBarangay = null,
    AcbMunicipality = null,
    AcbProvince = null,
    AcbStayMonths = null,
    AcbStayYears = null,

    //CRAM
    PrevAmount = null,
    CRAApprvRec = null,
    CRARemarks = null,
    ApprvAmount = null,
    ApprvTerms = null,
    ApprvInterestRate = null,
    MonthlyAmort = null,
    OtherExposure = null,
    TotalExposure = null,
    CRORemarks = null,
    ForApprovalBy = null,
    ForApprovalDate = null,
    CremanBy = null,
    CremanDate = null,
    
    // Present Address Tables
    OfwPoBRemarks = null,
    BenPoBRemarks = null,
    AcbPoBRemarks = null,
    BenRentAmount = null,
    AcbRentAmount = null,
    BenLandMark = null,
    AcbLandMark = null,
    // Ofw Details
    SpSrcIncome = null,
    SpIncome = null,
    Religion = null,
    PEP = null,
    MarriedPBCB = null,
    RelationshipBen = null,
    RelationshipAdd = null,
    OfwRemarks = null,
    PEmployer = null,
    ContractDate = null,
    ContractDuration = null,
    UnliContract = null,
    JobCategory = null,
    EmpStatus = null,
    FCurrency = null,
    FSalary = null,
    PSalary = null,
    YrsOfwSeafarer = null,
    VesselName = null,
    VesselType = null,
    VesselIMO = null,
    AllotName = null,
    AllotAmount = null,
    AllotChannel = null,
    ExactLocation = null,
    PossVacation = null,
    // Co-Borrower/Beneficiary Table
    BenMarriedPBCB = null,
    BenSpSrcIncome = null,
    BenSpIncome = null,
    BenGrpChat = null,
    BenSrcIncome = null,
    BenReligion = null,
    BenFormerOFW = null,
    BenLastReturn = null,
    BenPlanAbroad = null,
    BenPEP = null,
    BenRemarks = null,
    // Additional Co-Borrower Table
    AcbRelationship = null,
    AcbSpSrcIncome = null,
    AcbSpIncome = null,
    AcbGrpChat = null,
    AcbSrcIncome = null,
    AcbReligion = null,
    AcbFormerOFW = null,
    AcbLastReturn = null,
    AcbPlanAbroad = null,
    AcbPEP = null,
    AcbRemarks = null,


    //Kaiser Checker
    ofwfname = null,
    ofwlname = null,
    benfname = null,
    benlname = null,
    acbfname = null,
    acblname = null,


    ModUser,


    //....  
}) => {
    const data = {
        //LoanAppId: toUpperText(uuidv4()),
        LoanAppId: LoanAppId,
        Tab: Tab,
        BorrowersCode: BorrowersCode,
        Origin: Origin,
        Dpa: Dpa,
        Product: Product,
        BranchId: BranchId,
        DepartureDate: DepartureDate,
        Purpose: Purpose,
        LoanType: LoanType,
        Amount: Amount,
        Terms: Terms,
        Channel: Channel,
        Consultant: Consultant,
        ConsultantNo: ConsultantNo,
        ConsultantProfile: ConsultantProfile,
        ReferredBy: ReferredBy,
        FirstName: FirstName,
        MiddleName: MiddleName,
        LastName: LastName,
        Suffix: Suffix,
        BirthDay: BirthDay,
        Gender: Gender,
        CivilStatus: CivilStatus,
        Dependent: Dependent,
        Email: Email,
        MobileNo: MobileNo,
        MobileNo2: MobileNo2,
        FbProfile: FbProfile,
        Country: Country,
        JobTitle: JobTitle,
        Employer: Employer,
        Salary: Salary,
        Relationship: Relationship,
        GroupChat: GroupChat,
        SpouseName: SpouseName,
        SpouseBirthday: SpouseBirthday,
        Ownership: Ownership,
        RentAmount: RentAmount,
        IsCurrPerm: IsCurrPerm,
        IsPermProv: IsPermProv,
        Landmark: Landmark,
        StayYears: StayYears,
        StayMonths: StayMonths,
        CollectionArea: CollectionArea,
        EducationLevel: EducationLevel,
        School: School,
        Course: Course,
        PerAddExist: PerAddExist,
        ProAddExist: ProAddExist,
        ProvinceId: ProvinceId,
        MunicipalityId: MunicipalityId,
        BarangayId: BarangayId,
        Address1: Address1,
        PerProvinceId: PerProvinceId,
        PerMunicipalityId: PerMunicipalityId,
        PerBarangayId: PerBarangayId,
        PerAddress1: PerAddress1,
        ProAddress1: ProAddress1,
        ProBarangayId: ProBarangayId,
        ProMunicipalityId: ProMunicipalityId,
        ProProvinceId: ProProvinceId,
        ProCountryId: ProCountryId,
        ValidId: ValidId,
        ValidIdNo: ValidIdNo,
        BenFirstName: BenFirstName,
        BenMiddleName: BenMiddleName,
        BenLastName: BenLastName,
        BenSuffix: BenSuffix,
        BenBirthday: BenBirthday,
        BenGender: BenGender,
        BenCivilStatus: BenCivilStatus,
        BenSpouseName: BenSpouseName,
        BenSpouseBirthday: BenSpouseBirthday,
        BenEmail: BenEmail,
        BenDependent: BenDependent,
        BenMobileNo: BenMobileNo,
        BenMobileNo2: BenMobileNo2,
        BenRelationship: BenRelationship,
        BenFbProfile: BenFbProfile,
        BenOwnership: BenOwnership,
        BenStayYears: BenStayYears,
        BenStayMonths: BenStayMonths,
        BenProvinceId: BenProvinceId,
        BenMunicipalityId: BenMunicipalityId,
        BenBarangayId: BenBarangayId,
        BenAddress1: BenAddress1,
        BenIsCurrPerm: BenIsCurrPerm,
        //Add co-borrow
        AcbFirstName: AcbFirstName,
        AcbMiddleName: AcbMiddleName,
        AcbLastName: AcbLastName,
        AcbSuffix: AcbSuffix,
        AcbBirthday: AcbBirthday,
        AcbGender: AcbGender,
        AcbCivilStatus: AcbCivilStatus,
        AcbDependent: AcbDependent,
        AcbEmail: AcbEmail,
        AcbMobileNo: AcbMobileNo,
        AcbMobileNo2: AcbMobileNo2,
        AcbFbProfile: AcbFbProfile,
        AcbSpouseName: AcbSpouseName,
        AcbSpouseBirthday: AcbSpouseBirthday,
        AcbOwnership: AcbOwnership,
        AcbAddress1: AcbAddress1,
        AcbBarangay: AcbBarangay,
        AcbMunicipality: AcbMunicipality,
        AcbProvince: AcbProvince,
        AcbStayMonths: AcbStayMonths,
        AcbStayYears: AcbStayYears,

        //CRAM
        PrevAmount: PrevAmount,
        CRAApprvRec: CRAApprvRec,
        CRARemarks: CRARemarks,
        ApprvAmount: ApprvAmount,
        ApprvTerms: ApprvTerms,
        ApprvInterestRate: ApprvInterestRate,
        MonthlyAmort: MonthlyAmort,
        OtherExposure: OtherExposure,
        TotalExposure: TotalExposure,
        CRORemarks: CRORemarks,
        ForApprovalBy: ForApprovalBy,
        ForApprovalDate: ForApprovalDate,
        CremanBy: CremanBy,
        CremanDate: CremanDate,


        // Present Address Tables
        OfwPoBRemarks: OfwPoBRemarks,
        BenPoBRemarks: BenPoBRemarks,
        AcbPoBRemarks: AcbPoBRemarks,
        BenRentAmount: BenRentAmount,
        AcbRentAmount: AcbRentAmount,
        BenLandMark: BenLandMark,
        AcbLandMark: AcbLandMark,
        // Ofw Details
        SpSrcIncome: SpSrcIncome,
        SpIncome: SpIncome,
        Religion: Religion,
        PEP: PEP,
        MarriedPBCB: MarriedPBCB,
        RelationshipBen: RelationshipBen,
        RelationshipAdd: RelationshipAdd,
        OfwRemarks: OfwRemarks,
        PEmployer: PEmployer,
        ContractDate: ContractDate,
        ContractDuration: ContractDuration,
        UnliContract: UnliContract,
        JobCategory: JobCategory,
        EmpStatus: EmpStatus,
        FCurrency: FCurrency,
        FSalary: FSalary,
        PSalary: PSalary,
        YrsOfwSeafarer: YrsOfwSeafarer,
        VesselName: VesselName,
        VesselType: VesselType,
        VesselIMO: VesselIMO,
        AllotName: AllotName,
        AllotAmount: AllotAmount,
        AllotChannel: AllotChannel,
        ExactLocation: ExactLocation,
        PossVacation: PossVacation,
        // Co-Borrower/Beneficiary Table
        BenMarriedPBCB: BenMarriedPBCB,
        BenSpSrcIncome: BenSpSrcIncome,
        BenSpIncome: BenSpIncome,
        BenGrpChat: BenGrpChat,
        BenSrcIncome: BenSrcIncome,
        BenReligion: BenReligion,
        BenFormerOFW: BenFormerOFW,
        BenLastReturn: BenLastReturn,
        BenPlanAbroad: BenPlanAbroad,
        BenPEP: BenPEP,
        BenRemarks: BenRemarks,
        // Additional Co-Borrower Table
        AcbRelationship: AcbRelationship,
        AcbSpSrcIncome: AcbSpSrcIncome,
        AcbSpIncome: AcbSpIncome,
        AcbGrpChat: AcbGrpChat,
        AcbSrcIncome: AcbSrcIncome,
        AcbReligion: AcbReligion,
        AcbFormerOFW: AcbFormerOFW,
        AcbLastReturn: AcbLastReturn,
        AcbPlanAbroad: AcbPlanAbroad,
        AcbPEP: AcbPEP,
        AcbRemarks: AcbRemarks,

        ModUser: ModUser,
    }

    //console.log(data)
    let fresult = null;

    const checkLoan = {
        LoanAppId: LoanAppId,
        FirstName: FirstName,
        LastName: LastName,
        Birthday: BirthDay,
    }

    var check = 0;
    var duplicate_result = null;

    if (FirstName !== null || LastName !== null) {
        await axios.post('/POST/P47CL', checkLoan)
            .then((result) => {
                result.data?.list.map(() => { check = 1; })
                duplicate_result = result;
            })
            .catch((error) => {
                console.log(error);
            });


        console.log(check)
    }
    /*
    //check if fullname is changed, update kaiser no display
    if ((ofwfname && (ofwfname === FirstName)) || (ofwlname && (ofwlname === LastName))) {
        console.log('Update OFW Kaiser...')
    }
    if ((benfname && (benfname === BenFirstName)) || (benlname && (benlname === LastName))) {
        console.log('Update Beneficiary Kaiser...')
    }
    if ((acbfname && (acbfname === FirstName)) || (acblname && (acblname === LastName))) {
        console.log('Update Additional Co-Borrower Kaiser...')
    }*/

    if (check === 0) {
        await axios.post('/POST/P48UD', data)
            .then((result) => {
                fresult = result;
            })
            .catch((error) => {
                console.log(error);
            });
    }
    else {
        fresult = {
            data: {
                status: 'info',
                message: 'Loan Already Exists',
                description: `Please be advised that you have an ongoing application with Cepat Kredit ${duplicate_result.data?.list[0].branch} branch with Loan Application No. 
                    ${duplicate_result.data?.list[0].loanAppCode}. For further concerns, please email our Customer Service Department at customerservice@cepatkredit.com. Thank you!`
            }
        }
    }

    return fresult;
}