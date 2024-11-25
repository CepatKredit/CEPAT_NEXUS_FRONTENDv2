import React, { useContext, useEffect } from 'react'
import { Table, Divider, Tag, Button, ConfigProvider } from 'antd'; 
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toDecrypt, toEncrypt } from '@utils/Converter';
import { GET_LIST } from '@api/base-api/BaseApi';
import { jwtDecode } from 'jwt-decode';
import { TileNumber } from '@utils/Conditions';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function WildSearch() {
    const { userID, searchValue } = useParams();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient()
    const navigate = useNavigate();;

    const { data: getData = [], isFetching } = useQuery({
        queryKey: ["wildSearch", userID, searchValue],
        queryFn: async () => {
          const { data } = await axios.get(`/wild-search/${userID}/${searchValue}`);
          return data.map((item) => ({
            key: item.key,           
            loanAppId: item.loanAppId,
            loanAppCode: item.loanAppCode,
            borrowersFullName: item.borrowersFullName,
            status: item.status,
          }));
        },
        enabled: !!userID && !!searchValue
      });

      const columns = [
        {
            title: "Loan Application Number",
            dataIndex: "loanAppCode",
            key: "loanAppCode",
            render: (loanAppCode, record) => {
                return (
                    <Button
                    key={record.key}    
                        onClick={() => {
                                localStorage.setItem("SIDC", toEncrypt(record.loanAppId));
                            localStorage.setItem("activeTab", "deduplication");
                            navigate(`${localStorage.getItem("SP")}/${loanAppCode}/deduplication`);
                            queryClient.invalidateQueries({
                                queryKey: ["GET/G37R", loanAppCode],
                                exact: true,
                            });
                        }}
                        type="link"
                    >
                        {loanAppCode}
                    </Button>
                );
            }
        },
        {
            title: "Borrower's Full Name",
            dataIndex: "borrowersFullName",
            key: "borrowersFullName",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "green";
                if (status === "RECEIVED") color = "blue";
                else if (status === "PENDING") color = "orange";
                else if (status === "DECLINED") color = "volcano";

                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
    ];


  return (
    <ConfigProvider theme={{ token: { colorPrimary: "rgb(86,191,84)"} }}>
    <div className="p-[2%] ">
        <Table dataSource={getData} columns={columns} loading={isFetching} />
    </div>
    </ConfigProvider>
  )
}

export default WildSearch