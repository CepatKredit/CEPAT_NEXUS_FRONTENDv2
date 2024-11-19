import * as React from "react";
import { Tabs, Space, Anchor, FloatButton } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import UploadDocs from "../TabList/UploadDocs";
import LoanDetails from "../TabList/LoanDetails";
import AccountingLoanDetails from "../TabList/AccountingLoanDetails";
import ResponsiveTable from "@components/global/ResponsiveTable";
import ReleaseDocuments from "../TabList/ReleaseDocuments";

function AccountingTabs({
  value,
  ClientId,
  FileType,
  Uploader,
  LoanStatus,
}) {
  const { id, tabs } = useParams();
  const navigate = useNavigate();
  const [getTab, setTab] = React.useState();
  function onChangeTab(e) {
    setTab(e);
    navigate(`${localStorage.getItem("SP")}/${id}/${e}`);
  }

  const column_Recipient = [
    {
      title: "#",
      dataIndex: "NO",
      key: "NO",
      width: "40px",
      align: "center",
      fixed: "left",
    },
    {
      title: "Recipient Name",
      dataIndex: "OFW",
      key: "OFW",
      width: "300px",
      sorter: (a, b) => {
        return a?.OFW?.localeCompare(b?.OFW);
      },
      align: "center",
    },
    {
      title: "Bank Name",
      dataIndex: "BENE",
      key: "BENE",
      width: "300px",
      sorter: (a, b) => {
        return a.BENE.localeCompare(b.BENE);
      },
      align: "center",
    },
    {
      title: "Bank Account Number",
      dataIndex: "STAT",
      key: "STAT",
      width: "200px",
      sorter: (a, b, c) => {
        return c;
      },
      align: "center",
    },
    {
      title: "Amount to Credit",
      dataIndex: "DOA",
      key: "DOA",
      width: "100px",
      sorter: (a, b) => {
        return a.DOA.localeCompare(b.DOA);
      },
      align: "center",
    },
    {
      title: "Credited Date",
      dataIndex: "STAT",
      key: "STAT",
      width: "120px",
      sorter: (a, b, c) => {
        return c;
      },
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "STAT",
      key: "STAT",
      width: "100px",
      sorter: (a, b, c) => {
        return c;
      },
      align: "center",
    },
  ];

  const column_Commissions = [
    {
      title: "#",
      dataIndex: "NO",
      key: "NO",
      width: "40px",
      align: "center",
      fixed: "left",
    },
    {
      title: "Loan Consultant Name",
      dataIndex: "OFW",
      key: "OFW",
      width: "300px",
      sorter: (a, b) => {
        return a?.OFW?.localeCompare(b?.OFW);
      },
      align: "center",
    },
    {
      title: "Bank Name",
      dataIndex: "BENE",
      key: "BENE",
      width: "300px",
      sorter: (a, b) => {
        return a.BENE.localeCompare(b.BENE);
      },
      align: "center",
    },
    {
      title: "Bank Account Number",
      dataIndex: "STAT",
      key: "STAT",
      width: "200px",
      sorter: (a, b, c) => {
        return c;
      },
      align: "center",
    },
    {
      title: "Commission to Credit",
      dataIndex: "DOA",
      key: "DOA",
      width: "100px",
      sorter: (a, b) => {
        return a.DOA.localeCompare(b.DOA);
      },
      align: "center",
    },
    {
      title: "Credited Date",
      dataIndex: "STAT",
      key: "STAT",
      width: "120px",
      sorter: (a, b, c) => {
        return c;
      },
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "STAT",
      key: "STAT",
      width: "100px",
      sorter: (a, b, c) => {
        return c;
      },
      align: "center",
    },
  ];

  const TabsItems = [
    {
      label: (
        <div className="flex flex-rows">
          <span>Uploaded Files</span>
        </div>
      ),
      key: "acc-uploaded-files",
      children: (
        <Space>
          <div className="container mt-1 mx-auto p-5 bg-white rounded-xl shadow-lg w-[80vw] h-[40rem] overflow-y-auto">
            <AccountingLoanDetails data={value} />
            <h2 className="text-2xl font-bold text-center mt-5">
              Uploaded Documents
            </h2>
            <ReleaseDocuments
              classname="pt-5"
              Display={"USER"}
              ClientId={ClientId}
              FileType={FileType}
              Uploader={Uploader}
              data={value}
              LoanStatus={LoanStatus}
              isAccounting={true}
            />
          </div>
        </Space>
      ),
    },
    {
      label: (
        <div className="flex flex-rows">
          <span>Loan Details</span>
        </div>
      ),
      key: "acc-loan-details",
      children: (
        <Space>
          <div className="container mt-1 mx-auto p-5 bg-white rounded-xl shadow-lg w-[80vw] h-[40rem] overflow-y-auto">
            <AccountingLoanDetails data={value} isShowAmount={true} />
            <div className="pt-3">
              <h2 className="text-xl font-bold text-center mt-5 mb-5">
                Recipient Details
              </h2>
              <ResponsiveTable
                columns={column_Recipient}
                height={"calc(100vh - 505px)"}
                width={"100%"}
              />
            </div>
            <div className="pt-3">
              <h2 className="text-xl font-bold text-center mt-5 mb-5">
                Commission Details
              </h2>
              <ResponsiveTable
                columns={column_Commissions}
                height={"calc(100vh - 505px)"}
                width={"100%"}
              />
            </div>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Tabs
        onChange={onChangeTab}
        tabPosition="top"
        defaultActiveKey={tabs}
        type="card"
        size="middle"
        items={TabsItems}
      />
    </>
  );
}
export default AccountingTabs;