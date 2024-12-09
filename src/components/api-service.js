import { GET_LIST } from "@api/base-api/BaseApi";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";

export function ComponentPreloads() {
  const [getLoanProdList, setLoanProdList] = React.useState([]);
  useQuery({
    queryKey: ["LoanProductList"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G19LLP");
      setLoanProdList(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getRelationship, setRelationship] = React.useState([])
  useQuery({
    queryKey: ["RelationshipList"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G152RR");
      setRelationship(result.list)
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getRelationship2, setRelationship2] = React.useState([])
  useQuery({
    queryKey: ["RelationshipList2"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G153LR");
      setRelationship2(result.list)
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getCountryList, setCountryList] = React.useState([]);
  useQuery({
    queryKey: ["CountryList"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G26C");
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
      const result = await GET_LIST("/GET/G23PL");
      setProvinceList(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getLoanPurpose, setLoanPurpose] = React.useState([]);
  useQuery({
    queryKey: ["LoanPurposeList"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G20LP");
      setLoanPurpose(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getBranchList, setBranchList] = React.useState([]);
  useQuery({
    queryKey: ["BranchListQuery"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G10BL");
      setBranchList(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getSuffix, setSuffix] = React.useState([]);
  useQuery({
    queryKey: ["SuffixList"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G28S");
      setSuffix(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getValidId, setValidId] = React.useState([]);
  useQuery({
    queryKey: ["getValidIdList"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G27IT");
      setValidId(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getCurrency, setCurrency] = React.useState([]);
  useQuery({
    queryKey: ['getCurrency'],
    queryFn: async () => {
      const result = await GET_LIST('/GET/G105CL');
      setCurrency(result.list)
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getCollectionArea, setCollectionArea] = React.useState([])
  useQuery({
    queryKey: ['collectionArea'],
    queryFn: async () => {
      const result = await GET_LIST('GET/G29CA');
      setCollectionArea(result.list)
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    enabled: true,
    retryDelay: 1000,
  });

  const [getConsultant, setConsultant] = React.useState([]);
  useQuery({
    queryKey: ['ConsultantList'],
    queryFn: async () => {
      const result = await GET_LIST('/GET/G21LC');
      setConsultant(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getSeaBasedJC, setSeaBasedJC] = React.useState([]);
  useQuery({
    queryKey: ['SeaBaseJobCategory'],
    queryFn: async () => {
      const result = await GET_LIST('/GET/G151SB');
      setSeaBasedJC(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getJC, setJC] = React.useState([]);
  useQuery({
    queryKey: ['JobCategory'],
    queryFn: async () => {
      const result = await GET_LIST('/GET/G30JC');
      setJC(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });

  const [getPosition, setPosition] = React.useState([]);
  useQuery({
    queryKey: ['JobPosition'],
    queryFn: async () => {
      const result = await GET_LIST('/GET/G31P');
      setPosition(result.list);
      return result.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    retryDelay: 1000,
  });


  return {
    GET_COUNTRY_LIST: getCountryList,
    GET_LOAN_PRODUCT_LIST: getLoanProdList,
    GET_PROVINCE_LIST: getProvinceList,
    GET_LOAN_PURPOSE_LIST: getLoanPurpose,
    GET_BRANCH_LIST: getBranchList,
    GET_OFW_SUFFIX: getSuffix,
    GET_VALID_ID_LIST: getValidId,
    GET_RELATIONSHIP_LIST: getRelationship,
    GET_RELATIONSHIP_ALL: getRelationship2,
    GET_CURRENCY_LIST: getCurrency,
    GET_COLLECTION_AREA_LIST: getCollectionArea,
    GET_LOAN_CONSULTANT: getConsultant,
    GET_SEABASED_JOBCATEGORY: getSeaBasedJC,
    GET_JOB_CATEGORY: getJC,
    GET_JOB_POSITION: getPosition,
    //     GET_MUNICIPALITY: getMunicipalityList,
  };
}
