import * as React from "react";
import { Button, Input, Radio, Select, Space, Spin, notification } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateKey } from "@utils/Generate";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DisbursementList from "./DisbursementList";
import { useDataContainer } from "@context/PreLoad";
import { NameList } from "@utils/NameListNetProceed";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { useLocation } from "react-router-dom";
import { mmddyy, toDecrypt, toEncrypt } from "@utils/Converter";
import { GET_LIST } from "@api/base-api/BaseApi";

function NetProceeds({ data }) {
  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();
  const {
    getBank,
    getPurpose,
    SET_LOAN_APPLICATION_NUMBER,
    GET_TOTAL_AMOUNT,
    GET_REFRESH_LAN,
    SET_REFRESH_LAN,
  } = useDataContainer();
  const { getAppDetails, setAppDetails } = React.useContext(
    LoanApplicationContext
  );
  const nameListOptions = React.useMemo(
    () => NameList(getAppDetails),
    [getAppDetails]
  );
  const [getData, setData] = React.useState({
    PaymentType: "",
    FirstName: "",
    LastName: "",
    Suffix: "",
    BankName: "",
    BankAcctNo: "",
    Amount: "",//
    Type: "NP",
    Purpose: "",
    Status: "AVAILABLE",
  });

  React.useEffect(() => {
    GetClient.refetch();
    console.log("TRIGGER")
  }, [toDecrypt(localStorage.getItem("SIDC")), ]);

  const GetClient = useQuery({
    queryKey: ["ClientDataListQuery", toDecrypt(localStorage.getItem("SIDC"))],
    queryFn: async () => {
      const result = await GET_LIST(
        `/api/v1/GET/G3CD/${toDecrypt(localStorage.getItem("SIDC"))}`
      );
      const data = result.list;

      // Populate app details and old client data when data is fetched
      setAppDetails((prevDetails) => ({
        ...prevDetails,
        
        ofwfname: data?.OfwDetails?.firstName || "",
        ofwmname: data?.OfwDetails?.middleName || "",
        ofwlname: data?.OfwDetails?.lastName || "",
        ofwsuffix: data?.OfwDetails?.suffix || "",
        
        benfname: data?.BeneficiaryDetails?.firstName || "",
        benmname: data?.BeneficiaryDetails?.middleName || "",
        benlname: data?.BeneficiaryDetails?.lastName || "",
        bensuffix: data?.BeneficiaryDetails?.suffix || "",
        
        coborrowfname: data?.CoborrowDetails?.firstName || "",
        coborrowmname: data?.CoborrowDetails?.middleName || "",
        coborrowlname: data?.CoborrowDetails?.lastName || "",
        coborrowsuffix: data?.CoborrowDetails?.suffix || "",
        
      }));

      return data;
    },
    enabled: true,
  });


  React.useEffect(() => {
    SET_LOAN_APPLICATION_NUMBER(data.LAN.props.children);
    ComputeRemaining();
  }, [data]);

  const [getRemaining, setRemaining] = React.useState("");
  function ComputeRemaining() {
    let value =
      parseFloat(removeCommas(data.AA)) -
      parseFloat(removeCommas(GET_TOTAL_AMOUNT));
    setRemaining(value);
  }

  React.useEffect(() => {
    ComputeRemaining();
  }, [GET_REFRESH_LAN, GET_TOTAL_AMOUNT]);

  function BankList() {
    let container = [];
    getBank?.map((x) => {
      if (x.paymentType === getData.PaymentType) {
        container.push(x);
      }
    });
    return container;
  }

  function GetBankCode(container) {
    const BankCode = getBank.find(
      (x) => x.code === container || x.description === container
    );
    return BankCode.code;
  }

  function GetPurposeCode(container) {
    const PurposeCode = getPurpose.find(
      (x) => x.code === container || x.description === container
    );
    return PurposeCode.code;
  }

  function formatNumberWithCommas(num) {
    if (!num) return "";
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return parts.join(".");
  }

  function removeCommas(num) {
    if (!num) return "";
    return num.replace(/,/g, "");
  }

  function truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  }

  function onChangeAmount(e) {
    let num = e.target.value.replace(/[^0-9.]/g, "");
    if (e.target.value === ".") {
      num = "";
    } else {
      num = e.target.value.replace(/[^0-9.]/g, "");
    }
    const periodCount = num.split(".").length - 1;
    if (periodCount > 1) {
      num = num.slice(0, -1);
    }
    if (
      getData.PaymentType === "PESONET" &&
      parseFloat(num) >= parseFloat(getRemaining)
    ) {
      setData({
        ...getData,
        Amount: formatNumberWithCommas(getRemaining.toString()),
      });
    } else if (
      getData.PaymentType === "INSTAPAY" &&
      parseFloat(num) >= parseFloat(getRemaining)
    ) {
      if (parseFloat(getRemaining) >= 50000) {
        setData({ ...getData, Amount: formatNumberWithCommas("50000.00") });
      } else {
        setData({
          ...getData,
          Amount: formatNumberWithCommas(getRemaining.toString()),
        });
      }
    } else if (getData.PaymentType === "INSTAPAY" && parseFloat(num) >= 50000) {
      setData({ ...getData, Amount: formatNumberWithCommas("50000.00") });
    } else {
      setData({ ...getData, Amount: formatNumberWithCommas(num.toString()) });
    }
  }

  function onBlurAmount(e) {
    if (e.target.value !== "") {
      let num = e.target.value.replace(/[^0-9.]/g, "");
      const periodCount = num.split(".").length - 1;
      if (periodCount > 1) {
        num = num.slice(0, -1);
      }

      let CommaFormat = formatNumberWithCommas(
        truncateToDecimals(num).toString()
      );
      setData({ ...getData, Amount: CommaFormat });
    } else {
      setData({ ...getData, Amount: "" });
    }
  }

  const token = localStorage.getItem("UTK");
  async function AddNP() {
    const container = {
      PaymentType: getData.PaymentType,
      FirstName: getData.FirstName,
      LastName: getData.LastName,
      BankName: GetBankCode(getData.BankName),
      BankAcctNo: getData.BankAcctNo,
      Amount: truncateToDecimals(removeCommas(getData.Amount)),
      Type: getData.Type,
      Purpose: GetPurposeCode(getData.Purpose),
      Status: getData.Status,
      TraceId: "CKT" + data.LAN.props.children,
      RecUser: jwtDecode(token).USRID,
      Lan: data.LAN.props.children,
    };

    await axios
      .post("/api/v1/POST/P122AD", container)
      .then((result) => {
        queryClient.invalidateQueries(
          { queryKey: ["DisbursementListQuery", data.LAN.props.children] },
          { exact: true }
        );
        SET_REFRESH_LAN(1);
        queryClient.invalidateQueries(
          { queryKey: ["PRELOAD_DISBURSEMENT", data.LAN.props.children] },
          { exact: true }
        );
        api[result.data.status]({
          message: result.data.message,
          description: result.data.description,
        });
        setData({
          ...getData,
          PaymentType: "",
          //FirstName: "",
          //LastName: "",
          BankName: "",
          BankAcctNo: "",
          Amount: "0.00",
          Type: "NP",
          Purpose: "",
          Status: "AVAILABLE",
        });
      })
      .catch((error) => {
        api["error"]({
          message: "Something went wrong",
          description: error.message,
        });
      });
  }

  return (
    <div className="h-[10rem]">
      {contextHolder}
      <div className="flex flex-row">
        <div className="w-[29rem]">
          <Space>
            <div className="w-[15rem]">
              <Radio.Group
                disabled={
                  formatNumberWithCommas(
                    truncateToDecimals(getRemaining).toString()
                  ).toString() === "0.00"
                }
                onChange={(e) => {
                  setData({ ...getData, PaymentType: e.target.value });
                  if (
                    truncateToDecimals(removeCommas(getData.Amount)) >= 50000 &&
                    e.target.value === "INSTAPAY"
                  ) {
                    setData({
                      ...getData,
                      PaymentType: e.target.value,
                      Amount: "50,000.00",
                    });
                  } else {
                    setData({ ...getData, PaymentType: e.target.value });
                  }
                }}
                value={getData.PaymentType}
              >
                <Radio value={"INSTAPAY"}>
                  <span className="font-bold">INSTAPAY</span>
                </Radio>
                <Radio value={"PESONET"}>
                  <span className="font-bold">PESONET</span>
                </Radio>
              </Radio.Group>
            </div>
            <div className="w-[15rem]">
              <div className="font-bold">
                Remaining to Disburse:{" "}
                {formatNumberWithCommas(
                  parseFloat(getRemaining).toFixed(2).toString()
                )}
              </div>
            </div>
          </Space>
          <Space>
            <div>
              <div className="w-[15rem]">Recipient Name</div>
              <div className="w-[15rem]">
                {/* <Input
                  className="w-full"
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  value={getData.FirstName}
                  onChange={(e) => {
                    setData({ ...getData, FirstName: e.target.value });
                  }}
                /> */}
                <Select
                  className="w-full"
                  placeholder={
                    GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name)
                      ? "Please wait..." 
                      : "Select borrower"
                  }
                  loading={GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name)}
                  disabled={GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name)}
                  style={{
                    color: GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name) ? "gray" : "black",
                  }}
                  options={NameList(getAppDetails)?.map((x) => ({
                    key: `${x.name || ""}-${x.emoji || ""}-${x.desc || ""}`,
                    value: x.name,
                    label: x.name,
                    emoji: x.emoji,
                    desc: x.desc,
                  })) || []}
                  onChange={(value) => {
                    const selectedOption = nameListOptions.find(
                      (item) => item.name === value
                    );
                    if (selectedOption) {
                      const { firstName, lastName, Suffix } =
                        selectedOption.values;

                      setData((prevState) => ({
                        ...prevState,
                        FirstName: firstName || "",
                        LastName: lastName || "",
                        Suffix: Suffix || "N/A",
                      }));
                    }
                    console.log("Updated getData:", getData);
                  }}
                  optionRender={(option) => (
                    <Space>
                      <span className="font-bold text-green-600">
                        {option.data.emoji}
                      </span>
                      <span className="font-semibold">{option.data.value}</span>
                      <span className="font-thin text-xs">
                        {option.data.desc}
                      </span>
                    </Space>
                  )}
                />
              </div>
            </div>
            {/* <div>
              <div className="w-[15rem]">Recipient Last Name</div>
              <div className="w-[15rem]">
                <Input
                  className="w-full"
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  value={getData.LastName}
                  onChange={(e) => {
                    setData({ ...getData, LastName: e.target.value });
                  }}
                />
              </div>
            </div> */}
          </Space>
          <Space>
            <div>
              <div className="w-[15rem]">Bank Name</div>
              <div className="w-[15rem]">
                <Select
                  className="w-full"
                  value={getData.BankName || undefined}
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  options={BankList().map((x) => ({
                    label: x.description,
                    value: x.description,
                    emoji: x.code,
                    desc: x.description,
                  }))}
                  onChange={(e) => {
                    setData({ ...getData, BankName: e });
                  }}
                />
              </div>
            </div>
            <div>
              <div className="w-[15rem]">Bank Account Number</div>
              <div className="w-[15rem]">
                <Input
                  className="w-full"
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  value={getData.BankAcctNo}
                  onChange={(e) => {
                    setData({ ...getData, BankAcctNo: e.target.value });
                  }}
                />
              </div>
            </div>
          </Space>
          <Space>
            <div>
              <div className="w-[15rem]">Purpose</div>
              <div className="w-[15rem]">
                <Select
                  className="w-full"
                  value={getData.Purpose || undefined}
                  disabled={
                    !getData.PaymentType ||
                    formatNumberWithCommas(
                      parseFloat(getRemaining).toFixed(2).toString()
                    ).toString() === "0.00"
                  }
                  options={getPurpose?.map((x) => ({
                    label: x.description,
                    value: x.description,
                  }))}
                  onChange={(e) => {
                    setData({ ...getData, Purpose: e });
                  }}
                />
              </div>
            </div>
            <Space>
              <div>
                <div className="w-[10.6rem]">Amount to Credit</div>
                <div className="w-[10.6rem]">
                  <Input
                    className="w-full"
                    disabled={
                      !getData.PaymentType ||
                      formatNumberWithCommas(
                        parseFloat(getRemaining).toFixed(2).toString()
                      ).toString() === "0.00"
                    }
                    value={getData.Amount}
                    onBlur={(e) => {
                      onBlurAmount(e);
                    }}
                    onChange={(e) => {
                      onChangeAmount(e);
                    }}
                  />
                </div>
              </div>
              <Button
                disabled={
                  !getData.FirstName ||
                  !getData.LastName ||
                  !getData.BankName ||
                  !getData.BankAcctNo ||
                  getData.Amount === "0.00" ||
                  !getData.Purpose ||
                  formatNumberWithCommas(
                    parseFloat(getRemaining).toFixed(2).toString()
                  ).toString() === "0.00"
                }
                className="mt-[1.6em]"
                type="primary"
                onClick={() => {
                  AddNP();
                }}
              >
                Save
              </Button>
            </Space>
          </Space>
        </div>
        <div className="px-1 w-[70%]">
          <DisbursementList
            LAN={data.LAN.props.children}
            type={"NP"}
            bankList={getBank}
            DisburseAmount={data.AA}
          />
        </div>
      </div>
    </div>
  );
}

export default NetProceeds;
