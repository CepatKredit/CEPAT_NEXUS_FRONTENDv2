import { GET_DATA } from "@api/base-api/BaseApi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export function BarangayList(type, municipalityAreaCode) {
    const [getBarangay, setBarangay] = React.useState([]);
  
    const municipalityAreaCodeList =
      type === "present"
        ? municipalityAreaCode.ofwPresMunicipality
        : type === "permanent" && municipalityAreaCode.ofwSameAdd
        ? municipalityAreaCode.ofwPresMunicipality
        : type === "permanent" && !municipalityAreaCode.ofwSameAdd
        ? municipalityAreaCode.ofwPermMunicipality
        : type === "beneficiary" && municipalityAreaCode.bensameadd
        ? municipalityAreaCode.ofwPresMunicipality
        : type === "beneficiary" && !municipalityAreaCode.bensameadd
        ? municipalityAreaCode.benpresmunicipality
        : type === "provincial" && municipalityAreaCode.ofwProvSameAdd
        ? municipalityAreaCode.ofwPresMunicipality
        : type === "provincial" && !municipalityAreaCode.ofwProvSameAdd
        ? municipalityAreaCode.ofwprovMunicipality
        : type === "coborrow" && municipalityAreaCode.coborrowSameAdd
        ? municipalityAreaCode.ofwPresMunicipality
        : type === "coborrow" && !municipalityAreaCode.coborrowSameAdd
        ? municipalityAreaCode.coborrowMunicipality
        : null;
  
    if (!municipalityAreaCodeList) return [];
  
    useQuery({
      queryKey: ["BarangayCode", municipalityAreaCodeList],
      queryFn: async () => {
        const result = await axios.get(`/getbarangaylist/${municipalityAreaCodeList}`);
        return result.data.list;
      },
      onSuccess: (data) => setBarangay(data),
      enabled: !!municipalityAreaCodeList,
      refetchInterval: (data) => (data && data.length === 0 ? 500 : false),
      retryDelay: 1000,
    });
  
    return getBarangay;
  }