import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { ComponentPreloads } from "@components/api-service";

const DataContext = React.createContext();
function PreLoad({ children }) {
  //From components
  const {
    GET_LOAN_PRODUCT_LIST,
    GET_COUNTRY_LIST,
    GET_PROVINCE_LIST,
    GET_LOAN_PURPOSE_LIST,
    GET_BRANCH_LIST,
    GET_OFW_SUFFIX,
    GET_VALID_ID_LIST,
    GET_RELATIONSHIP_LIST,
    GET_CURRENCY_LIST,
    GET_COLLECTION_AREA_LIST,
  } = ComponentPreloads();
  //const GET_PROVINCE_LIST = ProvinceList();

  const [getPurpose, setPurpose] = React.useState([]);
  const getPurposeList = useQuery({
    queryKey: ["PurposeListQuery"],
    queryFn: async () => {
      const result = await GET_LIST(`/GET/G99PL`);
      let dataContainer = [];
      result.list?.map((x) => {
        dataContainer.push(x);
      });
      setPurpose(dataContainer);
      return dataContainer;
    },
    enabled: true,
  });

  const [getBank, setBank] = React.useState([]);
  const getBankList = useQuery({
    queryKey: ["BankListQuery"],
    queryFn: async () => {
      const result = await GET_LIST(`/GET/G100PT`);
      let dataContainer = [];
      result.list?.map((x) => {
        dataContainer.push(x);
      });
      setBank(dataContainer);
      return dataContainer;
    },
    enabled: true,
  });

  const [GET_LOAN_APPLICATION_NUMBER, setLAN] = React.useState("");
  function SET_LOAN_APPLICATION_NUMBER(value) {
    setLAN(value);
  }

  const [GET_TOTAL_AMOUNT, setAmount] = React.useState("");
  const getDisbursementList = useQuery({
    queryKey: ["PRELOAD_DISBURSEMENT", GET_LOAN_APPLICATION_NUMBER],
    queryFn: async () => {
      let total = 0;
      if(GET_LOAN_APPLICATION_NUMBER === '') return [];
      const result = await GET_LIST(
        `/GET/G106DL/${GET_LOAN_APPLICATION_NUMBER}/${"NP"}`
      );
      result.list?.map((x) => {
        total += parseFloat(x.amount);
      });
      setAmount(total.toString());
      return result.list;
    },
    enabled: true,
  });

  const [GET_REFRESH_LAN, setRefreshLan] = React.useState(0);
  function SET_REFRESH_LAN(value) {
    setRefreshLan(value);
  }

  React.useEffect(() => {
    if (GET_REFRESH_LAN === 1) {
      getDisbursementList.refetch();
      SET_REFRESH_LAN(0);
    }
  }, [GET_REFRESH_LAN]);

  const [GET_DATA_COUNTER, setDataCounter] = React.useState([]);
  const [getRefreshTileCounter, setRefreshTileCounter] = React.useState(0);
  const TileCountListQuery = useQuery({
    queryKey: ["TileCountListQuery"],
    queryFn: async () => {
      const result = await GET_LIST(`/GET/G98TC`);
      setDataCounter(result.list);
      return result.list;
    },
    enabled: true,
    refetchInterval: 60 * 1000,
    retryDelay: 1000,
    staleTime: 5 * 1000,
  });
  function SET_REFRESH_TILE_COUNTER(value) {
    setRefreshTileCounter(value);
  }

  React.useEffect(() => {
    TileCountListQuery.refetch();
    SET_REFRESH_TILE_COUNTER(0);
  }, [getRefreshTileCounter]);

  //REFETCH FOR PRELOAD DATA
  React.useEffect(() => {
    getBankList.refetch();
    getPurposeList.refetch();
    TileCountListQuery.refetch();
  }, []);

  return (
    <DataContext.Provider
      value={{
        //Components
        GET_LOAN_PRODUCT_LIST,
        GET_COUNTRY_LIST,
        GET_PROVINCE_LIST,
        GET_LOAN_PURPOSE_LIST,
        GET_BRANCH_LIST,
        GET_OFW_SUFFIX,
        GET_VALID_ID_LIST,
        GET_RELATIONSHIP_LIST,
        GET_CURRENCY_LIST,
        GET_COLLECTION_AREA_LIST,
        //Accounting
        getBank,
        getPurpose,
        GET_LOAN_APPLICATION_NUMBER,
        SET_LOAN_APPLICATION_NUMBER,
        GET_TOTAL_AMOUNT,
        SET_REFRESH_LAN,
        GET_DATA_COUNTER,
        SET_REFRESH_TILE_COUNTER,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default PreLoad;

export const useDataContainer = () => React.useContext(DataContext);
