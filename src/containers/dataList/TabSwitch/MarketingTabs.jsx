import * as React from "react";
import { Tabs } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { GrDuplicate } from "react-icons/gr";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BsFileEarmarkPerson } from "react-icons/bs";
import { AiOutlineAudit } from "react-icons/ai";
import { MdOutlineUploadFile } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineUpdate } from "react-icons/md";
import { IoTrailSign } from "react-icons/io5";
import { FloatButton } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import Deduplication from "../TabList/Deduplication";
import LoanDetails from "../TabList/LoanDetails";
import OfwDetails from "../TabList/OfwDetails";
import BeneficiaryDetails from "../TabList/BeneficiaryDetails";
import InternalChecking from "../TabList/InternalChecking";
import UploadDocs from "../TabList/UploadDocs";
import CharacterReference from "../TabList/CharacterReference";
import LastUpdateBy from "../TabList/LastUpdateBy";
import AuditTrail from "../TabList/AuditTrail";
import { GetData } from "@utils/UserData";
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import TriggerFields from "@utils/TriggerFields";


function MarketingTabs({
  value,
  ClientId,
  FileType,
  Uploader,
  BorrowerId,
  presaddress,
  sepcoborrowfname,
  sepBenfname,
  LoanStatus,
}) {
  const { id, tabs } = useParams();
  const navigate = useNavigate();
  const [isEdit, setEdit] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState(
    localStorage.getItem("activeTab") || "deduplication"
  );
  const { updateAppDetails } = React.useContext(LoanApplicationContext)

  function onChangeTab(e) {
    //VALIDATION - Check if the current items is equal to the initial values? change to other tab : open modal confirmation( yes/no? reset values to initial : stop going to tab/ continue in current tab)
    //if(validate)
    setActiveKey(e);
    localStorage.setItem("activeTab", e);
    navigate(`${localStorage.getItem("SP")}/${id}/${e}`);
  }

  TriggerFields('MARKETING');
  
  const TabsItems = [
    {
      label: (
        <div className="flex flex-rows">
          <GrDuplicate style={{ fontSize: "20px", marginRight: 5 }} />
          <span>Deduplication</span>
        </div>
      ),
      key: "deduplication",
      children: (
        <Deduplication classname={"h-[66vh] overflow-y-auto"} data={value} />
      ),
    },
    {
      label: (
        <div className="flex flex-rows">
          <BsFileEarmarkBarGraph style={{ fontSize: "20px", marginRight: 5 }} />
          <span>Loan Details</span>
        </div>
      ),
      key: "loan-details",
      children: (
        <LoanDetails
          activeKey={activeKey}
          classname={"h-[14rem]"}
          data={value}
          receive={(e) => {
            updateAppDetails(e);
          }}
          isEdit={isEdit}
          User={"MARKETING"}
        />
      ),
    },
    {
      label: (
        <div className="flex flex-rows">
          <BsFillPersonLinesFill style={{ fontSize: "20px", marginRight: 5 }} />
          <span>OFW Details</span>
        </div>
      ),
      key: "ofw-details",
      children: (
        <OfwDetails
          activeKey={activeKey}
          classname={"h-[14rem]"}
          presaddress={presaddress}
          data={value}
          receive={(e) => {
            updateAppDetails(e);
          }}
          BorrowerId={BorrowerId}
          User={"MARKETING"}
        />
      ),
    },
    {
      label: (
        <div className="flex flex-rows">
          <BsFileEarmarkPerson style={{ fontSize: "20px", marginRight: 5 }} />
          <span>Beneficiary Details</span>
        </div>
      ),
      key: "beneficiary-details",

      children: (
        <BeneficiaryDetails
          activeKey={activeKey}
          presaddress={presaddress}
          classname={"h-[14rem]"}
          data={value}
          receive={(e) => {
            updateAppDetails(e);
          }}
          BorrowerId={BorrowerId}
          isEdit={isEdit}
          sepcoborrowfname={sepcoborrowfname}
          sepBenfname={sepBenfname}
          User={"MARKETING"}
        />
      ),
    },
    {
      label: (
        <div className="flex flex-rows">
          <AiOutlineAudit style={{ fontSize: "20px", marginRight: 5 }} />
          <span>Internal Checking</span>
        </div>
      ),
      key: "internal-checking",
      children: (
        <InternalChecking
          classname={"h-[65vh] w-[80vw] mx-auto overflow-y-auto"}
          data={value}
          isEdit={isEdit}
          ClientId={ClientId}
          Uploader={Uploader}
          sepcoborrowfname={sepcoborrowfname}
          FileType={FileType}
          receive={(e) => {
            updateAppDetails(e);
          }}
        />
      ),
    },
    {
      label: (
        <div className="flex flex-rows">
          <MdOutlineUploadFile style={{ fontSize: "20px", marginRight: 5 }} />
          <span>Upload Documents</span>
        </div>
      ),
      key: "upload-documents",
      children: (
        <UploadDocs
          classname={
            "xs:h-[45vh] sm:h-[50vh] md:h-[20vh] lg:h-[60vh] xl:h-[70vh] 2xl:h-[43vh] 3xl:h-[52vh] pt-[.5rem] overflow-y-hidden hover:overflow-y-auto"
          }
          Display={"USER"}
          ClientId={ClientId}
          FileType={FileType}
          Uploader={Uploader}
          data={value}
          LoanStatus={LoanStatus}
        />
      ),
    },
    {
      label: (
        <div className="flex flex-rows">
          <FaUserGroup style={{ fontSize: "20px", marginRight: 5 }} />
          <span>Character Reference</span>
        </div>
      ),
      key: "character-reference",
      children: (
        <CharacterReference
          BorrowerId={BorrowerId}
          Creator={Uploader}
          data={value}
          LoanStatus={LoanStatus}
        />
      ),
    },
    {
      label: (
        <div className="flex flex-rows">
          <MdOutlineUpdate style={{ fontSize: "20px", marginRight: 5 }} />
          <span>Update Status</span>
        </div>
      ),
      key: "last-update-by",
      children: <LastUpdateBy isEdit={isEdit} data={value} />,
    },
    {
      label: (
        <div className="flex flex-rows">
          <IoTrailSign style={{ fontSize: "20px", marginRight: 5 }} />
          <span>Audit Trail</span>
        </div>
      ),
      key: "audit-trail",
      children: <AuditTrail isEdit={isEdit} />,
    },
  ];

  React.useEffect(() => {
    setActiveKey(tabs || 'deduplication');
    console.log("HALAAA", tabs)
}, [tabs]);

  return (
    <>
      <Tabs
        activeKey={activeKey}
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

export default MarketingTabs;
