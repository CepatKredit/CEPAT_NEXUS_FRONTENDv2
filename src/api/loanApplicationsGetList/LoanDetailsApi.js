import { GET_LIST_ASYNC } from "@api/base-api/BaseApi";
import { useQuery } from "@tanstack/react-query";

export const useLoanProductSelectValues = (fieldName) => {
    return useQuery({
      queryKey: ["getProductSelect"],
      queryFn: async () => {
        const result = await GET_LIST_ASYNC("/GET/G19LLP");
        return result.list;
      },
      refetchInterval: 5000,
      enabled: fieldName === "loanProd",
      retryDelay: 1000,
    });
};

export const useLoanPurposeSelectValues = (fieldName) =>{
    return useQuery({
        queryKey: ["getLoanPurpose"],
        queryFn: async () => {
          const result = await GET_LIST_ASYNC("/GET/G20LP");

          return result.list;
        },
        refetchInterval: (data) => {
          data?.length === 0 ? 500 : false;
        },
        enabled: fieldName === "loanPurpose",
        retryDelay: 1000,
      });
}