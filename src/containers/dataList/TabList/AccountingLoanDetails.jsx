import React from "react";
import { Descriptions } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { LoanType } from "@utils/FixedData";

function AccountingLoanDetails({
  data,
  User,
  isShowAmount = false,
  classname,
}) {
  const loanProducts = useQuery({
    queryKey: ["getProductSelect"],
    queryFn: async () => {
      const result = await GET_LIST("/GroupGet/G19LLP");
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
      const result = await GET_LIST("/GroupGet/G21LC");
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
        <span className="font-semibold text-black">Loan Application ID</span>
      ),
      children: data.loanAppCode || "Not specified",
    },
    {
      key: "2",
      label: <span className="font-semibold text-black">PN Number</span>,
      children: "Not specified",
    },
    {
      key: "3",
      label: <span className="font-semibold text-black">Loan Product</span>,
      children:
        loanProducts.data?.find((option) => option.code === data.loanProd)
          ?.description || "Not specified",
    },

    {
      key: "4",
      label: (
        <span className="font-semibold text-black">Loan Application Type</span>
      ),
      children:
        loanTypeOptions.find((option) => option.value === data.loanType)
          ?.label || "Not specified",
    },
    {
      key: "5",
      label: (
        <span className="font-semibold text-black">Principal Borrower</span>
      ),
      children: "Not applicable",
    },
    {
      key: "6",
      label: <span className="font-semibold text-black">Co-Borrower</span>,
      children: "Not applicable",
    },
    {
      key: "7",
      label: <span className="font-semibold text-black">Status</span>,
      children: data.loanAppStat || "Not applicable",
    },
    isShowAmount
      ? {
        key: "6",
        label: <span className="font-semibold text-black">Net Proceeds</span>,
        children: data.loanAmount
          ? formatNumberWithCommas(
            formatToTwoDecimalPlaces(
              String(data.loanAmount).replaceAll(",", "")
            )
          )
          : "Not specified",
      }
      : "Not specified",
    isShowAmount
      ? {
        key: "6",
        label: <span className="font-semibold text-black">Loan Amount</span>,
        children: data.loanAmount
          ? formatNumberWithCommas(
            formatToTwoDecimalPlaces(
              String(data.loanAmount).replaceAll(",", "")
            )
          )
          : "Not specified",
      }
      : "Not specified",
  ];

  return (
    <div>
      <Descriptions
        className={classname}
        title={
          <h2 className="text-2xl font-bold text-center mt-5">
            Loan Information
          </h2>
        }
        column={{ xs: 1, sm: 2, lg: 3 }}
        layout="horizontal"
      >
        {items.map((item) => (
          <Descriptions.Item key={item.key} label={item.label}>
            {item.children}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  );
}
export default AccountingLoanDetails;