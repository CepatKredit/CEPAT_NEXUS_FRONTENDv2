import { GET_LIST } from "@api/base-api/BaseApi";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { useDataContainer } from "@context/PreLoad";
import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import { toDecrypt } from "@utils/Converter";
import { NameList } from "@utils/NameListNetProceed";
import { Button, Input, notification, Radio, Select, Space } from "antd";
import axios from "axios";
import React from "react";

function NetProceedsGeneration({ getDisburse, data }) {
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
    Amount: "",
    Type: "NP",
    Purpose: "",
    Status: "AVAILABLE",
  });
  const isFetching = useIsFetching({
    queryKey: ["DisbursementListQuery", getDisburse.LAN, getData.Type],
  });

  React.useEffect(() => {
    GetClient.refetch();
  }, [getDisburse.loanAppId]);

  const GetClient = useQuery({
    queryKey: ["ClientDataListQuery", getDisburse.loanAppId],
    queryFn: async () => {
      const result = await GET_LIST(`/GET/G3CD/${getDisburse.loanAppId}`);
      const data = result.list;
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
    SET_LOAN_APPLICATION_NUMBER(getDisburse.LAN);
    ComputeRemaining();
  }, [data]);

  const [getRemaining, setRemaining] = React.useState("");
  function ComputeRemaining() {
    let value =
      parseFloat(removeCommas(formatNumberWithCommas(parseFloat(getDisburse.approvedAmount).toFixed(2).toString()))) -
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
    if (!num || num === "NaN") return "0";
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  const token = localStorage.getItem("UTK");

  async function AddNP() {
    let remaining = getRemaining;

    const createContainer = (amount) => ({
      PaymentType: getData.PaymentType,
      FirstName: getData.FirstName,
      LastName: getData.LastName,
      BankName: GetBankCode(getData.BankName),
      BankAcctNo: getData.BankAcctNo,
      Amount: parseFloat(amount),
      Type: getData.Type,
      Purpose: GetPurposeCode(getData.Purpose),
      Status: getData.Status,
      TraceId: "CKT" + getDisburse.LAN,
      RecUser: jwtDecode(token).USRID,
      Lan: getDisburse.LAN,
    });

    const postTransaction = (container) =>
      axios.post("/POST/P122AD", container).then((result) => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "DisbursementListQuery",
              getDisburse.LAN,
              getData.Type,
            ],
          },
          { exact: true }
        );
        SET_REFRESH_LAN(1);
        queryClient.invalidateQueries(
          { queryKey: ["PRELOAD_DISBURSEMENT", getDisburse.LAN] },
          { exact: true }
        );

        setData({
          ...getData,
          PaymentType: "",
          BankName: "",
          BankAcctNo: "",
          Amount: "0.00",
          Type: "NP",
          Purpose: "",
          Status: "AVAILABLE",
        });
      });

    if (getData.PaymentType === "INSTAPAY") {
      const loopPost = async () => {
        while (remaining > 0) {
          const instaAmount = remaining >= 50000 ? 50000 : remaining;
          const container = createContainer(instaAmount);

          await postTransaction(container)
            .then(() => {
              remaining -= instaAmount;
            })
            .catch((error) => {
              api["error"]({
                message: "Something went wrong",
                description: error.message,
              });
              remaining = -1;
            });
        }
      };

      await loopPost();

      if (remaining === 0) {
        api["success"]({
          message: "All transactions completed successfully",
          description: "The remaining balance has been fully processed.",
        });
      }
    } else {
      const container = createContainer(getRemaining);

      await postTransaction(container)
        .then(() => {
          api["success"]({
            message: "Transaction completed successfully",
            description: "The transaction was processed.",
          });
        })
        .catch((error) => {
          api["error"]({
            message: "Something went wrong",
            description: error.message,
          });
        });
    }
  }
  return (
    <>
      {contextHolder}
      <div className="ml-2 pt-1">
        <div className="font-bold">
          Remaining to Disburse: &nbsp;
          {formatNumberWithCommas(
            parseFloat(getRemaining).toFixed(2).toString()
          )}
        </div>
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
      <Select
        className="w-fit"
        size="large"
        placeholder={
          GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name)
            ? "Please wait..."
            : "Select borrower"
        }
        loading={
          GetClient.isFetching || !NameList(getAppDetails)?.some((x) => x.name)
        }
        disabled={
          GetClient.isFetching ||
          !NameList(getAppDetails)?.some((x) => x.name)
          //   !getData.PaymentType ||
        //   formatNumberWithCommas(
        //     parseFloat(getRemaining).toFixed(2).toString()
        //   ).toString() === "0.00"
        }
        style={{
          color:
            GetClient.isFetching ||
            !NameList(getAppDetails)?.some((x) => x.name)
              ? "gray"
              : "black",
        }}
        options={
          NameList(getAppDetails)?.map((x) => ({
            key: `${x.name || ""}-${x.emoji || ""}-${x.desc || ""}`,
            value: x.name,
            label: x.name,
            emoji: x.emoji,
            desc: x.desc,
          })) || []
        }
        onChange={(value) => {
          const selectedOption = nameListOptions.find(
            (item) => item.name === value
          );
          if (selectedOption) {
            const { firstName, lastName, Suffix } = selectedOption.values;

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
            <span className="font-thin text-xs">{option.data.desc}</span>
          </Space>
        )}
      />
      <Select
        className="w-fit"
        size="large"
        placeholder="Bank name"
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
      <Input
        className="w-fit"
        size="small"
        placeholder="Bank Account Number"
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
      <Select
        className="w-fit"
        placeholder="purpose"
        size="large"
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
      <Button
        className="ml-2"
        type="primary"
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
        loading={!!isFetching}
        onClick={() => {
          AddNP();
        }}
      >
        Add
      </Button>
    </>
  );
}

export default NetProceedsGeneration;
