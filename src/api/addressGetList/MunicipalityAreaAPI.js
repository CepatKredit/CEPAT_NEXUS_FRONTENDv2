import { GET_DATA } from "@api/base-api/BaseApi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export function MunicipalityAreaList(type, provinceCode) {
    const [getMunicipalityArea, setMunicipalityArea] = React.useState([]);
  
    const provinceCodeList =
      type === "present"
        ? provinceCode.ofwPresProv
        : type === "permanent" && provinceCode.ofwSameAdd
        ? provinceCode.ofwPresProv
        : type === "permanent" && !provinceCode.ofwSameAdd
        ? provinceCode.ofwPermProv
        : type === "beneficiary" && provinceCode.bensameadd
        ? provinceCode.ofwPresProv
        : type === "beneficiary" && !provinceCode.bensameadd
        ? provinceCode.benpresprov
        : type === "provincial" && provinceCode.ofwProvSameAdd
        ? provinceCode.ofwPresProv
        : type === "provincial" && !provinceCode.ofwProvSameAdd
        ? provinceCode.ofwprovProv
        : type === "coborrow" && provinceCode.coborrowSameAdd
        ? provinceCode.ofwPresProv
        : type === "coborrow" && !provinceCode.coborrowSameAdd
        ? provinceCode.coborrowProv
        : null;
  
    if (!provinceCodeList) return [];
  
    useQuery({
      queryKey: ["MunicipalityCode", provinceCodeList],
      queryFn: async () => {
        const result = await axios.get(`/getMuniArea/${provinceCodeList}`);
        console.log("MUNIIIIII API", result.data.list);
        return result.data.list;
      },
      onSuccess: (data) => setMunicipalityArea(data),
      refetchInterval: (data) => (data && data.length === 0 ? 500 : false), 
      retryDelay: 1000,
      enabled: !!provinceCodeList,
    });
  
    return getMunicipalityArea;
  }