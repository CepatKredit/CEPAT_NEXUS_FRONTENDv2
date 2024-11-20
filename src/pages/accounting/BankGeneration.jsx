import * as React from "react";
import { Typography, Input, Button, Tabs, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PathName, TileNumber } from "@utils/Conditions";
import { ColumnList } from "@utils/TableColumns";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { GET_LIST } from "@api/base-api/BaseApi";
import moment from "moment";
import { toEncrypt } from "@utils/Converter";
import BatchList from "./bankGeneration/BatchList";
import { BatchModal } from "@hooks/ModalController";
import ResponsiveModal from "@components/global/ResponsiveModal";
import CreateBatch from "@containers/bankGeneration/CreateBatch";

function BankGeneration() {
    const [getSearch, setSearch] = React.useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("UTK");

    React.useEffect(() => {
        AppDataListQuery.refetch();
    }, [localStorage.getItem("SP")]);
    const AppDataListQuery = useQuery({
        queryKey: ["AppDataListQuery"],
        queryFn: async () => {
            const result = await GET_LIST(
                `/api/v1/GET/G2AD/${jwtDecode(token).USRID}/${TileNumber(localStorage.getItem("SP"))}`
            );
            return result.list;
        },
        enabled: true,
        refetchInterval: 60 * 1000,
        retryDelay: 1000,
        staleTime: 5 * 1000,
    });

    const [getBL, setBL] = React.useState([])
    const rowSelection = {
        getBL,
        onChange: (e) => { setBL(e) },
    };

    const { modalStatus, setStatus } = BatchModal()

    const tabList = [
        {
            label: 'Disburstment List',
            key: 'disburstment-list',
            children: (<>
                <div className="flex flex-rows pb-2 min-w-[30%] float-end">
                    <Button className='h-[2.5rem] mx-3' type='primary' onClick={() => { setStatus(true) }} >Create Batch</Button>
                    <Input className='w-[100%]'
                        addonAfter={<SearchOutlined />}
                        placeholder="Search"
                        size="large"
                        onChange={(e) => {
                            setSearch(e.target.value.toUpperCase());
                        }}
                        value={getSearch} />
                </div>
                <Table
                    rowSelection={rowSelection}
                    size='small'
                    columns={ColumnList('BANK-GENERATION')}
                    scroll={{ y: 'calc(100vh - 505px)', x: '100%' }}
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
                                        navigate(`${localStorage.getItem("SP")}/${x.loanAppCode}/acc-uploaded-files`);
                                    }}
                                    type="link" >
                                    {x.loanAppCode}
                                </Button>
                            ),
                            DOA: moment(x.recDate).format("MM/DD/YYYY"),
                            LP: x.loanProduct,
                            OFW: x.borrowersFullName,
                            OFWDD: x.departureDate,
                            BENE: x.beneficiaryFullName,
                            LC: x.consultant,
                            LT: x.loanType,
                            LB: x.branch,
                            STAT: x.status,
                            UB: x.modUser,
                            LIR: x.remarksIn,
                        }))}
                />
            </>)
        },
        {
            label: 'Batch List',
            key: 'batch-list',
            children: (<BatchList />)
        }
    ]

    return (
        <div className="mx-[1%] my-[2%]">
            <ResponsiveModal showModal={modalStatus} closeModal={() => { setStatus(false) }} modalTitle={<span>Create Batch</span>}
                modalWidth={'200px'} contextHeight={'h-[500px]'} contextInside={<CreateBatch />} />
            <div className="flex flex-row gap-3">
                <Typography.Title level={2}>
                    {PathName(localStorage.getItem("SP"))}
                </Typography.Title>
            </div>
            <Tabs defaultActiveKey='client-list' items={tabList} />
        </div>
    );
}

export default BankGeneration