import * as React from "react";
import { Button, Input, Radio, Select, Space, Spin, notification } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateKey } from "@utils/Generate";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DisbursementList from "./DisbursementList";
import { useDataContainer } from "@context/PreLoad";
import { NameList } from "@utils/NameListNetProceed";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { useLocation } from "react-router-dom";
import { mmddyy, toDecrypt, toEncrypt } from "@utils/Converter";
import { GET_LIST } from "@api/base-api/BaseApi";

function NetProceeds({ data }) {
  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();
  const {
    getBank,
    getPurpose,
    SET_LOAN_APPLICATION_NUMBER,
    GET_TOTAL_AMOUNT,
    GET_REFRESH_LAN,
    SET_REFRESH_LAN,
  } = useDataContainer();
  const { getAppDetails, setAppDetails } = React.useContext(
    LoanApplicationContext
  );
  const nameListOptions = React.useMemo(
    () => NameList(getAppDetails),
    [getAppDetails]
  );
  const [getData, setData] = React.useState({
    PaymentType: "",
    FirstName: "",
    LastName: "",
    Suffix: "",
    BankName: "",
    BankAcctNo: "",
    Amount: "",
    Type: "NP",
    Purpose: "",
    Status: "AVAILABLE",
  });
  console.log("GET APP DETAILS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("GET APP DETAILS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("GET APP DETAILS", getAppDetails);
  console.log("GET APP DETAILS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("GET APP DETAILS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  React.useEffect(() => {
    GetClient.refetch();
    console.log("TRIGGER")
  }, [toDecrypt(localStorage.getItem("SIDC")), ]);

  const GetClient = useQuery({
    queryKey: ["ClientDataListQuery", toDecrypt(localStorage.getItem("SIDC"))],
    queryFn: async () => {
      const result = await GET_LIST(
        `/v1/GET/G3CD/${toDecrypt(localStorage.getItem("SIDC"))}`
      );
      const data = result.list;

      // Populate app details and old client data when data is fetched
      setAppDetails((prevDetails) => ({
        ...prevDetails,
        loanAppCode: data?.LoanDetails?.loanAppCode || "",
        loanIdCode: data?.LoanDetails?.loanAppId || "",
        loanDateDep: data?.LoanDetails?.departureDate
          ? mmddyy(data.LoanDetails.departureDate)
          : "",
        loanCreated: data?.LoanDetails?.recDate
          ? mmddyy(data.LoanDetails.recDate)
          : "No Date Created!",
        loanAppStat: data?.LoanDetails?.status || "",
        loanAppStatId: data?.LoanDetails?.statusId || "",
        loanProd: data?.LoanDetails?.productId || "",
        ofwDeptDate: data?.LoanDetails?.departureDate || "",
        loanPurpose: data?.LoanDetails?.purposeId || "",
        loanType: data?.LoanDetails?.loanTypeId || "",
        loanBranchId: data?.LoanDetails?.branchId || "",
        loanBranch: data?.LoanDetails?.branch || "",
        loanAmount: data?.LoanDetails?.amount || "",
        channel: data?.LoanDetails?.channel || "",
        channelId: data?.LoanDetails?.channelId || "",
        loanTerms: data?.LoanDetails?.terms || "",
        consultName: data?.LoanDetails?.consultant || "",
        consultNumber: data?.LoanDetails?.consultantNo || "",
        consultantfblink: data?.LoanDetails?.consultantProfile || "",

        statusCraf: data?.LoanDetails?.statusCraf || "",
        statusFfcc: data?.LoanDetails?.statusFfcc || "",
        statusAgencyVerification:
          data?.LoanDetails?.statusAgencyVerification || "",
        statusKaiser: data?.LoanDetails?.statusKaiser || "",
        statusMasterlist: data?.LoanDetails?.statusMasterlist || "",
        statusShareLocation: data?.LoanDetails?.statusShareLocation || "",
        statusVideoCall: data?.LoanDetails?.statusVideoCall || "",
        // OFW Details
        ofwBorrowersCode: data?.OfwDetails?.borrowersCode || "",
        ofwfname: data?.OfwDetails?.firstName || "",
        ofwmname: data?.OfwDetails?.middleName || "",
        ofwlname: data?.OfwDetails?.lastName || "",
        ofwsuffix: data?.OfwDetails?.suffix || "",
        ofwbdate: data?.OfwDetails?.birthdate
          ? mmddyy(data.OfwDetails.birthdate)
          : "",
        ofwgender: data?.OfwDetails?.genderId || "",
        ofwmstatus: data?.OfwDetails?.civilStatusId || "",
        ofwspouse: data?.OfwDetails?.spouseName || "",
        ofwspousebdate: data?.OfwDetails?.spouseBirthday
          ? mmddyy(data?.OfwDetails?.spouseBirthday)
          : "",
        ofwemail: data?.OfwDetails?.email || "",
        ofwmobile: data?.OfwDetails?.mobileNo || "",
        ofwothermobile: data?.OfwDetails?.mobileNo2 || "",
        ofwfblink: data?.OfwDetails?.fbProfile || "",
        ofwdependents: data?.OfwDetails?.withDependent || "",
        ofwvalidid: data?.OfwDetails?.validId || "",
        ofwidnumber: data?.OfwDetails?.validIdNo || "",
        ofwcountry: data?.OfwDetails?.country || "",
        ofwjobtitle: data?.OfwDetails?.jobTitle || "",
        ofwcompany: data?.OfwDetails?.employer || "",
        ofwsalary: data?.OfwDetails?.salary || "",
        ofwHighestEdu: data?.OfwDetails?.educationLevelId || null, //check if it is the value
        ofwschool: data?.OfwDetails?.school || "",
        ofwcourse: data?.OfwDetails?.course || "",
        ofwgroupchat: data?.OfwDetails?.groupChat || "",
        ofwrelationship: data?.OfwDetails?.relationshipID || "",

        // OFW Addressesg
        ofwresidences: data?.OfwPresAddress?.ownershipId || "",
        ofwPresProv: data?.OfwPresAddress?.provinceId || "",
        ofwPresProvname: data?.OfwPresAddress?.province || "",
        ofwPresMunicipality: data?.OfwPresAddress?.municipalityId || "",
        ofwPresMunicipalityname: data?.OfwPresAddress?.municipality || "",
        ofwPresBarangay: data?.OfwPresAddress?.barangayId || "",
        ofwPresBarangayname: data?.OfwPresAddress?.barangay || "",
        ofwPresStreet: data?.OfwPresAddress?.address1 || "",
        ofwrent:
          data?.OfwPresAddress?.rentAmount === null
            ? ""
            : data?.OfwPresAddress?.rentAmount,
        ofwlosMonth: data?.OfwPresAddress?.stayMonths || "",
        ofwlosYear: data?.OfwPresAddress?.stayYears || "",
        collectionarea: data?.OfwPresAddress?.collectionAreaId || "",
        collectionareaname: data?.OfwPresAddress?.collectionArea || "",

        landmark: data?.OfwPresAddress?.landmark || "",
        ofwSameAdd:
          data.OfwPresAddress.provinceId &&
          data?.OfwPermAddress?.address1 == data?.OfwPresAddress?.address1 &&
          data?.OfwPermAddress?.barangayId == data?.OfwPresAddress?.barangayId
            ? 1
            : 0,
        ofwProvSameAdd:
          data.OfwPermAddress.provinceId &&
          data?.OfwPermAddress?.address1 == data?.OfwProvAddress?.address1 &&
          data?.OfwPermAddress?.barangayId == data?.OfwProvAddress?.barangayId
            ? 1
            : 0,
        bensameadd:
          data.OfwPresAddress.provinceId &&
          data?.BeneficiaryPresAddress?.address1 ==
            data?.OfwPresAddress?.address1 &&
          data?.BeneficiaryPresAddress?.barangayId ==
            data?.OfwPresAddress?.barangayId
            ? 1
            : 0,
        coborrowSameAdd:
          data.OfwPresAddress.provinceId &&
          data?.CoborrowPresAddress?.address1 ==
            data?.OfwPresAddress?.address1 &&
          data?.CoborrowPresAddress?.barangayId ==
            data?.OfwPresAddress?.barangayId
            ? 1
            : 0,

        ofwPermProv: data?.OfwPermAddress?.provinceId || "",
        ofwPermProvname: data?.OfwPermAddress?.province || "",
        ofwPermMunicipality: data?.OfwPermAddress?.municipalityId || "",
        ofwPermMunicipalityname: data?.OfwPermAddress?.municipality || "",
        ofwPermBarangay: data?.OfwPermAddress?.barangayId || "",
        ofwPermBarangayname: data?.OfwPermAddress?.barangay || "",
        ofwPermStreet: data?.OfwPermAddress?.address1 || "",

        ofwprovProv: data?.OfwProvAddress?.provinceId || "",
        ofwprovProvname: data?.OfwProvAddress?.province || "",
        ofwprovMunicipality: data?.OfwProvAddress?.municipalityId || "",
        ofwprovMunicipalityname: data?.OfwProvAddress?.municipality || "",
        ofwprovBarangay: data?.OfwProvAddress?.barangayId || "",
        ofwprovBarangayname: data?.OfwProvAddress?.barangay || "",
        ofwprovStreet: data?.OfwProvAddress?.address1 || "",

        // Beneficiary Details
        benfname: data?.BeneficiaryDetails?.firstName || "",
        benmname: data?.BeneficiaryDetails?.middleName || "",
        benlname: data?.BeneficiaryDetails?.lastName || "",
        bensuffix: data?.BeneficiaryDetails?.suffix || "",
        benbdate: data?.BeneficiaryDetails?.birthdate
          ? mmddyy(data.BeneficiaryDetails?.birthdate)
          : "",
        bengender: data?.BeneficiaryDetails?.genderId || "",
        benmstatus: data?.BeneficiaryDetails?.civilStatusId || "",
        benfblink: data?.BeneficiaryDetails?.fbProfile || "",
        benemail: data?.BeneficiaryDetails?.email || "",
        benmobile: data?.BeneficiaryDetails?.mobileNo || "",
        benothermobile: data?.BeneficiaryDetails?.mobileNo2 || "",
        benrelationship: data?.BeneficiaryDetails?.relationshipID || "",
        bendependents: data?.BeneficiaryDetails?.withDependent || "",

        benspouse: data?.BeneficiaryDetails?.spouseName || "",
        benspousebdate: data?.BeneficiaryDetails?.spouseBirthday
          ? mmddyy(data?.BeneficiaryDetails?.spouseBirthday)
          : "",

        // Beneficiary Addresses
        benresidences: data?.BeneficiaryPresAddress?.ownershipId || "",
        benpresprov: data?.BeneficiaryPresAddress?.provinceId || "",
        benpresprovname: data?.BeneficiaryPresAddress?.province || "",
        benpresmunicipality: data?.BeneficiaryPresAddress?.municipalityId || "",
        benpresmunicipalityname:
          data?.BeneficiaryPresAddress?.municipality || "",
        benpresbarangay: data?.BeneficiaryPresAddress?.barangayId || "",
        benpresbarangayname: data?.BeneficiaryPresAddress?.barangay || "",
        benpresstreet: data?.BeneficiaryPresAddress?.address1 || "",
        benstaymonths: data?.BeneficiaryPresAddress?.stayMonths || "",
        benstayyears: data?.BeneficiaryPresAddress?.stayYears || "",

        // Co-Borrower Details
        coborrowfname: data?.CoborrowDetails?.firstName || "",
        coborrowmname: data?.CoborrowDetails?.middleName || "",
        coborrowlname: data?.CoborrowDetails?.lastName || "",
        coborrowsuffix: data?.CoborrowDetails?.suffix || "",
        coborrowbdate: data?.CoborrowDetails?.birthdate
          ? mmddyy(data.CoborrowDetails?.birthdate)
          : "",
        coborrowgender: data?.CoborrowDetails?.genderId || "",
        coborrowmstatus: data?.CoborrowDetails?.civilStatusId || "",
        coborrowemail: data?.CoborrowDetails?.email || "",
        coborrowmobile: data?.CoborrowDetails?.mobileNo || "",
        coborrowothermobile: data?.CoborrowDetails?.mobileNo2 || "",
        coborrowdependents: data?.CoborrowDetails?.withDependent || "",
        coborrowfblink: data?.CoborrowDetails?.fbProfile || "",
        coborrowspousename: data?.CoborrowDetails?.spouseName || "",
        coborrowerspousebdate: data?.CoborrowDetails?.spouseBirthday
          ? mmddyy(data?.CoborrowDetails?.spouseBirthday)
          : "",

        // Co-Borrower Addresses
        coborrowresidences: data?.CoborrowPresAddress?.ownershipId || "",
        coborrowProv: data?.CoborrowPresAddress?.provinceId || "",
        coborrowProvname: data?.CoborrowPresAddress?.province || "",
        coborrowMunicipality: data?.CoborrowPresAddress?.municipalityId || "",
        coborrowMunicipalityname: data?.CoborrowPresAddress?.municipality || "",
        coborrowBarangay: data?.CoborrowPresAddress?.barangayId || "",
        coborrowBarangayname: data?.CoborrowPresAddress?.barangay || "",
        coborrowStreet: data?.CoborrowPresAddress?.address1 || "",
        AcbStayMonths: data?.CoborrowPresAddress?.stayMonths || "",
        AcbStayYears: data?.CoborrowPresAddress?.stayYears || "",

        //CRAM Data
        PrevAmount: data?.LoanDetails?.prevApprovedAmnt || "",
        CRAApprvRec: data?.LoanDetails?.craApprovedRec || "",
        CRARemarks: data?.LoanDetails?.craRemarks || "",
        ApprvAmount: data?.LoanDetails?.approvedAmount || "",
        ApprvTerms: data?.LoanDetails?.approvedTerms || "",
        ApprvInterestRate: data?.LoanDetails?.apprvInterestRate || "",
        MonthlyAmort: data?.LoanDetails?.monthlyAmort || "",
        OtherExposure: data?.LoanDetails?.otherExposure || "",
        TotalExposure: data?.LoanDetails?.totalExposure || "",
        CRORemarks: data?.LoanDetails?.croRemarks || "",
        // Present Address Tables
        OfwPoBRemarks: data?.OfwPresAddress?.billingRemarks || "",
        BenPoBRemarks: data?.BeneficiaryPresAddress?.billingRemarks || "",
        AcbPoBRemarks: data?.CoborrowPresAddress?.billingRemarks || "",
        BenRentAmount: data?.BeneficiaryPresAddress?.rentAmount || "",
        AcbRentAmount: data?.CoborrowPresAddress?.rentAmount || "",
        BenLandMark: data?.BeneficiaryPresAddress?.landMark || "",
        AcbLandMark: data?.CoborrowPresAddress?.landMark || "",
        // Ofw Details
        SpSrcIncome: data?.OfwDetails?.spouseSourceIncome || "",
        SpIncome: data?.OfwDetails?.spouseIncome || "",
        SrcIncome: data?.OfwDetails?.cbAcbIncomeSource || "",
        Religion: data?.OfwDetails?.religion || "",
        PEP: data?.OfwDetails?.isPeP || "",
        MarriedPBCB: data?.OfwDetails?.isPbCbMarried || "",
        RelationshipBen: data?.OfwDetails?.relationshipToBen || "",
        RelationshipAdd: data?.OfwDetails?.relationshipToAcb || "",
        OfwRemrks: data?.OfwDetails?.remarks || "",
        PEmployer: data?.OfwEmploymentDetails?.principalEmployer || "",
        ContractDate: data?.OfwEmploymentDetails?.contractDate
          ? mmddyy(data.OfwEmploymentDetails.contractDate)
          : "",
        ContractDuration: data?.OfwEmploymentDetails?.contractDuration || "",
        UnliContract: data?.OfwEmploymentDetails?.contractUnli || "",
        JobCategory: data?.OfwEmploymentDetails?.jobCategory || "",
        EmpStatus: data?.OfwEmploymentDetails?.employmentStatus || "",
        FCurrency: data?.OfwEmploymentDetails?.foreignCurrency || "",
        FSalary: data?.OfwEmploymentDetails?.salaryInForeign || "",
        PSalary: data?.OfwEmploymentDetails?.salaryInPeso || "",
        YrsOfwSeafarer: data?.OfwEmploymentDetails?.yearOFW || "",
        VesselName: data?.OfwEmploymentDetails?.vesselName || "",
        VesselType: data?.OfwEmploymentDetails?.vesselType || "",
        VesselIMO: data?.OfwEmploymentDetails?.vesselImo || "",
        AllotName: data?.OfwEmploymentDetails?.remittanceRecipient || "",
        AllotAmount: data?.OfwEmploymentDetails?.remittanceAmount || "",
        AllotChannel: data?.OfwEmploymentDetails?.remittanceChannel || "",
        ExactLocation: data?.OfwEmploymentDetails?.exactLocation || "",
        PossVacation: data?.OfwEmploymentDetails?.possibleVacation || "",
        // Co-Borrower/Beneficiary Table
        BenMarriedPBCB: data?.BeneficiaryDetails?.isPbCbMarried || "", //
        BenSpSrcIncome: data?.BeneficiaryDetails?.spouseSourceIncome || "", //
        BenSpIncome: data?.BeneficiaryDetails?.spouseIncome || "", //
        BenGrpChat: data?.BeneficiaryDetails?.groupChat || "",
        BenSrcIncome: data?.BeneficiaryDetails?.cbAcbIncomeSource || "", //
        BenReligion: data?.BeneficiaryDetails?.religion || "",
        BenPEP: data?.BeneficiaryDetails?.isPeP || "",
        BenPlanAbroad: data?.BeneficiaryDetails?.plantoAbroad || "",
        BenFormerOFW: data?.BeneficiaryDetails?.isFormerOfw || "", //
        BenLastReturn: data?.BeneficiaryDetails?.lastReturnHome || "", //
        BenRemarks: data?.BeneficiaryDetails?.remarks || "", //
        // Additional Co-Borrower Table
        AcbSpSrcIncome: data?.CoborrowDetails?.spouseSourceIncome || "", //
        AcbSpIncome: data.CoborrowDetails?.spouseIncome || "", //
        AcbGrpChat: data?.CoborrowDetails?.groupchat || "",
        AcbSrcIncome: data?.CoborrowDetails?.cbAcbIncomeSource || "",
        AcbReligion: data?.CoborrowDetails?.religion || "",
        AcbFormerOFW: data?.CoborrowDetails?.isFormerOfw || "",
        AcbLastReturn: data?.CoborrowDetails?.lastReturnHome || "",
        AcbPlanAbroad: data?.CoborrowDetails?.plantoAbroad || "",
        AcbPEP: data?.CoborrowDetails?.isPeP || "", //
        AcbRemarks: data?.CoborrowDetails?.remarks || "", //
        AcbRelationship: data?.CoborrowDetails?.relationshipID || "",
        AcbRelationshipName: data?.CoborrowDetails?.relationship || "",

        //Kaiser checker
        ofwfirstname: data?.OfwDetails?.firstName || "",
        ofwlastname: data?.OfwDetails?.lastName || "",
        benfirstname: data?.BeneficiaryDetails?.firstName || "",
        benlastname: data?.BeneficiaryDetails?.lastName || "",
        acbfirstname: data?.CoborrowDetails?.firstName || "",
        acblastname: data?.CoborrowDetails?.lastName || "",
        //Acb show Status
        addCoborrower: data?.CoborrowDetails?.firstName || "",
      }));

      return data;
    },
    enabled: true,
  });


  React.useEffect(() => {
    SET_LOAN_APPLICATION_NUMBER(data.LAN.props.children);
    ComputeRemaining();
  }, [data]);

  React.useEffect(() => {
    ComputeRemaining();
  }, [GET_REFRESH_LAN, GET_TOTAL_AMOUNT]);
  const [getRemaining, setRemaining] = React.useState("");
  function ComputeRemaining() {
    let value =
      parseFloat(removeCommas(data.AA)) -
      parseFloat(removeCommas(GET_TOTAL_AMOUNT));
    setRemaining(value);
  }

  function BankList() {
    let container = [];
    getBank?.map((x) => {
      if (x.paymentType === getData.PaymentType) {
        container.push(x);
      }
    });
    return container;
  }

  function GetBankCode(container) {
    const BankCode = getBank.find(
      (x) => x.code === container || x.description === container
    );
    return BankCode.code;
  }

  function GetPurposeCode(container) {
    const PurposeCode = getPurpose.find(
      (x) => x.code === container || x.description === container
    );
    return PurposeCode.code;
  }

  function formatNumberWithCommas(num) {
    if (!num) return "";
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return parts.join(".");
  }

  function removeCommas(num) {
    if (!num) return "";
    return num.replace(/,/g, "");
  }

  function truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  }

  function onChangeAmount(e) {
    let num = e.target.value.replace(/[^0-9.]/g, "");
    if (e.target.value === ".") {
      num = "";
    } else {
      num = e.target.value.replace(/[^0-9.]/g, "");
    }
    const periodCount = num.split(".").length - 1;
    if (periodCount > 1) {
      num = num.slice(0, -1);
    }
    if (
      getData.PaymentType === "PESONET" &&
      parseFloat(num) >= parseFloat(getRemaining)
    ) {
      setData({
        ...getData,
        Amount: formatNumberWithCommas(getRemaining.toString()),
      });
    } else if (
      getData.PaymentType === "INSTAPAY" &&
      parseFloat(num) >= parseFloat(getRemaining)
    ) {
      if (parseFloat(getRemaining) >= 50000) {
        setData({ ...getData, Amount: formatNumberWithCommas("50000.00") });
      } else {
        setData({
          ...getData,
          Amount: formatNumberWithCommas(getRemaining.toString()),
        });
      }
    } else if (getData.PaymentType === "INSTAPAY" && parseFloat(num) >= 50000) {
      setData({ ...getData, Amount: formatNumberWithCommas("50000.00") });
    } else {
      setData({ ...getData, Amount: formatNumberWithCommas(num.toString()) });
    }
  }

  function onBlurAmount(e) {
    if (e.target.value !== "") {
      let num = e.target.value.replace(/[^0-9.]/g, "");
      const periodCount = num.split(".").length - 1;
      if (periodCount > 1) {
        num = num.slice(0, -1);
      }

      let CommaFormat = formatNumberWithCommas(
        truncateToDecimals(num).toString()
      );
      setData({ ...getData, Amount: CommaFormat });
    } else {
      setData({ ...getData, Amount: "" });
    }
  }

  const token = localStorage.getItem("UTK");
  async function AddNP() {
    const container = {
      PaymentType: getData.PaymentType,
      FirstName: getData.FirstName,
      LastName: getData.LastName,
      BankName: GetBankCode(getData.BankName),
      BankAcctNo: getData.BankAcctNo,
      Amount: truncateToDecimals(removeCommas(getData.Amount)),
      Type: getData.Type,
      Purpose: GetPurposeCode(getData.Purpose),
      Status: getData.Status,
      TraceId: "CKT" + data.LAN.props.children,
      RecUser: jwtDecode(token).USRID,
      Lan: data.LAN.props.children,
    };

    await axios
      .post("/v1/POST/P122AD", container)
      .then((result) => {
        queryClient.invalidateQueries(
          { queryKey: ["DisbursementListQuery", data.LAN.props.children] },
          { exact: true }
        );
        SET_REFRESH_LAN(1);
        queryClient.invalidateQueries(
          { queryKey: ["PRELOAD_DISBURSEMENT", data.LAN.props.children] },
          { exact: true }
        );
        api[result.data.status]({
          message: result.data.message,
          description: result.data.description,
        });
        setData({
          ...getData,
          PaymentType: "",
          FirstName: "",
          LastName: "",
          BankName: "",
          BankAcctNo: "",
          Amount: "0.00",
          Type: "NP",
          Purpose: "",
          Status: "AVAILABLE",
        });
      })
      .catch((error) => {
        api["error"]({
          message: "Something went wrong",
          description: error.message,
        });
      });
  }

  return (
    <div className="h-[10rem]">
      {contextHolder}
      <div className="flex flex-row">
        <div className="w-[29rem]">
          <Space>
            <div className="w-[15rem]">
              <Radio.Group
                disabled={
                  formatNumberWithCommas(
                    truncateToDecimals(getRemaining).toString()
                  ).toString() === "0.00"
                }
                onChange={(e) => {
                  setData({ ...getData, PaymentType: e.target.value });
                  if (
                    truncateToDecimals(removeCommas(getData.Amount)) >= 50000 &&
                    e.target.value === "INSTAPAY"
                  ) {
                    setData({
                      ...getData,
                      PaymentType: e.target.value,
                      Amount: "50,000.00",
                    });
                  } else {
                    setData({ ...getData, PaymentType: e.target.value });
                  }
                }}
                value={getData.PaymentType}
              >
                <Radio value={"INSTAPAY"}>
                  <span className="font-bold">INSTAPAY</span>
                </Radio>
                <Radio value={"PESONET"}>
                  <span className="font-bold">PESONET</span>
                </Radio>
              </Radio.Group>
            </div>
            <div className="w-[15rem]">
              <div className="font-bold">
                Remaining to Disburse:{" "}
                {formatNumberWithCommas(
                  parseFloat(getRemaining).toFixed(2).toString()
                )}
              </div>
            </div>
          </Space>
          <Space>
            <div>
              <div className="w-[15rem]">Recipient Name</div>
              <div className="w-[15rem]">
                {/* <Input
                  className="w-full"
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  value={getData.FirstName}
                  onChange={(e) => {
                    setData({ ...getData, FirstName: e.target.value });
                  }}
                /> */}
                <Select
                  className="w-full"
                  placeholder={
                    GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name)
                      ? "Please wait..." 
                      : "Select borrower"
                  }
                  loading={GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name)}
                  disabled={GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name)}
                  style={{
                    color: GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name) ? "gray" : "black",
                  }}
                  options={NameList(getAppDetails)?.map((x) => ({
                    key: `${x.name || ""}-${x.emoji || ""}-${x.desc || ""}`,
                    value: x.name,
                    label: x.name,
                    emoji: x.emoji,
                    desc: x.desc,
                  })) || []}
                  onChange={(value) => {
                    const selectedOption = nameListOptions.find(
                      (item) => item.name === value
                    );
                    if (selectedOption) {
                      const { firstName, lastName, Suffix } =
                        selectedOption.values;

                      setData((prevState) => ({
                        ...prevState,
                        FirstName: firstName || "",
                        LastName: lastName || "",
                        Suffix: Suffix || "N/A",
                      }));
                    }
                    console.log("Updated getData:", getData);
                  }}
                  optionRender={(option) => (
                    <Space>
                      <span className="font-bold text-green-600">
                        {option.data.emoji}
                      </span>
                      <span className="font-semibold">{option.data.value}</span>
                      <span className="font-thin text-xs">
                        {option.data.desc}
                      </span>
                    </Space>
                  )}
                />
              </div>
            </div>
            {/* <div>
              <div className="w-[15rem]">Recipient Last Name</div>
              <div className="w-[15rem]">
                <Input
                  className="w-full"
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  value={getData.LastName}
                  onChange={(e) => {
                    setData({ ...getData, LastName: e.target.value });
                  }}
                />
              </div>
            </div> */}
          </Space>
          <Space>
            <div>
              <div className="w-[15rem]">Bank Name</div>
              <div className="w-[15rem]">
                <Select
                  className="w-full"
                  value={getData.BankName || undefined}
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  options={BankList().map((x) => ({
                    label: x.description,
                    value: x.description,
                    emoji: x.code,
                    desc: x.description,
                  }))}
                  onChange={(e) => {
                    setData({ ...getData, BankName: e });
                  }}
                />
              </div>
            </div>
            <div>
              <div className="w-[15rem]">Bank Account Number</div>
              <div className="w-[15rem]">
                <Input
                  className="w-full"
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  value={getData.BankAcctNo}
                  onChange={(e) => {
                    setData({ ...getData, BankAcctNo: e.target.value });
                  }}
                />
              </div>
            </div>
          </Space>
          <Space>
            <div>
              <div className="w-[15rem]">Purpose</div>
              <div className="w-[15rem]">
                <Select
                  className="w-full"
                  value={getData.Purpose || undefined}
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  options={getPurpose?.map((x) => ({
                    label: x.description,
                    value: x.description,
                  }))}
                  onChange={(e) => {
                    setData({ ...getData, Purpose: e });
                  }}
                />
              </div>
            </div>
            <Space>
              <div>
                <div className="w-[10.6rem]">Amount to Credit</div>
                <div className="w-[10.6rem]">
                  <Input
                    className="w-full"
                    disabled={
                      !getData.PaymentType ||
                      formatNumberWithCommas(
                        parseFloat(getRemaining).toFixed(2).toString()
                      ).toString() === "0.00"
                    }
                    value={getData.Amount}
                    onBlur={(e) => {
                      onBlurAmount(e);
                    }}
                    onChange={(e) => {
                      onChangeAmount(e);
                    }}
                  />
                </div>
              </div>
              <Button
                disabled={
                  !getData.FirstName ||
                  !getData.LastName ||
                  !getData.BankName ||
                  !getData.BankAcctNo ||
                  getData.Amount === "0.00" ||
                  !getData.Purpose ||
                  formatNumberWithCommas(
                    parseFloat(getRemaining).toFixed(2).toString()
                  ).toString() === "0.00"
                }
                className="mt-[1.6em]"
                type="primary"
                onClick={() => {
                  AddNP();
                }}
              >
                Save
              </Button>
            </Space>
          </Space>
        </div>
        <div className="px-1 w-[70%]">
          <DisbursementList
            LAN={data.LAN.props.children}
            type={"NP"}
            bankList={getBank}
            DisburseAmount={data.AA}
          />
        </div>
      </div>
    </div>
  );
}

export default NetProceeds;
