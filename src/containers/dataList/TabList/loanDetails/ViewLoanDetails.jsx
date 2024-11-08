import React from "react";
import { Descriptions } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST, GetLoanProduct } from "@api/base-api/BaseApi";
import { LoanType } from "@utils/FixedData";

function ViewLoanDetails({ data, User }) {
  const loanProducts = useQuery({
    queryKey: ["getProductSelect"],
    queryFn: async () => {
      const result = await GET_LIST("/getListLoanProduct");
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    enabled: true,
    retryDelay: 1000,
  });

  const loanPurpose = useQuery({
    queryKey: ["getLoanPurpose"],
    queryFn: async () => {
      const result = await GET_LIST("/getLoanPurpose");
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    enabled: true,
    retryDelay: 1000,
  });
  function formatNumberWithCommas(num) {
    if (!num) return "";
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  function formatToTwoDecimalPlaces(num) {
    if (!num) return "";
    return parseFloat(num).toFixed(2);
  }
  const consultantData = useQuery({
    queryKey: ["getLoanConsultant"],
    queryFn: async () => {
      const result = await GET_LIST("/getLoanConsultant");
      return result.list;
    },
    refetchInterval: 30 * 1000,
    retryDelay: 1000,
  });

  const loanTypeOptions = LoanType(true);
  const items = [
    {
      key: "1",
      label: (
        <span
          className={`font-semibold ${
            data.loanAppCode ? "text-black" : "text-orange-500"
          }`}
        >
          Loan Application ID
        </span>
      ),
      children: data.loanAppCode || "",
    },
    User !== "LC" && {
      key: "2",
      label: (
        <span
          className={`font-semibold ${
            data.loanCreated ? "text-black" : "text-orange-500"
          }`}
        >
          Date of Application
        </span>
      ),
      children: data.loanCreated || "",
    },
    {
      key: "3",
      label: (
        <span
          className={`font-semibold ${
            loanProducts.data?.find((option) => option.code === data.loanProd)
              ? "text-black"
              : "text-orange-500"
          }`}
        >
          Loan Product
        </span>
      ),
      children:
        loanProducts.data?.find((option) => option.code === data.loanProd)
          ?.description || "",
    },
    ["0303-DHW", "0303-VL", "0303-WL"].includes(data.loanProd) && {
      key: "4",
      label: (
        <span
          className={`font-semibold ${
            data.ofwDeptDate ? "text-black" : "text-orange-500"
          }`}
        >
          OFW Departure Date
        </span>
      ),
      children: data.ofwDeptDate || "",
    },
    User !== "LC" && {
      key: "5",
      label: (
        <span
          className={`font-semibold ${
            data.loanBranch ? "text-black" : "text-orange-500"
          }`}
        >
          Assigned Branch
        </span>
      ),
      children: data.loanBranch || "",
    },
    {
      key: "6",
      label: (
        <span
          className={`font-semibold ${
            loanTypeOptions.find((option) => option.value === data.loanType)
              ? "text-black"
              : "text-orange-500"
          }`}
        >
          Loan Application Type
        </span>
      ),
      children:
        loanTypeOptions.find((option) => option.value === data.loanType)
          ?.label || "",
    },
    (User === "Credit" || User === "Lp") &&
      data.loanType === 2 && {
        key: "7",
        label: (
          <span
            className={`font-semibold ${
              data.PrevAmount ? "text-black" : "text-orange-500"
            }`}
          >
            Previous Approved Amount{" "}
          </span>
        ),
        children: data.PrevAmount
          ? formatNumberWithCommas(
              formatToTwoDecimalPlaces(
                String(data.PrevAmount).replaceAll(",", "")
              )
            )
          : "",
      },
    {
      key: "8",
      label: (
        <span
          className={`font-semibold ${
            loanPurpose.data?.find((purpose) => purpose.id === data.loanPurpose)
              ? "text-black"
              : "text-orange-500"
          }`}
        >
          Loan Purpose
        </span>
      ),
      children:
        loanPurpose.data?.find((purpose) => purpose.id === data.loanPurpose)
          ?.purpose || "",
    },
    {
      key: "9",
      label: (
        <span
          className={`font-semibold ${
            data.loanAmount ? "text-black" : "text-orange-500"
          }`}
        >
          {User === "Credit" || User === "Lp"
            ? "Applied Loan Amount"
            : "Loan Amount"}
        </span>
      ),
      children: data.loanAmount
        ? formatNumberWithCommas(
            formatToTwoDecimalPlaces(
              String(data.loanAmount).replaceAll(",", "")
            )
          )
        : "",
    },
    {
      key: "10",
      label: (
        <span
          className={`font-semibold ${
            data.loanTerms ? "text-black" : "text-orange-500"
          }`}
        >
          {User === "Credit" || User === "Lp"
            ? "Applied Loan Terms"
            : "Loan Terms (Months)"}
        </span>
      ),
      children: data.loanTerms || "",
    },
    (User === "Credit" || User === "Lp") && {
      key: "11",
      label: (
        <span
          className={`font-semibold ${
            data.CRAApprvRec ? "text-black" : "text-orange-500"
          } w-[7rem]`}
        >
          CRA Recommendation
        </span>
      ),
      children: data.CRAApprvRec
        ? formatNumberWithCommas(
            formatToTwoDecimalPlaces(
              String(data.CRAApprvRec).replaceAll(",", "")
            )
          )
        : "",
    },
    data.channel === "Loan Consultant/Referral" &&
      data.consultName && {
        key: "12",
        label: (
          <span
            className={`font-semibold ${
              data.consultName ? "text-black" : "text-orange-500"
            }`}
          >
            Loan Consultant
          </span>
        ),
        children: data.consultName || "",
      },
    data.channel === "Loan Consultant/Referral" &&
      User !== "LC" &&
      data.consultNumber && {
        key: "13",
        label: (
          <span
            className={`font-semibold ${
              data.consultNumber ? "text-black" : "text-orange-500"
            }`}
          >
            Loan Consultant Number
          </span>
        ),
        children: data.consultNumber || "",
      },
    data.channel === "Loan Consultant/Referral" &&
      data.consultantfblink && {
        key: "14",
        label: (
          <span
            className={`font-semibold ${
              data.consultantfblink ? "text-black" : "text-orange-500"
            } w-[10rem]`}
          >
            Consultant Facebook Name / Profile
          </span>
        ),
        children: data.consultantfblink || "",
      },
    User !== "LC" && {
      key: "15",
      label: (
        <span
          className={`font-semibold ${
            data.channel ? "text-black" : "text-orange-500"
          } w-[12rem]`}
        >
          How did you know about Cepat Kredit Financing?
        </span>
      ),
      children: data.channel || "",
    },
    (User === "Credit" || User === "Lp") && {
      key: "16",
      label: <span className="font-semibold text-black">CRA Remarks</span>,
      children: data.CRARemarks || "",
    },
  ];

  const filteredItems = items.filter(Boolean);

  return (
    <div className="container mt-1 mx-auto p-10 bg-white rounded-xl shadow-lg w-[75vw]">
      <Descriptions
        title={
          <h2 className="text-2xl font-bold text-center mt-5">
            Loan Information
          </h2>
        }
        column={
          User === "LC" ? { md: 2, lg: 3, xl: 4 } : { md: 1, lg: 2, xl: 3 }
        }
        layout="horizontal"
      >
        {filteredItems.map((item) => (
          <Descriptions.Item key={item.key} label={item.label}>
            {item.children}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  );
}

export default ViewLoanDetails;
