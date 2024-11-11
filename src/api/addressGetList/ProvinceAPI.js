import { GET_LIST } from "@api/base-api/BaseApi";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export function ProvinceList() {
  const [getProvinceList, setProvinceList] = React.useState([]);
  useQuery({
    queryKey: ["ProvinceListQuery"],
    queryFn: async () => {
      const result = await GET_LIST('/getProvinceList')
      console.log("Province API", result.list);
      setProvinceList(result.list);
    },
    refetchInterval: (data) => (data && data.length === 0 ? 500 : false),
    retryDelay: 1000,
  });
  return getProvinceList
}
