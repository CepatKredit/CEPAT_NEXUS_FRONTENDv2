import DataList from "@pages/DataList";
import { GetData } from "@utils/UserData";
import * as React from "react";
import { Typography, Input, Button, Table, Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PathName, TileNumber } from "@utils/Conditions";
import { ColumnList } from "@utils/TableColumns";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { GET_LIST } from "@api/base-api/BaseApi";
import moment from "moment";
import { toEncrypt } from "@utils/Converter";
import NetProceeds from "./disbursement/NetProceeds";
import LCCommission from "./disbursement/LCCommission";

function ForDisbursement() {
  const [getSearch, setSearch] = React.useState("");
  const [expandedRowKey, setExpandedRowKey] = React.useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("UTK");

  React.useEffect(() => {
    AppDataListQuery.refetch();
  }, [localStorage.getItem("SP")]);
  const AppDataListQuery = useQuery({
    queryKey: ["AppDataListQuery"],
    queryFn: async () => {
      const result = await GET_LIST(
        `/v1/GET/G2AD/${jwtDecode(token).USRID}/${TileNumber(
          localStorage.getItem("SP")
        )}`
      );
      console.log("GUID", result.list);
      return result.list;
    },
    enabled: true,
    refetchInterval: 60 * 1000,
    retryDelay: 1000,
    staleTime: 5 * 1000,
  });

  function formatNumberWithCommas(num) {
    if (!num) return "0.00";
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return parts.join(".");
  }

  return (
    <>
      {GetData("ROLE").toString() === "90" ? (
        <div className="mx-[1%] my-[2%]">
          <div className="flex flex-row gap-3">
            <Typography.Title level={2}>
              {PathName(localStorage.getItem("SP"))}
            </Typography.Title>
          </div>
          <>
            <div className="flex flex-rows pb-2 min-w-[30%] float-end">
              <Input
                className="w-[100%]"
                addonAfter={<SearchOutlined />}
                placeholder="Search"
                size="large"
                onChange={(e) => {
                  setSearch(e.target.value.toUpperCase());
                }}
                value={getSearch}
              />
            </div>
            <Table
              size="small"
              columns={ColumnList("FOR-DISBURSEMENT")}
              scroll={{ y: "calc(100vh - 450px)", x: "100%" }}
              dataSource={AppDataListQuery.data
                ?.filter(
                  (x) =>
                    x.loanAppCode.includes(getSearch) ||
                    x.recDate.includes(getSearch) ||
                    x.loanProduct.toUpperCase().includes(getSearch) ||
                    x.borrowersFullName.toUpperCase().includes(getSearch) ||
                    x.departureDate.includes(getSearch) ||
                    x.beneficiaryFullName.toUpperCase().includes(getSearch) ||
                    x.consultant.toUpperCase().includes(getSearch) ||
                    x.loanType.toUpperCase().includes(getSearch) ||
                    x.branch.toUpperCase().includes(getSearch)
                )
                .map((x, i) => ({
                  key: i,
                  NO: i + 1,
                  LAN: (
                    <Button
                      key={i}
                      onClick={() => {
                        localStorage.setItem("SIDC", toEncrypt(x.loanAppId));
                        navigate(
                          `${localStorage.getItem("SP")}/${
                            x.loanAppCode
                          }/acc-uploaded-files`
                        );
                      }}
                      type="link"
                    >
                      {x.loanAppCode}
                    </Button>
                  ),
                  PN: x.pnNumber,
                  LP: x.loanProduct,
                  OFW: x.borrowersFullName,
                  BENE: x.beneficiaryFullName,
                  STAT: x.status,
                  CID: x.loanAppId,
                  DOA: moment(x.recDate).format("MM/DD/YYYY"),
                  AA: formatNumberWithCommas(
                    parseFloat(x.approvedAmount).toFixed(2).toString()
                  ),
                  RA: formatNumberWithCommas(
                    parseFloat(x.releasedAmount).toFixed(2).toString()
                  ),
                }))}
              expandable={{
                expandedRowRender: (data) => (
                  <div className="h-[16rem] overflow-y-auto">
                    <Tabs
                      tabPosition="top"
                      type="card"
                      size="small"
                      items={[
                        {
                          label: "Net Proceeds",
                          key: "net-proceeds",
                          children: <NetProceeds data={data} />,
                        },
                        {
                          label: "LC Commission",
                          key: "lc-commission",
                          children: <LCCommission data={data} />,
                        },
                      ]}
                    />
                  </div>
                ),
                expandedRowKeys: [expandedRowKey], 
                onExpand: (expanded, record) => {
                  if (expanded) {
                    setExpandedRowKey(record.key); 
                    localStorage.setItem("SIDC", toEncrypt(record.CID));
                  } else {
                    setExpandedRowKey(null);
                    localStorage.removeItem("SIDC");
                  }
                },
              }}
            />
          </>
        </div>
      ) : (
        <DataList />
      )}
    </>
  );
}

export default ForDisbursement;
