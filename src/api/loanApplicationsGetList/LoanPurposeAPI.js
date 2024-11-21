import { GET_LIST } from "@api/base-api/BaseApi";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export function LoanPurposeList() {
  const [getLoanPurpose, setLoanPurpose] = React.useState([]);
  useQuery({
    queryKey: ["getLoanPurpose"],
    queryFn: async () => {
      const result = await GET_LIST("/getLoanPurpose");
      setLoanPurpose(result.list)
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });
  return getLoanPurpose;
}
