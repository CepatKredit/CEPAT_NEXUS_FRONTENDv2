import * as React from "react";
import {
  Typography,
  Divider,
  Input,
  Button,
  Select,
  Space,
  notification,
  Spin,
  ConfigProvider,
} from "antd";
import { MdOutlineManageAccounts } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import ResponsiveTable from "@components/global/ResponsiveTable";
import { PathName, TileNumber } from "@utils/Conditions";
import { ColumnList } from "@utils/TableColumns";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { GET_LIST } from "@api/base-api/BaseApi";
import moment from "moment";
import { mmddyy, toEncrypt } from "@utils/Converter";
import { GetData } from "@utils/UserData";
import DataList from "./DataList";
import dayjs from "dayjs";
import axios from "axios";

function DataList_AssignToCra() {
  const [getSearch, setSearch] = React.useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("UTK");
  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();

  React.useEffect(() => {
    AppDataListQuery.refetch();
  }, [localStorage.getItem("SP")]);
  const AppDataListQuery = useQuery({
    queryKey: ["AppDataListQuery"],
    queryFn: async () => {
      const result = await GET_LIST(
        `/GET/G2AD/${jwtDecode(token).USRID}/${TileNumber(
          localStorage.getItem("SP")
        )}`
      );
      return result.list;
    },
    enabled: true,
    refetchInterval: 60 * 1000,
    retryDelay: 1000,
    staleTime: 5 * 1000,
  });

  React.useEffect(() => {
    CraListQuery.refetch();
  }, []);

  const CraListQuery = useQuery({
    queryKey: ["CraListQuery"],
    queryFn: async () => {
      const result = await GET_LIST(`/GET/G112CL`);
      return result.list || [];
    },
    enabled: true,
    refetchInterval: 60 * 1000,
    retryDelay: 1000,
    staleTime: 5 * 1000,
  });

  async function OnChange(craId, loanAppId) {
    if (!craId || !loanAppId) return; // Ensure both values are present
    try {
      const result = await axios.post(`/POST/P141UCA`, {
        AssignedCra: craId,
        LoggedBy: jwtDecode(token).USRID,
        LogggedDate: mmddyy(dayjs()),
        LoanappId: loanAppId,
      });

      AppDataListQuery.refetch();
      api[result.data.status]({
        message: result.data.message,
        description: result.data.description,
      });
    } catch (error) {
      console.log("Error assigning CRA:", error);
    }
  }

  const CraListOption = CraListQuery.data?.map((x) => ({
    label: x.fullName,
    value: x.id.toUpperCase(),
    isOnline: x.isOnline,
    role: x.role,
  }));

  return GetData("ROLE").toString() === "60" ? ( //FOR CRO Manual Assigning
    <>
      {contextHolder}
      <div className="mx-[1%] my-[2%]">
        <div className="flex flex-row gap-3">
          <MdOutlineManageAccounts
            style={{ fontSize: "40px", color: "#483d8b" }}
            hidden
          />
          <Typography.Title level={2}>
            {PathName(localStorage.getItem("SP"))}
          </Typography.Title>
        </div>
        <Divider />
        <Button
          type="primary"
          onClick={() => {
            navigate(`${localStorage.getItem("SP")}/12/tab=1`);
          }}
          hidden
        >
          TEST
        </Button>
        <div className="flex justify-between items-center mb-1">
        <div></div>
        <div className="w-[400px]">
          <Input
            addonAfter={<SearchOutlined />}
            placeholder="Search"
            size="large"
            className="w-full h-[50px] px-4"
            onChange={(e) => { setSearch(e.target.value.toUpperCase()); }}
            value={getSearch}
          />
        </div>
      </div>
        <ConfigProvider
          theme={{ components: { Spin: { colorPrimary: "rgb(86,191,84)" } } }}
        >
          <Spin
            spinning={AppDataListQuery.isFetching}
            tip={<span style={{ color: "rgb(59,7,100)" }}>Please wait...</span>}
            className="flex justify-center items-center"
            size="large"
          >
            <ResponsiveTable
              columns={ColumnList("11", AppDataListQuery)}
              height={"calc(95vh - 505px)"}
              width={"100%"}
              rows={AppDataListQuery.data
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
                    x.branch.toUpperCase().includes(getSearch) //||
                  // x.assignedCra.toUpperCase().includes(getSearch)
                )
                .map((x, i) => ({
                  key: i,
                  NO: i + 1,
                  LAN: (
                    <Button
                      key={i}
                      onClick={() => {
                        localStorage.setItem("SIDC", toEncrypt(x.loanAppId));
                        localStorage.setItem("activeTab", "deduplication");
                        navigate(
                          `${localStorage.getItem("SP")}/${
                            x.loanAppCode
                          }/deduplication`
                        );
                        queryClient.invalidateQueries(
                          { queryKey: ["getRemarks", x.loanAppCode] },
                          { exact: true }
                        );
                      }}
                      type="link"
                    >
                      {x.loanAppCode}
                    </Button>
                  ),
                  AC: (
                    <Select
                      placeholder={"Assign CRA"}
                      value={x.assignedCra}
                      onChange={(craId) => OnChange(craId, x.loanAppId)}
                      options={CraListOption}
                      className="w-full"
                      optionRender={(options) => (
                        <Space>
                          <div
                            className={`h-2 w-2 mr-2 rounded-full ${
                              options.data.isOnline
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {options.data.label}
                        </Space>
                      )}
                    />
                  ),
                  DOA: moment(x.recDate).format("MM/DD/YYYY"),
                  LP: x.loanProduct,
                  OFW: x.borrowersFullName,
                  OFWDD: x.departureDate,
                  BENE: x.beneficiaryFullName,
                  LC: x.consultant,
                  LT: x.loanType,
                  LB: x.branch,
                  STAT: x.statusName,
                  UB: x.modUser,
                  LIR: x.remarksIn,
                  LU: "N/A",
                  TID: "N/A",
                }))}
            />
          </Spin>
        </ConfigProvider>
      </div>
    </>
  ) : (
    <DataList />
  );
}

export default DataList_AssignToCra;
