import { GET_LIST } from "@api/base-api/BaseApi";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";

export function ComponentPreloads() {
  const [getLoanProdList, setLoanProdList] = React.useState([]);
  useQuery({
    queryKey: ["LoanProductList"],
    queryFn: async () => {
      const result = await GET_LIST("/getListLoanProduct");
      setLoanProdList(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getCountryList, setCountryList] = React.useState([]);
  useQuery({
    queryKey: ["CountryList"],
    queryFn: async () => {
      const result = await GET_LIST("/OFWDetails/getCountry");
      //console.log(result.list)
      setCountryList(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getProvinceList, setProvinceList] = React.useState([]);
  useQuery({
    queryKey: ["ProvinceList"],
    queryFn: async () => {
      const result = await GET_LIST("/getProvinceList");
      //console.log(result.list)
      setProvinceList(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getLoanPurpose, setLoanPurpose] = React.useState([]);
  useQuery({
    queryKey: ["getLoanPurpose"],
    queryFn: async () => {
      const result = await GET_LIST("/getLoanPurpose");
      setLoanPurpose(result.list);
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getBranchList, setBranchList] = React.useState([]);
  useQuery({
    queryKey: ["BranchListQuery"],
    queryFn: async () => {
      const result = await GET_LIST("/getBranchList");
      console.log("BRANCH API", result.list);
      setBranchList(result.list);
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getSuffix, setSuffix] = React.useState([]);
  useQuery({
    queryKey: ["getSuffix"],
    queryFn: async () => {
      const result = await GET_LIST("/OFWDetails/GetSuffix");
      setSuffix(result.list);
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getValidId, setValidId] = React.useState([]);
  useQuery({
    queryKey: ["getValidIdSelect"],
    queryFn: async () => {
      const result = await GET_LIST("/OFWDetails/getIDtype");
      setValidId(result.list);
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getRelationship, setRelationship] = React.useState([])
  useQuery({
    queryKey: ["getRelationship"],
    queryFn: async () => {
      const result = await GET_LIST("/getListRelationship");
      setRelationship(result.list)
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });
  //////////////////////////////////
  //const { getAppDetails } = useContext(LoanApplicationContext)
  // const data = getAppDetails
  /*
    const getProvCode = (type, data) => {
        if (type === "present") return data.ofwPresProv;
        if (type === "permanent")
            return data.ofwSameAdd ? data.ofwPresProv : data.ofwPermProv;
        if (type === "beneficiary")
            return data.bensameadd ? data.ofwPresProv : data.benpresprov;
        if (type === "provincial")
            return data.ofwProvSameAdd ? data.ofwPermProv : data.ofwprovProv;
        if (type === "coborrow")
            return data.coborrowSameAdd ? data.ofwPresProv : data.coborrowProv;
        return null;
    };

    const [getMunicipalityList, setMunicipalityList] = React.useState([]);
    useQuery({
        queryKey: ["getMunF", getProvCode(type, data)],
        queryFn: async () => {
            const provCode = getProvCode(type, data);
            const result = await GET_LIST(`/getMuniArea/${provCode}`);
            setMunicipalityList(result.list)
            return result.list;
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        retryDelay: 1000,
    });
*/
  return {
    GET_COUNTRY_LIST: getCountryList,
    GET_LOAN_PRODUCT_LIST: getLoanProdList,
    GET_PROVINCE_LIST: getProvinceList,
    GET_LOAN_PURPOSE_LIST: getLoanPurpose,
    GET_BRANCH_LIST: getBranchList,
    GET_OFW_SUFFIX: getSuffix,
    GET_VALID_ID_LIST: getValidId,
    GET_RELATIONSHIP_LIST: getRelationship,
    //     GET_MUNICIPALITY: getMunicipalityList,
  };
}
