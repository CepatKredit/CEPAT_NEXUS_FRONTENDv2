import { GET_DATA, GET_LIST } from "@api/base-api/BaseApi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export const BarangayList = (type, data) => {
  const [barangayList, setBarangayList] = React.useState([]);
  const munCode = React.useMemo(() => {
      switch (type) {
          case 'present': return data.ofwPresMunicipality;
          case 'permanent': return data.ofwSameAdd ? data.ofwPresMunicipality : data.ofwPermMunicipality;
          case 'beneficiary': return data.bensameadd ? data.ofwPresMunicipality : data.benpresmunicipality;
          case 'provincial': return data.ofwProvSameAdd ? data.ofwPresMunicipality : data.ofwprovMunicipality;
          case 'coborrow': return data.coborrowSameAdd ? data.ofwPresMunicipality : data.coborrowMunicipality;
          default: return null;
      }
  }, [type, data]);

  useQuery({
      queryKey: ['getBarangayFromMunCode', munCode],
      queryFn: async () => {
          if (!munCode) return [];
          const result = await GET_LIST(`/api/v1/GET/G7BL/${munCode}`);
          setBarangayList(result.list);
          return result.list;
      },
      refetchInterval: (data) => (data?.length === 0 ? 500 : false),
      retryDelay: 1000,
      enabled: !!munCode,
  });

  return barangayList;
};