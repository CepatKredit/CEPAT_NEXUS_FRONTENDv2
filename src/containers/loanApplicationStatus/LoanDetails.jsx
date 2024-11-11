import * as React from "react";
import { Descriptions, Button, notification } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import LabeledSelectLoanProduct from "@components/trackApplication/LabeledSelectLoanProduct";
import LabeledCurrencyInput from "@components/trackApplication/LabeledCurrencyInput";
import LabeledInput_Numeric from "@components/trackApplication/LabeledInput_Numeric";
import LabeledSelectLoanPurpose from "@components/trackApplication/LabeledSelectLoanPurpose";
import LabeledSelect_Branch from "@components/trackApplication/LabeledSelect_Branch";
import DatePicker_Deployment from "@components/trackApplication/DatePicker_Deployment";
import LabeledSelect from "@components/trackApplication/LabeledSelect";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_LIST, GetLoanPurpose, POST_DATA } from "@api/base-api/BaseApi";
import dayjs from "dayjs";
import { loanterm } from "@utils/FixedData";
import { UpdateLoanDetails } from "@utils/LoanDetails";
import { mmddyy } from "@utils/Converter";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { isValidLoanDetails } from "@utils/Validations";

function LoanDetails({ /*data*/ receive, loancases }) {
  const [isEdit, setEdit] = React.useState(false);
  // const [api, contextHolder] = notification.useNotification();
  const { api, getAppDetails } = React.useContext(LoanApplicationContext);
  const fieldsRef = React.useRef({});

  // const loanValidation = !isValidLoanDetails(getAppDetails) ||
  // ([15, 6].includes(getAppDetails.hckfi) && !getAppDetails.loanBranch);

  const validateFields = () => {
    let isValid = true;

    // Validate each field that is required and show errors for empty ones
    const requiredFields = [
      { key: "loanProd", value: getAppDetails.loanProd },
      { key: "loanPurpose", value: getAppDetails.loanPurpose },
      { key: "loanAmount", value: getAppDetails.loanAmount },
      { key: "loanTerms", value: getAppDetails.loanTerms },
      {
        key: "loanBranch",
        value: getAppDetails.loanBranch,
        condition: [15, 6].includes(getAppDetails.hckfi),
      },
      {
        key: "loanDateDep",
        value: getAppDetails.loanDateDep,
        condition: ["0303-DHW", "0303-VL", "0303-WL"].includes(
          getAppDetails.loanProd
        ),
      },
      {
        key: "consultName",
        value: getAppDetails.consultName,
        condition: getAppDetails.hckfi === 10,
      },
      {
        key: "consultNumber",
        value: getAppDetails.consultNumber,
        condition: getAppDetails.hckfi === 10,
      },
      {
        key: "loanReferredBy",
        value: getAppDetails.loanReferredBy,
        condition: getAppDetails.hckfi === 14,
      },
    ];

    requiredFields.forEach(({ key, value, condition = true }) => {
      if (!value && condition) {
        fieldsRef.current[key]?.setErrorStatus(true);
        if (isValid) {
          fieldsRef.current[key]?.focus();
        }
        isValid = false;
      }
    });

    return isValid && isValidLoanDetails(getAppDetails); 
  };

  const disableDate_deployment = React.useCallback((current) => {
    // Disable past dates including today
    return current && current < dayjs().startOf("day");
  }, []);

  const loanProducts = useQuery({
    queryKey: ["getProductSelect"],
    queryFn: async () => {
      const result = await GET_LIST("/getListLoanProduct");
      console.log(result.list);
      return result.list;
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });

  const loanPurpose = useQuery({
    queryKey: ["LoanPurposeQuery"],
    queryFn: async () => {
      const result = await GET_LIST("/getLoanPurpose");
      return result.list;
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });

  const items = [
    {
      key: "1",
      label: <span className="font-semibold text-black">Loan Product</span>,
      children:
        loanProducts.data?.find((x) => x.code === getAppDetails.loanProd)
          ?.description || "",
    },
    ...(getAppDetails.loanDateDep &&
    ["0303-DHW", "0303-VL", "0303-WL"].includes(getAppDetails.loanProd)
      ? [
          {
            key: "2",
            label: (
              <span className="font-semibold text-black">
                OFW Departure Date
              </span>
            ),
            children: mmddyy(getAppDetails.loanDateDep) || "",
          },
        ]
      : []),
    {
      key: "3",
      label: <span className="font-semibold text-black">Loan Purpose</span>,
      children:
        loanPurpose.data?.find(
          (x) =>
            x.id === getAppDetails.loanPurpose ||
            x.purpose === getAppDetails.loanPurpose
        )?.purpose || "",
    },
    {
      key: "4",
      label: <span className="font-semibold text-black">Branch</span>,
      children: getAppDetails.loanBranch || "",
    },
  ];
  const loan = [
    {
      key: "spacer1",
      children: "",
    },
    {
      key: "5",
      label: <span className="font-semibold text-black">Loan Amount</span>,
      children: getAppDetails.loanAmount
        ? formatNumberWithCommas(
            formatToTwoDecimalPlaces(
              getAppDetails.loanAmount.replaceAll(",", "")
            )
          )
        : "",
    },
    {
      key: "6",
      label: (
        <span className="font-semibold text-black">Approved Loan Amount</span>
      ),
      children: getAppDetails.ApprvAmount
        ? formatNumberWithCommas(
            formatToTwoDecimalPlaces(
              String(getAppDetails.ApprvAmount).replaceAll(",", "")
            )
          )
        : "",
    },
    {
      key: "spacer2",
      children: "",
    },
    {
      key: "spacer3",
      children: "",
    },
    {
      key: "7",
      label: (
        <span className="font-semibold text-black">Loan Terms (Months)</span>
      ),
      children: getAppDetails.loanTerms || "",
    },
    {
      key: "8",
      label: (
        <span className="font-semibold text-black">
          Approved Loan Terms (Months)
        </span>
      ),
      children: getAppDetails.ApprvTerms ? getAppDetails.ApprvTerms : "",
    },
  ];

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

  const queryClient = useQueryClient();

  async function updateData() {
    if (!validateFields()) {
      return;
    }

    const value = {
      LoanAppId: getAppDetails.loanIdCode,
      Tab: 1,
      BorrowersCode: getAppDetails.borrowersCode,
      Product: getAppDetails.loanProd,
      DepartureDate: getAppDetails.loanDateDep
        ? mmddyy(getAppDetails.loanDateDep)
        : "",
      Purpose: getAppDetails.loanPurpose,
      BranchId: parseInt(getAppDetails.loanBranch),
      Amount: parseFloat(
        getAppDetails.loanAmount.toString().replaceAll(",", "")
      ),
      Channel: getAppDetails.hckfi,
      Terms: getAppDetails.loanTerms,
      Consultant: getAppDetails.consultant,
      ConsultantNo: getAppDetails.consultNumber,
      ConsultantProfile: getAppDetails.consultProfile,
      ModUser: getAppDetails.borrowersCode,
    };
    const value2 = {
      LoanAppId: getAppDetails.loanIdCode,
      Tab: 2,
      BorrowersCode: getAppDetails.borrowersCode,
      JobTitle: getAppDetails.ofwjobtitle || "",
    };
    console.log("testtset", value);
    const [resLoan, resOFW] = await Promise.all([
      UpdateLoanDetails(value),
      UpdateLoanDetails(value2),
    ]);
    if (resLoan.data.status === "success" && resOFW.data.status === "success") {
      api[resLoan.data.status]({
        message: resLoan.data.message,
        description: resLoan.data.description,
      });
    } else {
      api[resLoan.data.status]({
        message: resLoan.data.message,
        description: resLoan.data.description,
      });
    }
    queryClient.invalidateQueries(
      { queryKey: ["ClientDataQuery"] },
      { exact: true }
    );
    setEdit(!isEdit);

    //queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
  }

  const toggleEditMode = () => {
    setEdit(!isEdit);
  };

  return (
    <div className="h-full relative">
      {/* {contextHolder} */}
      {/* Read-only View */}
      {!isEdit && (
        <>
          <Descriptions
            className="mt-6"
            size="small"
            column={{ md: 2, lg: 3, xl: 4 }}
            items={items}
          />
          <Descriptions
            className="mt-6"
            size="small"
            column={{ md: 2, lg: 3, xl: 4 }}
            items={loan}
          />
        </>
      )}

      {/* Editable Form View */}
      {isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4">
          <LabeledSelectLoanProduct
            className_dmain="w-full h-[3rem] mt-4"
            className_label="font-bold"
            className_dsub=""
            label="Loan Product"
            placeHolder="Loan Product"
            value={getAppDetails.loanProd}
            options={loanProducts}
            category="marketing"
          />

          {getAppDetails.loanProd === "0303-DHW" ||
          getAppDetails.loanProd === "0303-VL" ||
          getAppDetails.loanProd === "0303-WL" ? (
            <DatePicker_Deployment
              className_dmain="w-full h-[3rem] mt-4"
              className_label="font-bold"
              className_dsub=""
              label="OFW Departure Date"
              value={getAppDetails.loanDateDep}
              disabled={!isEdit}
              category="marketing"
              placeHolder="MM-DD-YYYY"
              disabledate={disableDate_deployment}
            />
          ) : null}

          <LabeledSelectLoanPurpose
            className_dmain="w-full h-[3rem] mt-4"
            className_label="font-bold"
            className_dsub=""
            category="marketing"
            value={getAppDetails.loanPurpose}
            label="Loan Purpose"
            placeHolder="Purpose"
          />

          <LabeledSelect_Branch
            mod={true}
            className_dmain="w-full h-[3rem] mt-4"
            className_label="font-bold"
            value={getAppDetails.loanBranch}
            label="Assigned Branch"
            category="marketing"
            placeHolder={"Branch"}
          />

          <LabeledCurrencyInput
            className_dmain="w-full h-[3rem] mt-4"
            className_label="font-bold"
            className_dsub=""
            label="Loan Amount"
            placeHolder="Loan Amount"
            value={getAppDetails.loanAmount}
            fieldName="loanAmount"
            category="marketing"
          />

          <LabeledSelect
            className_dmain="w-full h-[3rem] mt-4"
            className_label="font-bold"
            className_dsub=""
            label="Loan Term (in Months)"
            placeHolder="Select Loan Term"
            value={getAppDetails.loanTerms}
            data={loanterm()}
            fieldName="loanTerms"
            category="marketing"
          />
        </div>
      )}
      <div className="flex justify-center space-x-4 mb-2 mt-6">
        {isEdit ? (
          <>
            {/* Save Button */}
            <Button
              type="primary"
              icon={<SaveOutlined />}
              // disabled={loanValidation}
              onClick={() => {
                updateData();
              }}
            >
              Save
            </Button>

            {/* Cancel Button */}
            <Button
              type="default"
              onClick={() => {
                queryClient.invalidateQueries(
                  { queryKey: ["ClientDataQuery"] },
                  { exact: true }
                );
                setEdit(false);
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          /* Edit Button when not in edit mode */
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              toggleEditMode();
            }}
            disabled={getAppDetails.loanStatus !== "RECEIVED"}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

export default LoanDetails;
