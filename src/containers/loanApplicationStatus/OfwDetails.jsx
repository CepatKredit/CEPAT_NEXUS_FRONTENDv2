import * as React from "react";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import LabeledInput from "@components/trackApplication/LabeledInput";
import LabeledSelect from "@components/trackApplication/LabeledSelect";
import LabeledInput_Salary from "@components/trackApplication/LabeledInput_Salary";
import LabeledSelect_Country from "@components/trackApplication/LabeledSelect_Country";
import DatePicker_BDate from "@components/trackApplication/DatePicker_BDate";
import AddressGroup_Component from "@components/trackApplication/AddressGroup_Component";
import SectionHeader from "@components/validation/SectionHeader";
import LabeledInput_Contact from "@components/trackApplication/LabeledInput_Contact";
import LabeledInput_Fullname from "@components/trackApplication/LabeledInput_UpperCase";
import LabeledInput_Numeric from "@components/trackApplication/LabeledInput_Numeric";
import LabeledSelect_Suffix from "@components/trackApplication/LabeledSelect_Suffix";
import LabeledSelect_ValidId from "@components/trackApplication/LabeledSelect_ValidId";
import LabeledCurrencyInput from "@components/trackApplication/LabeledCurrencyInput";
import { Suffix, MaritalStatus, Residences, Gender } from "@utils/FixedData";
import LabeledInput_Email from "@components/trackApplication/LabeledInput_Email";
import { Descriptions, Button, notification } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GET_LIST,
  GetBranchCode,
  GetPurposeId,
  POST_DATA,
} from "@api/base-api/BaseApi";
import axios from "axios";
import { mmddyy, ReturnText } from "@utils/Converter";
import { UpdateLoanDetails } from "@utils/LoanDetails";
import LabeledInput_OfwContact from "@components/trackApplication/LabeledInput_OfwContact";
import LabeledInput_NotRequired from "@components/trackApplication/LabeledInput_NotRequired";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function OfwDetails({ data, receive, presaddress, OldData }) {
  const { updateAppDetails, getAppDetails, getOldData, api } = React.useContext(
    LoanApplicationContext
  );
  const [isEdit, setEdit] = React.useState(false);
//   const [api, contextHolder] = notification.useNotification();

  const { data: suffixOption } = useQuery({
    queryKey: ["getSuffix"],
    queryFn: async () => {
      const result = await GET_LIST("/OFWDetails/GetSuffix");
      return result.list;
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });

  const getCountrySelect = useQuery({
    queryKey: ["getCountrySelect"],
    queryFn: async () => {
      const result = await GET_LIST("/OFWDetails/getCountry");
      return (
        result?.list?.map((x) => ({ value: x.code, label: x.description })) ||
        []
      );
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });

  const validIdDisplay = useQuery({
    queryKey: ["validIdDisplay"],
    queryFn: async () => {
      const result = await GET_LIST("/OFWDetails/getIDtype");
      return result.list;
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });

  React.useEffect(() => {
    validIdDisplay.refetch();
    getCountrySelect.refetch();
  }, [getAppDetails]);

  function formatNumberWithCommas(num) {
    if (!num) return "";
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return parts.join(".");
  }
  function formatToTwoDecimalPlaces(num) {
    if (!num) return "";
    return parseFloat(num).toFixed(2);
  }

  const items = [
    {
      key: "1",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          First Name
        </span>
      ),
      children: getAppDetails.ofwfname || "",
    },
    {
      key: "2",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Middle Name
        </span>
      ),
      children: getAppDetails.ofwmname || "",
    },
    {
      key: "3",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Last Name
        </span>
      ),
      children: getAppDetails.ofwlname || "",
    },
    {
      key: "4",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Suffix
        </span>
      ),
      children:
        suffixOption?.find((suffix) => suffix.code === getAppDetails.ofwsuffix)
          ?.description || "",
    },
    {
      key: "5",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Birthdate
        </span>
      ),
      children: getAppDetails.ofwbdate || "",
    },
    {
      key: "6",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Gender
        </span>
      ),
      children:
        Gender().find((gender) => gender.value === getAppDetails.ofwgender)?.label || "",
    },
    {
      key: "7",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Mobile Number
        </span>
      ),
      children: getAppDetails?.ofwmobile.replace("/", " ") || "",
    },
    {
      key: "8",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Email Address
        </span>
      ),
      children: getAppDetails.ofwemail || "",
    },
    {
      key: "9",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Dependents
        </span>
      ),
      children: getAppDetails.ofwdependents || "0",
    },
    {
      key: "10",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Marital Status
        </span>
      ),
      children:
        MaritalStatus().find((status) => status.value === getAppDetails.ofwmstatus)
          ?.label || "",
    },
    {
      key: "11",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Valid ID Type
        </span>
      ),
      children:
        validIdDisplay.data?.find(
          (x) => x.id === getAppDetails.ofwvalidid || x.name === getAppDetails.ofwvalidid
        )?.name || "",
    },
    {
      key: "12",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          ID Number
        </span>
      ),
      children: getAppDetails.ofwidnumber || "",
    },
    {
      key: "13",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Type Of Residences
        </span>
      ),
      children:
        Residences().find((residence) => residence.value === getAppDetails.ofwresidences)
          ?.label || "",
    },
    ...(getAppDetails.ofwresidences === 3
      ? [
          {
            key: "14",
            label: (
              <span className="font-semibold text-black whitespace-nowrap">
                Rent Amount
              </span>
            ),
            children: (
              <p>
                {getAppDetails.ofwrent
                  ? formatNumberWithCommas(
                      formatToTwoDecimalPlaces(getAppDetails.ofwrent)
                    )
                  : ""}
              </p>
            ),
          },
        ]
      : getAppDetails.ofwresidences === 2
      ? [
          {
            key: "14",
            label: (
              <span className="font-semibold text-black whitespace-nowrap">
                Monthly Amortization
              </span>
            ),
            children: (
              <p>
                {getAppDetails.ofwrent
                  ? formatNumberWithCommas(
                      formatToTwoDecimalPlaces(getAppDetails.ofwrent)
                    )
                  : ""}
              </p>
            ),
          },
        ]
      : []),
    {
      key: "15",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Present Area/Province
        </span>
      ),
      children: <p>{getAppDetails.ofwPresProvname || ""}</p>,
    },
    {
      key: "16",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Present City/Municipality
        </span>
      ),
      children: <p>{getAppDetails.ofwPresMunicipalityname || ""}</p>,
    },
    {
      key: "17",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Present Barangay
        </span>
      ),
      children: <p>{getAppDetails.ofwPresBarangayname || ""}</p>,
    },
    {
      key: "18",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Present Street
        </span>
      ),
      children: <p>{ReturnText(getAppDetails.ofwPresStreet) || ""}</p>,
    },
    {
      key: "19",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Permanent Area/Province
        </span>
      ),
      children: <p>{getAppDetails.ofwPermProvname || ""}</p>,
    },
    {
      key: "20",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Permanent City/Municipality
        </span>
      ),
      children: getAppDetails.ofwPermMunicipalityname || "",
    },
    {
      key: "21",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Permanent Barangay
        </span>
      ),
      children: getAppDetails.ofwPermBarangayname || "",
    },
    {
      key: "22",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Permanent Street
        </span>
      ),
      children: ReturnText(getAppDetails.ofwPermStreet) || "",
    },
    {
      key: "23",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Country of Employment
        </span>
      ),
      children:
        getCountrySelect.data?.find(
          (country) =>
            country.value === getAppDetails.ofwcountry ||
            country.label === getAppDetails.ofwcountry
        )?.label || "",
    },
    {
      key: "24",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Job Title / Position
        </span>
      ),
      children: getAppDetails.ofwjobtitle || "",
    },
    {
      key: "25",
      label: (
        <span className="font-semibold text-black w-[8rem]">
          Company/Employer /AgencyName
        </span>
      ),
      children: getAppDetails.ofwcompany || "",
    },
    {
      key: "26",
      label: (
        <span className="font-semibold text-black whitespace-nowrap">
          Salary
        </span>
      ),
      children: getAppDetails.ofwsalary
        ? formatNumberWithCommas(formatToTwoDecimalPlaces(getAppDetails.ofwsalary))
        : "",
    },
  ];

  const queryClient = useQueryClient();
  async function updateData() {
    let update = 0;
    if (
      getOldData.FirstName !== getAppDetails.ofwfname ||
      getOldData.LastName !== getAppDetails.ofwlname ||
      parseInt(getOldData.Suffix) !== parseInt(getAppDetails.ofwsuffix) ||
      getOldData.Birthday !== getAppDetails.ofwbdate
    ) {
      update = 1;
    } else {
      update = 0;
    }

    if (update === 1) {
      const checkLoan = {
        FirstName: getAppDetails.ofwfname,
        LastName: getAppDetails.ofwlname,
        Suffix: parseInt(getAppDetails.ofwsuffix),
        Birthday: getAppDetails.ofwbdate,
      };

      var result = await POST_DATA("/checkLoan", checkLoan);
      if (result.list.length === 0) {
        update = 0;
      } else {
        update = 2;
      }
    }

    if (update === 0) {
      const value = {
        LoanAppId: getAppDetails.loanIdCode,
        Tab: 2,
        BorrowersCode: getAppDetails.borrowersCode,
        Product: getAppDetails.loanProd,
        BranchId: parseInt(getAppDetails.loanBranch),
        DepartureDate: mmddyy(getAppDetails.loanDateDep),
        Purpose: getAppDetails.loanPurpose,
        //LoanType: 1,
        Amount: parseFloat(getAppDetails.loanAmount.replaceAll(",", "")),
        Terms: getAppDetails.loanTerms,
        Channel: getAppDetails.hckfi,
        Consultant: getAppDetails.consultant,
        ConsultantNo: getAppDetails.consultNumber,
        ConsultantProfile: getAppDetails.consultProfile,
        ReferredBy: getAppDetails.referredby ? parseInt(getAppDetails.referredby) : 0,
        FirstName: getAppDetails.ofwfname,
        MiddleName: getAppDetails.ofwmname,
        LastName: getAppDetails.ofwlname,
        Suffix: getAppDetails.ofwsuffix,
        BirthDay: getAppDetails.ofwbdate,
        Gender: getAppDetails.ofwgender,
        CivilStatus: getAppDetails.ofwmstatus,
        Dependent: getAppDetails.ofwdependents,
        Email: getAppDetails.ofwemail,
        MobileNo: getAppDetails.ofwmobile,
        FBProfile: getAppDetails.ofwfblink,
        Ownership: getAppDetails.ofwresidences,
        RentAmount: parseFloat(getAppDetails.ofwrent.replaceAll(",", "")),
        IsCurrPerm: getAppDetails.ofwsameAddress,
        ProvinceId: getAppDetails.ofwPresProv,
        MunicipalityId: getAppDetails.ofwPresMunicipality,
        BarangayId: getAppDetails.ofwPresBarangay,
        Address1: getAppDetails.ofwPresStreet,
        PerProvinceId: getAppDetails.ofwPermProv,
        PerMunicipalityId: getAppDetails.ofwPermMunicipality,
        PerBarangayId: getAppDetails.ofwPermBarangay,
        PerAddress1: getAppDetails.ofwPermStreet,
        ValidId: getAppDetails.ofwvalidid,
        ValidIdNo: getAppDetails.ofwidnumber,
        Country: getAppDetails.ofwcountry,
        JobTitle: getAppDetails.ofwjobtitle,
        Employer: getAppDetails.ofwcompany,
        Salary: parseFloat(getAppDetails.ofwsalary.replaceAll(",", "")),
        ModUser: getAppDetails.borrowersCode,
      };
      console.log("testtset", value);
      let result = await UpdateLoanDetails(value);
      if (result.data.status === "success") {
        api[result.data.status]({
          message: result.data.message,
          description: result.data.description,
        });
        queryClient.invalidateQueries(
          { queryKey: ["ClientDataQuery"] },
          { exact: true }
        );
        setEdit(!isEdit);
      } else {
        api["warning"]({
          message: "Error: Failed to Update",
          description: "Fail Connection",
        });
      }
    } else {
      api["info"]({
        message: "Loan Already Exists",
        description: `Please be advised that you have an ongoing application with Cepat Kredit ${result.list[0].branch} branch with Loan Application No. 
                ${result.list[0].loanAppCode}. For further concerns, please email our Customer Service Department at customerservice@cepatkredit.com. Thank you!`,
      });
    }
  }

  return (
    <>
      {/* {contextHolder} */}
      {isEdit ? (
        <div className="h-full ">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
              <LabeledInput_Fullname
                className_dmain="w-full h-[3.5rem]"
                className_label="font-bold"
                label="First Name"
                value={getAppDetails.ofwfname}
                placeHolder="First Name"
                fieldName={"ofwfname"}
                // receive={(e) => receive({ name: "ofwfname", value: e })}
                category="marketing"
              />
              <LabeledInput_NotRequired
                className_dmain="w-full h-[3.5rem]"
                className_label="font-bold"
                label="Middle Name"
                value={getAppDetails.ofwmname}
                fieldName="ofwmname"
                placeHolder="Middle Name"
                // receive={(e) => receive({ name: "ofwmname", value: e })}
                category="marketing"
              />
              <LabeledInput_Fullname
                className_dmain="w-full h-[3.5rem]"
                className_label="font-bold"
                label="Last Name"
                value={getAppDetails.ofwlname}
                fieldName={"ofwlname"}
                placeHolder="Last Name"
                // receive={(e) => receive({ name: "ofwlname", value: e })}
                category="marketing"
              />
              <LabeledSelect_Suffix
                className_dmain="w-full h-[3.5rem]"
                className_label="font-bold"
                label="Suffix"
                placeHolder="Please Select"
                value={getAppDetails.ofwsuffix}
                fieldName={"ofwsuffix"}
                // receive={(e) => receive({ name: "ofwsuffix", value: e })}
                category="marketing"
              />
              <DatePicker_BDate
                className_dmain="w-full h-[3.5rem] mt-3"
                className_label="font-bold"
                label="Birthdate"
                placeHolder="Birthdate"
                // receive={(e) => receive({ name: "ofwbdate", value: e })}
                fieldName={"ofwbdate"}
                value={getAppDetails.ofwbdate}
                category="marketing"
              />
              <LabeledSelect
                className_dmain="w-full h-[3.5rem] mt-3"
                className_label="font-bold"
                label="Gender"
                placeHolder="Please Select"
                value={getAppDetails.ofwgender}
                fieldName={"ofwgender"}
                data={Gender()}
                // receive={(e) => receive({ name: "ofwgender", value: e })}
                category="marketing"
              />
              <LabeledInput_OfwContact
                className_dmain="w-full h-[3.5rem] mt-3"
                className_label="font-bold"
                label="Mobile Number"
                placeHolder="Mobile Number"
                value={getAppDetails.ofwmobile}
                fieldName={"ofwmobile"}
                // receive={(e) => receive({ name: "ofwmobile", value: e })}
                category="marketing"
              />
              <LabeledInput_Email
                className_dmain="w-full h-[3.5rem] mt-3"
                className_label="font-bold"
                label="Email Address"
                placeHolder="Email Address"
                value={getAppDetails.ofwemail}
                fieldName={"ofwemail"}
                // receive={(e) => receive({ name: "ofwemail", value: e })}
                category="marketing"
              />
              <LabeledInput_Numeric
                className_dmain="w-full h-[3.5rem] mt-5"
                className_label="font-bold"
                className_dsub=""
                label="Dependents"
                value={getAppDetails.ofwdependents}
                // receive={(e) => receive({ name: "ofwdependents", value: e })}
                fieldName={"ofwdependents"}
                category="marketing"
                digits={2}
                placeHolder="No. of Dependents"
              />
              <LabeledSelect
                className_dmain="w-full h-[3.5rem] mt-5"
                className_label="font-bold"
                label="Marital Status"
                placeHolder="Marital Status"
                value={getAppDetails.ofwmstatus}
                fieldName={"ofwmstatus"}
                data={MaritalStatus()}
                // receive={(e) => receive({ name: "ofwmstatus", value: e })}
                category="marketing"
              />
              <LabeledSelect
                className_dmain="w-full h-[3.5rem] mt-5"
                className_label={"font-bold"}
                label={"Type of Residences"}
                placeHolder="Type of Residences"
                value={getAppDetails.ofwresidences}
                fieldName={"ofwresidences"}
                // receive={(e) => receive({ name: "ofwresidences", value: e })}
                data={Residences()}
                category={"marketing"}
              />
              {getAppDetails.ofwresidences === 3 || getAppDetails.ofwresidences === 2 ? (
                <LabeledCurrencyInput
                  className_dmain={"mt-5 w-[300px] h-[62px]"}
                  className_label={"font-bold"}
                  label={
                    getAppDetails.ofwresidences === 3
                      ? "Rent Amount"
                      : "Monthly Amortization"
                  }
                  value={getAppDetails.ofwrent}
                  fieldName="ofwrent"
                //   receive={(e) => {
                //     receive({ name: "ofwrent", value: e });
                //   }}
                  category={"marketing"}
                  placeHolder={
                    getAppDetails.ofwresidences === 3
                      ? "Rent Amount"
                      : "Monthly Amortization"
                  }
                />
              ) : null}
            </div>
            <SectionHeader title="Present Address" />
            <AddressGroup_Component
              data={data}
              // receive={(e) => receive(e)}
              // presaddress={(e) => presaddress(e)}
              type="present"
              disabled={!isEdit}
              className_dsub="w-full h-[3.5rem]"
              category="marketing"
              className_dmain="mt-[1.25rem] w-full h-[3.875rem] sm:w-[12rem] md:w-[14rem] lg:w-[15rem] xl:w-[16rem]"
              className_label="font-bold"
              vertical_algin={true}
            />

            <SectionHeader title="Permanent Address" />
            <AddressGroup_Component
              data={getAppDetails}
              // receive={(e) => receive(e)}
              // presaddress={(e) => presaddress(e)}
              type="permanent"
              disabled={!isEdit}
              className_dsub="w-full h-[3.5rem]"
              category="marketing"
              className_dmain="mt-[1.25rem] w-full h-[3.875rem] sm:w-[12rem] md:w-[14rem] lg:w-[15rem] xl:w-[16rem]"
              className_label="font-bold"
              vertical_algin={true}
            />
            {/* <SectionHeader title="Provincial Address" />
                            <AddressGroup_Component
                                data={data}
                                receive={(e) => receive(e)}
                                presaddress={(e) => presaddress(e)}
                                type="provincial"
                                disabled={isEdit}
                                category="marketing"
                                className_dmain="w-full h-[3.5rem]"
                                className_label="font-bold"
                                vertical_algin={true}
                            />*/}
            <SectionHeader title="Presented ID" />
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[80%] lg:w-[50%]">
                <LabeledSelect_ValidId
                  className_dmain="w-full h-[3.5rem]"
                  className_label="font-bold"
                  label="Valid ID Type"
                  placeHolder="Valid ID Type"
                  value={getAppDetails.ofwvalidid}
                  fieldName={"ofwvalidid"}
                  // receive={(e) => receive({ name: "ofwvalidid", value: e })}
                  category="marketing"
                  required={false}
                />
                <LabeledInput
                  className_dmain="w-full h-[3.5rem]"
                  className_label="font-bold"
                  label="ID Number"
                  placeHolder="ID Type Number"
                  // receive={(e) => receive({ name: "ofwidnumber", value: e })}
                  value={getAppDetails.ofwidnumber}
                  fieldName={"ofwidnumber"}
                  category="marketing"
                  required={false}
                />
              </div>
            </div>
            {/* Employment Details Section */}
            <SectionHeader title="Employment Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <LabeledSelect_Country
                className_dmain="w-full h-[3rem]"
                className_label="font-bold text-xs leading-tight"
                label="Country of Employment for OFW or Joining Port for SEAFARER"
                placeHolder="Country"
                category="marketing"
                value={getAppDetails.ofwcountry}
                // receive={(e) => receive({ name: "ofwcountry", value: e })}
                fieldName={"ofwcountry"}
              />
              <LabeledInput
                className_dmain="w-full h-[3rem] mt-6"
                className_label="font-bold"
                label="Job Title / Position"
                category="direct"
                value={getAppDetails.ofwjobtitle}
                fieldName={"ofwjobtitle"}
                // receive={(e) => {
                //   receive({
                //     name: "ofwjobtitle",
                //     value: e,
                //   });
                // }}
                disabled={
                  (getAppDetails.loanProd === "0303-DH" ||
                    getAppDetails.loanProd === "0303-DHW") &&
                  getAppDetails.ofwjobtitle === "DOMESTIC HELPER"
                }
                placeHolder="Job Title/Position"
              />
              <LabeledInput
                className_dmain="w-full h-[3rem] mt-6"
                className_label="font-bold text-xs leading-tight"
                label="Company/ Employer / Agency Name"
                placeHolder="Company/ Employer / Agency Name"
                category="marketing"
                value={getAppDetails.ofwcompany}
                fieldName={"ofwcompany"}
                // receive={(e) => receive({ name: "ofwcompany", value: e })}
              />
              <LabeledInput_Salary
                className_dmain="w-full h-[3rem] mt-6"
                className_label="font-bold"
                label="Salary"
                placeHolder="Salary"
                value={getAppDetails.ofwsalary}
                fieldName={"ofwsalary"}
                // receive={(e) => receive({ name: "ofwsalary", value: e })}
                category="direct"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <Descriptions
            className="mt-5"
            column={{ md: 2, lg: 3, xl: 4 }}
            items={items}
          />
        </>
      )}
      {getAppDetails.loanStatus === "RECEIVED" && (
        <div className="flex justify-center space-x-10 mb-2 mt-6">
          {isEdit ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => {
                  updateData();
                }}
              >
                Save
              </Button>

              <Button
                type="default"
                onClick={() => {
                  setEdit(!isEdit);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setEdit(!isEdit);
              }}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default OfwDetails;
