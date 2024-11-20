import { GET_LIST } from "@api/base-api/BaseApi";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export function LoanProductList () {
    const [getLoanProdList, setLoanProdList] = React.useState([]);
    useQuery({
        queryKey: ['LoanProductList'],
        queryFn: async () => {
            const result = await GET_LIST('/getListLoanProduct');
            setLoanProdList(result.list)
            console.log("API LOAN PRODUCT", result.list)
            return result.list;
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        retryDelay: 1000,
    });
    return getLoanProdList;
}