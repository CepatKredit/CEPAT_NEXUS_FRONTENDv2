import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Typography,
  Layout,
  Tabs,
  Card,
  Space,
  Input,
  Spin,
  ConfigProvider,
  Flex,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LoanDetails from "@containers/loanApplicationStatus/LoanDetails";
import OfwDetails from "@containers/loanApplicationStatus/OfwDetails";
import BeneficiaryDetails from "@containers/loanApplicationStatus/BeneficiaryDetails";
import {
  FileOutlined,
  UserOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import UploadDocs from "@containers/dataList/TabList/UploadDocs";
import CharacterReference from "@containers/dataList/TabList/CharacterReference";
import SectionHeader from "@components/loanApplication/SectionHeader";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toDecrypt } from "@utils/Converter";
import createInitialAppDetails from "@utils/IntialValues";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { LiaClipboardSolid } from "react-icons/lia";
import { message } from "antd";

const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
function LoanApplicationTracker({ data }) {
  const navigate = useNavigate();
  const skipRender = useRef(false);
  // const [getAppDetails, setAppDetails] = React.useState(createInitialAppDetails(false));
  const {
    getAppDetails,
    setAppDetails,
    resetAppDetails,
    setOldClientNameAndBDay,
    populateClientDetails,
    getOldData,
    api,
  } = React.useContext(LoanApplicationContext);

  React.useEffect(() => {
    function unloadCallBack(e) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", unloadCallBack);
    return () => window.removeEventListener("beforeunload", unloadCallBack);
  }, []);

  React.useEffect(() => {
    ClientData.refetch();
  }, [localStorage.getItem("CLID")]);
  const [messageApi, contextHolder] = message.useMessage();
  const textAreaRef = React.useRef(null);

  const handleCopyToClipboard = (e) => {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
  
    messageApi.open({
      type: "info",
      content: "Copied to clipboard!",
      duration: 0.6,
    });
  };

  // const [getOldData, setOldData] = React.useState({
  //   FirstName: "",
  //   LastName: "",
  //   Suffix: 1,
  //   Birthday: "",
  // });

  const ClientData = useQuery({
    queryKey: ["ClientDataQuery"],
    queryFn: async () => {
      const result = await axios.get(
        `/GET/G3CD/${toDecrypt(localStorage.getItem("CLID"))}`
      );
      setOldClientNameAndBDay(result);
      populateClientDetails(result);
      console.log("LOANTRACKKK", result.data.list);
      return result.data.list;
    },
    enabled: true,
    retryDelay: 1000,
  });

  const getRemarks = useQuery({
    queryKey: ["getRemarks", getAppDetails.loanIdCode],
    queryFn: async () => {
      if (!getAppDetails.loanIdCode) {
        return { remarksEx: "" };
      }
      try {
        const result = await axios.get(
          `/GET/G37R/${getAppDetails.loanIdCode}`
        );
        return result?.data?.list?.[0] || { remarksEx: "" };
      } catch (error) {
        console.error("Failed to fetch remarks:", error);
        return { remarksEx: "" };
      }
    },
    enabled: true,
    retryDelay: 1000,
  });

  const prevResidencesRef = useRef();
  useEffect(() => {
    if (
      prevResidencesRef.current !== undefined &&
      getAppDetails.ofwresidences === "" &&
      getAppDetails.ofwresidences === 3
    ) {
      setAppDetails((prev) => ({
        ...prev,
        ofwrent: "",
      }));
    }
    prevResidencesRef.current = getAppDetails.ofwresidences;
  }, [getAppDetails.ofwresidences]);

  React.useEffect(() => {
    console.log("STATUS", getAppDetails.loanStatus, "DATAA",getRemarks.data)
    ClientData.refetch();
  }, [])

  React.useEffect(() => {
    if (skipRender.current) {
      setAppDetails((prevDetails) => {
        let updatedFields = {};
        let clearDeployDate = {};
        if (
          getAppDetails.loanProd == '"0303-WL' ||
          getAppDetails.loanProd == "0303-VL" ||
          getAppDetails.loanProd == "0303-DHW"
        ) {
          clearDeployDate = {
            ...clearDeployDate,
            loanDateDep: "",
          };
        }
        if (
          getAppDetails.loanProd === "0303-DH" ||
          getAppDetails.loanProd === "0303-DHW"
        ) {
          updatedFields = {
            ...updatedFields,
            ofwjobtitle: "DOMESTIC HELPER",
          };
        } else {
          updatedFields = {
            ...updatedFields,
            ofwjobtitle: "",
          };
        }
        return {
          ...prevDetails,
          ...updatedFields,
          ...clearDeployDate,
        };
      });
    } else {
      skipRender.current = true;
    }
  }, [getAppDetails.loanProd]);

  function getStatusBackgroundColor(status) {
    switch (status) {
      case "RECEIVED":
        return "bg-[#29274c] text-white";
      case "COMPLIED-LACK OF DOCUMENTS":
        return "bg-[#ff8c00] text-white";
      case "FOR WALK-IN":
        return "bg-[#3bceac] text-white";
      case "FOR INITIAL INTERVIEW":
        return "bg-[#532b88] text-white";
      case "REASSESSED TO MARKETING":
        return "bg-[#DB7093] text-white";
      case "LACK OF DOCUMENTS":
        return "bg-[#8B4513] text-white";
      case "FOR CREDIT ASSESSMENT":
        return "bg-[#006d77] text-white";
      case "CREDIT ASSESSMENT SPECIAL LANE":
        return "bg-[#ff5400] text-white";
      case "FOR VERIFICATION":
        return "bg-[#80b918] text-white";
      case "FOR APPROVAL":
        return "bg-[#20b2aa] text-white";
      case "APPROVED (TRANS-OUT)":
        return "bg-[#b5179e] text-white";
      case "UNDER LOAN PROCESSOR":
        return "bg-[#ffd700] text-white";
      case "FOR DOCUSIGN":
        return "bg-[#008080] text-white";
      case "RETURNED FROM MARKETING":
        return "bg-[#7b68ee] text-white";
      case "FOR DISBURSEMENT":
        return "bg-[#cd5c5c] text-white";
      case "RELEASED":
        return "bg-[#006400] text-white";
      case "CANCELLED":
        return "bg-[#1c1c1c] text-white";
      case "DECLINED":
        return "bg-[#FF0000] text-white";
      case "FOR RE-APPLICATION":
        return "bg-[#708090] text-white";
      case "RETURN TO CREDIT OFFICER":
        return "bg-[#720026] text-white";
      case "RETURN TO CREDIT ASSOCIATE":
        return "bg-[#2d6a4f] text-white";
      case "REASSESSED TO CREDIT ASSOCIATE":
        return "bg-[#6d597a] text-white";
      case "REASSESSED TO CREDIT OFFICER":
        return "bg-[#ff0054] text-white";
      case "RETURN TO LOANS PROCESSOR":
        return "bg-[#ff7f50] text-white";
      case "OK FOR DOCUSIGN":
        return "bg-[#c77dff] text-white";
      case "ON WAIVER":
        return "bg-[#2196f3] text-white";
      case "CONFIRMATION":
        return "bg-[#228b22] text-white";
      case "CONFIRMED":
        return "bg-[#32cd32] text-white";
      case "UNDECIDED":
        return "bg-[#ff7f50] text-white";
      case "PRE-CHECK":
        return "bg-[#3d5a80] text-white";
      default:
        return "bg-blue-500 text-white";
    }
  }

  const items = [
    {
      key: "Details",
      label: (
        <span>
          <SolutionOutlined style={{ marginRight: 8 }} />
          Details
        </span>
      ),
      children: (
        <div className="max-h-[calc(80vh-220px)] overflow-y-auto pr-2 sm:max-h-[calc(90vh-200px)] md:max-h-[calc(90vh-200px)] lg:max-h-[calc(90vh-220px)] xl:max-h-[calc(90vh-220px)]">
          <Card bordered={false}>
            <SectionHeader borrower="Loan Details" />
            <LoanDetails
            // data={getAppDetails}
            // receive={(e) => {
            //   setAppDetails({
            //     ...getAppDetails,
            //     [e.name]: e.value,
            //   });
            // }}
            // loancases={(e) => {
            //   setAppDetails((details) => {
            //     let updatedFields = {};
            //     switch (e.name) {
            //       case "resetDepartureDate":
            //         updatedFields = {
            //           loanDateDep: "",
            //         };
            //         break;
            //       default:
            //         break;
            //     }
            //     return {
            //       ...details,
            //       [e.name]: e.value,
            //       ...updatedFields,
            //     };
            //   });
            // }}
            />
          </Card>
          {getAppDetails.loanProd === "0303-DHW" ||
          getAppDetails.loanProd === "0303-VL" ||
          getAppDetails.loanProd === "0303-WL" ? (
            <>
              <Card bordered={false}>
                <SectionHeader
                  title="(OFW Details)"
                  borrower="Principal Borrower"
                />
                <OfwDetails
                  data={getAppDetails}
                  OldData={getOldData}
                  // receive={(e) => {
                  //   setAppDetails({
                  //     ...getAppDetails,
                  //     [e.name]: e.value,
                  //   });
                  // }}
                  // presaddress={(e) => {
                  //   setAppDetails((prevDetails) => {
                  //     let updatedFields = {};
                  //     switch (e.name) {
                  //       case "ofwPresProv":
                  //         updatedFields = {
                  //           ofwPresMunicipality: "",
                  //           ofwPresBarangay: "",
                  //           ofwPresStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPresMunicipality":
                  //         updatedFields = {
                  //           ofwPresBarangay: "",
                  //           ofwPresStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPresBarangay":
                  //         updatedFields = {
                  //           ofwPresStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPermProv":
                  //         updatedFields = {
                  //           ofwPermMunicipality: "",
                  //           ofwPermBarangay: "",
                  //           ofwPermStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPermMunicipality":
                  //         updatedFields = {
                  //           ofwPermBarangay: "",
                  //           ofwPermStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPermBarangay":
                  //         updatedFields = {
                  //           ofwPermStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPerm":
                  //         updatedFields = {
                  //           ofwPermProv: getAppDetails.ofwPresProv,
                  //           ofwPermMunicipality:
                  //             getAppDetails.ofwPresMunicipality,
                  //           ofwPermBarangay: getAppDetails.ofwPresBarangay,
                  //           ofwPermStreet: getAppDetails.ofwPresStreet,
                  //         };
                  //         break;
                  //       case "ofwSameAdd":
                  //         updatedFields = {
                  //           ofwPermProv: "",
                  //           ofwPermMunicipality: "",
                  //           ofwPermBarangay: "",
                  //           ofwPermStreet: "",
                  //         };
                  //         break;
                  //       case "resetMiddleName":
                  //         updatedFields = {
                  //           ofwmname: "",
                  //         };
                  //         break;
                  //       default:
                  //         break;
                  //     }
                  //     return {
                  //       ...prevDetails,
                  //       [e.name]: e.value,
                  //       ...updatedFields,
                  //     };
                  //   });
                  // }}
                />
              </Card>
              <Card bordered={false}>
                <SectionHeader
                  title="(Beneficiary Details)"
                  borrower="Co-Borrower"
                />
                <BeneficiaryDetails
                  data={getAppDetails}
                  receive={(e) => {
                    setAppDetails({
                      ...getAppDetails,
                      [e.name]: e.value,
                    });
                  }}
                  presaddress={(e) => {
                    setAppDetails((prevDetails) => {
                      let updatedFields = {};
                      switch (e.name) {
                        case "resetMiddleName":
                          updatedFields = { ofwmname: "" };
                          break;
                        case "benpres":
                          updatedFields = {
                            benpresprov: getAppDetails.ofwPresProv,
                            benpresmunicipality:
                              getAppDetails.ofwPresMunicipality,
                            benpresbarangay: getAppDetails.ofwPresBarangay,
                            benpresstreet: getAppDetails.ofwPresStreet,
                          };
                          break;
                        case "bensameadd":
                          updatedFields = {
                            benpresprov: "",
                            benpresmunicipality: "",
                            benpresbarangay: "",
                            benpresstreet: "",
                          };
                          break;
                        case "benpresprov":
                          updatedFields = {
                            benpresmunicipality: "",
                            benpresbarangay: "",
                            benpresstreet: "",
                          };
                          break;
                        case "benpresmunicipality":
                          updatedFields = {
                            benpresbarangay: "",
                            benpresstreet: "",
                          };
                          break;
                        case "benpresbarangay":
                          updatedFields = {
                            benpresstreet: "",
                          };
                          break;
                        case "resetBenMiddleName":
                          updatedFields = {
                            benmname: "",
                          };
                          break;
                        default:
                          break;
                      }
                      return {
                        ...prevDetails,
                        [e.name]: e.value,
                        ...updatedFields,
                      };
                    });
                  }}
                />
              </Card>
            </>
          ) : (
            <>
              <Card bordered={false}>
                <SectionHeader
                  title="(Beneficiary Details)"
                  borrower="Principal Borrower"
                />
                <BeneficiaryDetails
                  data={getAppDetails}
                  receive={(e) => {
                    setAppDetails({
                      ...getAppDetails,
                      [e.name]: e.value,
                    });
                  }}
                  presaddress={(e) => {
                    setAppDetails((prevDetails) => {
                      let updatedFields = {};
                      switch (e.name) {
                        case "resetMiddleName":
                          updatedFields = { ofwmname: "" };
                          break;
                        case "benpres":
                          updatedFields = {
                            benpresprov: getAppDetails.ofwPresProv,
                            benpresmunicipality:
                              getAppDetails.ofwPresMunicipality,
                            benpresbarangay: getAppDetails.ofwPresBarangay,
                            benpresstreet: getAppDetails.ofwPresStreet,
                          };
                          break;
                        case "bensameadd":
                          updatedFields = {
                            benpresprov: "",
                            benpresmunicipality: "",
                            benpresbarangay: "",
                            benpresstreet: "",
                          };
                          break;
                        case "benpresprov":
                          updatedFields = {
                            benpresmunicipality: "",
                            benpresbarangay: "",
                            benpresstreet: "",
                          };
                          break;
                        case "benpresmunicipality":
                          updatedFields = {
                            benpresbarangay: "",
                            benpresstreet: "",
                          };
                          break;
                        case "benpresbarangay":
                          updatedFields = {
                            benpresstreet: "",
                          };
                          break;
                        case "resetBenMiddleName":
                          updatedFields = {
                            benmname: "",
                          };
                          break;
                        default:
                          break;
                      }
                      return {
                        ...prevDetails,
                        [e.name]: e.value,
                        ...updatedFields,
                      };
                    });
                  }}
                />
              </Card>
              <Card bordered={false}>
                <SectionHeader title="(OFW Details)" borrower="Co-Borrower" />
                <OfwDetails
                  // OldData={getOldData}
                  data={getAppDetails}
                  // receive={(e) => {
                  //   setAppDetails({
                  //     ...getAppDetails,
                  //     [e.name]: e.value,
                  //   });
                  // }}
                  // presaddress={(e) => {
                  //   setAppDetails((prevDetails) => {
                  //     let updatedFields = {};
                  //     switch (e.name) {
                  //       case "ofwPresProv":
                  //         updatedFields = {
                  //           ofwPresMunicipality: "",
                  //           ofwPresBarangay: "",
                  //           ofwPresStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPresMunicipality":
                  //         updatedFields = {
                  //           ofwPresBarangay: "",
                  //           ofwPresStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPresBarangay":
                  //         updatedFields = {
                  //           ofwPresStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPermProv":
                  //         updatedFields = {
                  //           ofwPermMunicipality: "",
                  //           ofwPermBarangay: "",
                  //           ofwPermStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPermMunicipality":
                  //         updatedFields = {
                  //           ofwPermBarangay: "",
                  //           ofwPermStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPermBarangay":
                  //         updatedFields = {
                  //           ofwPermStreet: "",
                  //         };
                  //         break;
                  //       case "ofwPerm":
                  //         updatedFields = {
                  //           ofwPermProv: getAppDetails.ofwPresProv,
                  //           ofwPermMunicipality:
                  //             getAppDetails.ofwPresMunicipality,
                  //           ofwPermBarangay: getAppDetails.ofwPresBarangay,
                  //           ofwPermStreet: getAppDetails.ofwPresStreet,
                  //         };
                  //         break;
                  //       case "ofwSameAdd":
                  //         updatedFields = {
                  //           ofwPermProv: "",
                  //           ofwPermMunicipality: "",
                  //           ofwPermBarangay: "",
                  //           ofwPermStreet: "",
                  //         };
                  //         break;
                  //       case "resetMiddleName":
                  //         updatedFields = {
                  //           ofwmname: "",
                  //         };
                  //         break;
                  //       default:
                  //         break;
                  //     }
                  //     return {
                  //       ...prevDetails,
                  //       [e.name]: e.value,
                  //       ...updatedFields,
                  //     };
                  //   });
                  // }}
                />
              </Card>
            </>
          )}
        </div>
      ),
    },
    {
      key: "Documents",
      label: (
        <span>
          <FileOutlined style={{ marginRight: 8 }} />
          Documents
        </span>
      ),
      children: (
        <UploadDocs
          classname={
            "h-[50vh] mt-[.5rem] overflow-y-hidden hover:overflow-y-auto"
          }
          Display={""}
          ClientId={toDecrypt(localStorage.getItem("CLID"))}
          FileType={getAppDetails.loanProd}
          Uploader={getAppDetails.borrowersCode}
          LoanStatus={getAppDetails.loanStatus}
          isEdit={true}
        />
      ),
    },
    {
      key: "Character Reference",
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} /> Character Reference{" "}
        </span>
      ),
      children: (
        <CharacterReference
          BorrowerId={getAppDetails.borrowersCode}
          Creator={getAppDetails.borrowersCode}
          receive={(e) => {
            setAppDetails({
              ...getAppDetails,
              [e.name]: e.value,
            });
          }}
          isEdit={true}
          LoanStatus={getAppDetails.loanStatus}
        />
      ),
    },
  ];

  console.log()
  return (
    <ConfigProvider
      theme={{ components: { Spin: { colorPrimary: "rgb(86,191,84)" } } }}
    >
      {contextHolder}
      {ClientData.isFetching && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Spin
            spinning={ClientData.isFetching}
            tip="Please wait..."
            className="text-green-500"
          />
        </div>
      )}
      <Layout className="h-[100vh] bg-[#e8eee5] py-1">
        <Content className="w-full lg:w-[80vw] h-[120vh] mx-auto bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center space-x-3">
                <Button
                  className="h-[2rem]"
                  type="text"
                  icon={<LeftOutlined />}
                  onClick={() => {
                    // localStorage.removeItem('CLID');
                    resetAppDetails();
                    navigate("/");
                  }}
                />
                <Title level={3} className="h-[1.5rem]">
                  Loan Application Tracker
                </Title>
              </div>
              <div className="flex items-center">
                <div className="w-full sm:w-auto mt-0 sm:mt-[-0.5rem] md:mt-[-1rem] ml-0 sm:ml-4 md:ml-6 lg:ml-10">
                  <div
                    className={`inline-flex font-bold items-center px-4 sm:px-5 md:px-7 py-1 sm:py-2 rounded-full ${getStatusBackgroundColor(
                      getAppDetails.loanStatus
                    )}`}
                  >
                    {getAppDetails.loanStatus}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-start lg:items-center">
              <div className="w-full lg:w-auto mb-4 lg:mb-0">
                <Typography.Text type="secondary">
                  Loan Application ID
                </Typography.Text>

                <textarea
                  ref={textAreaRef}
                  value={getAppDetails.loanAppCode}
                  readOnly
                  className="absolute -left-full"
                />
                <Flex>
                  <Title level={4} className="m-0" style={{ color: "#34b330" }}>
                    {getAppDetails.loanAppCode}
                  </Title>
                  <Button
                    className="ml-2 cursor-pointer text-lg text-gray-600 hover:text-gray-800"
                    type="text"
                    size="small"
                    onClick={handleCopyToClipboard}
                  >
                    <LiaClipboardSolid />
                  </Button>
                </Flex>
              </div>
              <div className="flex flex-col w-full lg:w-auto mt-4 lg:mt-0 lg:ml-6">
                <label className="font-bold mb-2">External Remarks</label>
                <TextArea
                  className="w-full lg:w-[20rem] h-[80px] p-2 border border-gray-300 rounded-md"
                  style={{ resize: "none" }}
                  value={
                    getRemarks.data?.remarksEx ||
                    "No external remarks available"
                  }
                  readOnly
                />
              </div>
            </div>
          </div>
          <Tabs defaultActiveKey="Details" items={items} />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default LoanApplicationTracker;
