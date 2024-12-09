import * as React from 'react';
import { Typography, Divider, Input, Button, ConfigProvider, Spin, Pagination } from 'antd';
import { MdOutlineManageAccounts } from "react-icons/md";
import { SearchOutlined } from '@ant-design/icons';
import ResponsiveTable from '@components/global/ResponsiveTable';
import { PathName, TileNumber } from '@utils/Conditions';
import { ColumnList } from '@utils/TableColumns';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { GET_LIST } from '@api/base-api/BaseApi';
import moment from 'moment';
import { toEncrypt } from '@utils/Converter';
import { useWindowDimensions } from "@hooks/GetWindowScreenSize";
import MobDataListView from '@containers/mobileView/MobDataListView';
import { GetData } from '@utils/UserData';
import { SideNavState } from '@hooks/MiniDashController';

function DataList() {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = React.useState(true);
  const [getSearch, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem('UTK');
  const queryClient = useQueryClient();
  const { isTableExpanded } = SideNavState();
  const tableHeight = isTableExpanded ? "calc(127vh - 505px)" : "calc(113vh - 505px)";

  React.useEffect(() => { AppDataListQuery.refetch() }, [localStorage.getItem('SP')]);

  const AppDataListQuery = useQuery({
    queryKey: ['AppDataListQuery'],
    queryFn: async () => {
      try {
        const result = await GET_LIST(`/GET/G2AD/${jwtDecode(token).USRID}/${TileNumber(localStorage.getItem('SP'))}`);
        setLoading(false);
        return result.list;
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        return [];
      }
    },
    enabled: true,
    refetchInterval: 60 * 1000,
    retryDelay: 1000,
    staleTime: 5 * 1000,
  });

  const filteredData = AppDataListQuery.data?.filter((x) =>
    x.loanAppCode.includes(getSearch) ||
    x.recDate.includes(getSearch) ||
    x.loanProduct.toUpperCase().includes(getSearch) ||
    x.borrowersFullName.toUpperCase().includes(getSearch) ||
    x.departureDate.includes(getSearch) ||
    x.beneficiaryFullName.toUpperCase().includes(getSearch) ||
    x.consultant.toUpperCase().includes(getSearch) ||
    x.loanType.toUpperCase().includes(getSearch) ||
    x.branch.toUpperCase().includes(getSearch)
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const userRole = GetData('ROLE')?.toString();
  

  return (
    <div className="mx-[1%] my-[2%] xs1:my-[-35%] xs:my-[-30%] sm:my-[0%] md:my-[2%] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MdOutlineManageAccounts
            style={{ fontSize: "40px", color: "#483d8b" }}
            hidden
          />
          <Typography.Title level={2} className="mb-0">
            {PathName(localStorage.getItem("SP"))}
          </Typography.Title>
        </div>
        <div className="w-full sm:w-[400px]">
          <Input
            addonAfter={<SearchOutlined />}
            placeholder="Search"
            size="large"
            className="w-full h-[50px] px-4"
            onChange={(e) => {
              setSearch(e.target.value.toUpperCase());
            }}
            value={getSearch}
          />
        </div>
      </div>

      <Button
        type="primary"
        onClick={() => {
          navigate(`${localStorage.getItem("SP")}/12/tab=1`);
        }}
        hidden
      >
        TEST
      </Button>

      <ConfigProvider
        theme={{
          components: { Spin: { colorPrimary: "rgb(86,191,84)" } },
        }}
      >
        <Spin
          spinning={AppDataListQuery.isFetching}
          tip={
            <span style={{ color: "rgb(59,7,100)" }}>Please wait...</span>
          }
          className="flex justify-center items-center"
          size="large"
        >
          {width < 640 ? (
            <MobDataListView
              paginatedData={filteredData}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          ) : (
              <div className="w-full">
                <ResponsiveTable
                  columns={ColumnList(3)}
                  height={tableHeight}
                  width="100%"
                  rows={filteredData?.map((x, i) => {
                    const loanProductMap = {
                      "DH - Philippines": "DHP",
                      "DH - Abroad": "DHA",
                      "OFW Loan - Abroad": "LBA",
                      "OFW Loan - In the Philippines": "LBP",
                      "Seafarer Loan - Deployed": "SBA",
                      "Seafarer Loan - In the Philippines": "SBP",
                    };
                    const isRoleValid = ["20", "10"].includes(userRole);
                    return {
                      key: i, 
                      NO: i + 1, 
                      LAN: (
                        <Button
                          key={i}
                          onClick={() => {
                            localStorage.setItem(
                              "SIDC",
                              toEncrypt(x.loanAppId)
                            );
                            localStorage.setItem("activeTab", "deduplication");
                            navigate(
                              `${localStorage.getItem("SP")}/${x.loanAppCode}/deduplication`
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
                      DOA: x.recDate
                        ? moment(x.recDate).format("MM/DD/YYYY")
                        : "N/A", 
                      LP: isRoleValid
                        ? loanProductMap[x.loanProduct] || x.loanProduct
                        : x.loanProduct,
                      OFW: x.borrowersFullName || "N/A", 
                      OFWDD: x.departureDate || "N/A",
                      BENE: x.beneficiaryFullName || "N/A", 
                      LC: x.consultant || "N/A",
                      LT: x.loanType || "N/A", 
                      LB: x.branch || "N/A", 
                      STAT: x.statusName || "N/A", 
                      UB: x.modUser || "N/A", 
                      LIR: x.remarksIn || "N/A", 
                    };
                  })}
                />
              </div>
          )}
        </Spin>
      </ConfigProvider>
    </div>
  );
}

export default DataList;
