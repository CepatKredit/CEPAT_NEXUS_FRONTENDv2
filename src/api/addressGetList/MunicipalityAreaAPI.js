import { GET_DATA, GET_LIST } from "@api/base-api/BaseApi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export const MunicipalityList = (type, data) => {
  const [municipalityList, setMunicipalityList] = React.useState([]);
  const provCode = React.useMemo(() => {
      switch (type) {
          case 'present': return data.ofwPresProv;
          case 'permanent': return data.ofwSameAdd ? data.ofwPresProv : data.ofwPermProv;
          case 'beneficiary': return data.bensameadd ? data.ofwPresProv : data.benpresprov;
          case 'provincial': return data.ofwProvSameAdd ? data.ofwPresProv : data.ofwprovProv;
          case 'coborrow': return data.coborrowSameAdd ? data.ofwPresProv : data.coborrowProv;
          default: return null;
      }
  }, [type, data]);

  useQuery({
      queryKey: ['getMunFromProvCode', provCode],
      queryFn: async () => {
          if (!provCode) return [];
          const result = await GET_LIST(`/getMuniArea/${provCode}`);
          setMunicipalityList(result.list);
          console.log("AHHHH", municipalityList)
          return result.list;
      },
      refetchInterval: (data) => (data?.length === 0 ? 500 : false),
      retryDelay: 1000,
      enabled: !!provCode,
  });

  return municipalityList;
};
