import * as React from "react";
import {
  Typography,
  Space,
  Input,
  DatePicker,
  Button,
  ConfigProvider,
  notification,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { FaGear } from "react-icons/fa6";
import Logo from "@assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toEncrypt } from "@utils/Converter";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import DatePickerOpt from "@components/optimized/DatePickerOpt";

function TrackLoanApp() {
  const navigate = useNavigate();
  const { getAppDetails, setAppDetails, api } = React.useContext(
    LoanApplicationContext
  );
  //   const [api, contextHolder] = notification.useNotification();
  const [loading, setloading] = React.useState(false);

  async function trackOnClick() {
    if (
      getAppDetails.loanIdCode !== "" &&
      dayjs(getAppDetails.ofwbdate).isValid()
    ) {
      setloading(true);
      let guid = "";
      await axios
        .post("/api/v1/POST/P46TL", {
          LoanId: getAppDetails.loanIdCode,
          BirthDate: getAppDetails.ofwbdate,
        })
        .then((result) => {
          if (result.data.status === "success") {
            guid = result.data.loanid;
          } else {
            api[result.data.status]({
              message: result.data.message,
              description: result.data.description,
            });
            setloading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      if (guid !== "") {
        setTimeout(() => {
          setloading(false);
          localStorage.setItem("CLID", toEncrypt(guid));
          navigate("/track");
        }, 2000);
      }
    } else {
      api["warning"]({
        message: "Incomplete Credentials",
        description: "Please Complete your Credentials and Try Again!",
      });
    }
  }

  function LoanIdOnchange(e) {
    const num = e.target.value;
    if (/^[0-9]*$/.test(num)) {
      setAppDetails((prevState) => ({
        ...prevState,
        loanIdCode: num,
      }));
    }
  }


  return (
    <div className="flex flex-col justify-center items-center">
      {/* {contextHolder} */}
      <div className="flex flex-col justify-center items-center w-[400px]">
        <img src={Logo} alt="logo" className="h-[50px]" />
        <Typography.Title level={2} className="my-[10%] font-sans">
          Track Your Loan Application
        </Typography.Title>
        <div className="w-[100%] mt-[8%]">
          <Input
            size="large"
            placeholder="Loan Application No."
            prefix={
              <Space.Compact className="w-[110px]" size="large">
                <FaGear className="mt-[4%]" />
                <span className="ml-[10%] font-bold">LA-</span>
              </Space.Compact>
            }
            value={getAppDetails.loanIdCode}
            onChange={(e) => {
              LoanIdOnchange(e);
            }}
          />
        </div>
        <div className="flex flex-rows mt-3 w-[420px] mb-1">
          <label className="ml-[3%] mt-[7px] w-[120px] font-bold">
            OFW Birth Date
          </label>
          <div className="mx-[2%] w-[300px]">
            <DatePickerOpt
              placeHolder="MM-DD-YYYY"
              value={getAppDetails.ofwbdate}
              required={false}
              notValidMsg={"OFW Birth Date is required."}
              disabled={false}
              receive={(e) => {
                setAppDetails((prevState) => ({
                    ...prevState,
                    ofwbdate: e,
                  }));
                }}
              KeyName={"ofwbdate"}
              rendered={false}
            />
          </div>
        </div>
        <div className="text-center mt-5 w-[100%]">
          <ConfigProvider theme={{ token: { colorPrimary: "#6b21a8" } }}>
            <Button
              className="bg-[#3b0764] w-full"
              size="large"
              type="primary"
              onClick={trackOnClick}
              loading={loading}
            >
              Track Loan
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
}

export default TrackLoanApp;
