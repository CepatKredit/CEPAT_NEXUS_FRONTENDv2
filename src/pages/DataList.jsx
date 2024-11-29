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

function DataList() {
  const { width } = useWindowDimensions(); 
  const [loading, setLoading] = React.useState(true);
  const [getSearch, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem('UTK');
  const queryClient = useQueryClient();

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

  function capitalizeWords(string) {
    let container = string.toLowerCase();
    return container.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  const paginatedData = filteredData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="mx-[1%] my-[2%] xs1:my-[-35%] xs1:my-[-35%] xs:my-[-30%] sm:my-[0%] md:my-[2%] overflow-hidden">
      <div className="flex flex-row gap-3">
        <MdOutlineManageAccounts style={{ fontSize: '40px', color: '#483d8b' }} hidden />
        <Typography.Title level={2}>{PathName(localStorage.getItem('SP'))}</Typography.Title>
      </div>
      <Divider />
      <Button type="primary" onClick={() => { navigate(`${localStorage.getItem('SP')}/12/tab=1`) }} hidden>TEST</Button>

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

      <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
        <Spin spinning={AppDataListQuery.isFetching} tip={<span style={{ color: 'rgb(59,7,100)' }}>Please wait...</span>} className="flex justify-center items-center" size="large">
          <div className="flex flex-wrap gap-4 max-h-[420px] xs1:max-h-[400px] xs2:max-h-[350px] xs:max-h-[420px] sm:max-h-[420px] overflow-y-auto justify-center items-center">
            {width < 640 ? (
              <div className="w-full">
                {paginatedData?.length === 0 ? (
                  <div className="w-full flex justify-center items-center mt-5">
                    <Typography.Text className="text-center font-bold">No Data Available</Typography.Text>
                  </div>
                ) : (
                  paginatedData?.map((x, i) => (
                    <div className="my-2" key={i}>
                      <div className="w-full my-2 p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <span className="font-bold text-[13px] xs1:text-[12px] xs2:text-[14px]">LA Number:</span>
                          <Button
                            type="link"
                            className="text-cyan-600 font-bold text-lg"
                            onClick={() => {
                              localStorage.setItem('SIDC', toEncrypt(x.loanAppId));
                              localStorage.setItem('activeTab', 'deduplication');
                              navigate(`${localStorage.getItem('SP')}/${x.loanAppCode}/deduplication`);
                              queryClient.invalidateQueries({ queryKey: ['getRemarks', x.loanAppCode] }, { exact: true });
                            }}
                          >
                            <span className="text-cyan-600">
                              {x.loanAppCode}
                            </span>
                          </Button>
                        </div>
                        <div className="mt-1">
                          <span className="font-bold text-lg xs1:text-xs xs2:text-[12px] xs:text-md">Loan Product:</span> {` ${x.loanProduct}`}
                        </div>
                        <div className="mt-1">
                          <span className="font-bold text-lg xs1:text-xs xs2:text-[12px] xs:text-md">OFW:</span> {` ${x.borrowersFullName}`}
                        </div>
                        <div className="mt-1">
                          <span className="font-bold text-lg xs1:text-xs xs2:text-[12px] xs:text-md">Status:</span> {` ${capitalizeWords(x.statusName)}`}
                        </div>
                        <div className="mt-1">
                          <span className="font-bold text-lg xs1:text-xs xs2:text-[12px] xs:text-md">Latest Internal Remarks:</span> {` ${x.remarksIn}`}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : null}
            {width >= 640 && (
              <div className="w-full">
                <ResponsiveTable
                  columns={ColumnList(3, AppDataListQuery)}
                  height={'calc(95vh - 505px)'}
                  width={'100%'}
                  rows={AppDataListQuery.data?.filter((x) =>
                    x.loanAppCode.includes(getSearch) ||
                    x.recDate.includes(getSearch) ||
                    x.loanProduct.toUpperCase().includes(getSearch) ||
                    x.borrowersFullName.toUpperCase().includes(getSearch) ||
                    x.departureDate.includes(getSearch) ||
                    x.beneficiaryFullName.toUpperCase().includes(getSearch) ||
                    x.consultant.toUpperCase().includes(getSearch) ||
                    x.loanType.toUpperCase().includes(getSearch) ||
                    x.branch.toUpperCase().includes(getSearch)
                  ).map((x, i) => ({
                    key: i,
                    NO: i + 1,
                    LAN: <Button key={i} onClick={() => {
                      localStorage.setItem('SIDC', toEncrypt(x.loanAppId));
                      localStorage.setItem('activeTab', 'deduplication')
                      navigate(`${localStorage.getItem('SP')}/${x.loanAppCode}/deduplication`)
                      queryClient.invalidateQueries({ queryKey: ['getRemarks', x.loanAppCode] }, { exact: true })
                    }} type="link">{x.loanAppCode}</Button>,
                    DOA: moment(x.recDate).format('MM/DD/YYYY'),
                    LP: x.loanProduct,
                    OFW: x.borrowersFullName,
                    OFWDD: x.departureDate,
                    BENE: x.beneficiaryFullName,
                    LC: x.consultant,
                    LT: x.loanType,
                    LB: x.branch,
                    STAT: x.statusName,
                    UB: x.modUser,
                    LIR: x.remarksIn
                  }))} />
              </div>
            )}
          </div>
          {filteredData?.length > 0 && width < 640 && (
            <div className="w-full flex justify-center sticky bottom-0 bg-stone-100 z-10 py-2">
              <Pagination
                current={currentPage}
                total={filteredData?.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </Spin>
      </ConfigProvider>
    </div>
  );
}

export default DataList;
