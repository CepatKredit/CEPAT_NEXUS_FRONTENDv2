import * as React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Flex, Modal, Spin, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { toEncrypt } from "@utils/Converter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { POST_DATA } from "@api/base-api/BaseApi";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { LiaClipboardSolid } from "react-icons/lia";

const handleApiResponse = (response, onSuccess, onError) => {
  if (response.data.status === "success") {
    onSuccess(response.data);
  } else {
    onError(
      response.data.status,
      response.data.message,
      response.data.description
    );
  }
};

function Modal_Result({
  cancelModal,
  showModal,
  closeModal,
  modalWidth,
  closable,
  contextHeight,
  code,
  direct,
}) {
  const { resetAppDetails, api, getAppDetails } = React.useContext(LoanApplicationContext);
  const navigate = useNavigate();
  const [getList, setList] = React.useState([]);
  const textAreaRef = React.useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
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

  //Old function for reference in case there an incorrect implementation
  // async function CheckDuplication() {
  //   const checkLoan = {
  //     LoanAppId: code.LoanAppId,
  //     FirstName: code.FirstName,
  //     LastName: code.LastName,
  //     Birthday: code.Birthday,
  //   };
  //   const result = await POST_DATA("/checkLoan", checkLoan);
  //   if (result.list.length === 0) {
  //       ClickLoan.mutate();
  //   } else {
  //     api["info"]({
  //       message: "Loan Already Exists",
  //       description: `Please be advised that you have an ongoing application with Cepat Kredit ${result.list[0].branch} branch with Loan Application No.
  //               ${result.list[0].loanAppCode}. For further concerns, please email our Customer Service Department at customerservice@cepatkredit.com. Thank you!`,
  //     });
  //   }
  // }

  const checkLoanMutation = useMutation({
    mutationFn: async () => {
      const checkLoan = {
        LoanAppId: code.LoanAppId,
        FirstName: code.FirstName,
        LastName: code.LastName,
        Birthday: code.Birthday,
      };
      return await POST_DATA("/GroupPost/P47CL", checkLoan);
    },
    onSuccess: (result) => {
      if (result.list.length === 0) {
        ClickLoan.mutate();
      } else {
        api["info"]({
          message: "Loan Already Exists",
          description: `Please be advised that you have an ongoing application with Cepat Kredit ${result.list[0].branch} branch with Loan Application No. 
                        ${result.list[0].loanAppCode}. For further concerns, please email our Customer Service Department at customerservice@cepatkredit.com. Thank you!`,
        });
      }
    },
    onError: (error) => {
      console.error("Error checking duplication:", error);
      // Handle any additional error handling here if needed
    },
  });

  const handleCheckDuplication = () => {
    checkLoanMutation.mutate();
  };

  const ClickLoan = useMutation({
    mutationFn: async () => {
      const endpoint = direct ? "/GroupPost/P52ADC" : "/GroupPost/AddLCClient";
      return axios.post(endpoint, code);
    },
    onSuccess: (response) => {
      handleApiResponse(
        response,
        (data) => {
          setList(data.datalist);
          resetAppDetails();
        }
        // showErrorNotification
      );
    },
    onError: (error) => {
      // showErrorNotification('error', 'API Error', 'An error occurred while processing your request. Please try again.');
      console.error(error);
    },
  });

  console.log("MODAL", getAppDetails)

  return (
    <Modal
      centered
      open={showModal}
      width={modalWidth}
      closable={closable}
      maskClosable={false}
      footer={false}
    >
      {contextHolder}
      <div
        className={contextHeight}
        style={{ padding: "20px", textAlign: "center" }}
      >
        {ClickLoan.isIdle ? (
          <p className="text-lg">Proceed with this application?</p>
        ) : ClickLoan.isPending ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "150px",
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />}
            />
            <p style={{ marginTop: "20px", fontSize: "18px" }}>
              Please Wait...
            </p>
          </div>
        ) : ClickLoan.isSuccess ? (
          <div>
            <div>
              <span className="text-lg font-semibold">
                Loan application has been created.
              </span>
            </div>
            <div className="pt-[1rem]">
            <textarea
                  ref={textAreaRef}
                  value={getList["LoanDetails"]?.loanAppCode}
                  readOnly
                  className="absolute opacity-0 pointer-events-none"
                />
              <Flex className="justify-center items-center">
              <span className="font-bold text-3xl">
                {getList["LoanDetails"]?.loanAppCode}
              </span>
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
            <div className="pt-[1rem]">
              <p>
                Please take note of your Loan Application ID. You can start
                uploading your verification documents and complete your
                character references on the next page. Please contact us at (02)
                8841-2374 if you have any questions. Click Proceed to continue.
              </p>
            </div>
          </div>
        ) : (
          <p>
            Error: Either No GUID generated or failed to insert Loan
            Application. Please contact support.
          </p>
        )}
        <center>
          {ClickLoan.isIdle || checkLoanMutation.isIdle ? (
            <>
              <ConfigProvider theme={{ token: { colorPrimary: "#6067AD" } }}>
                <Button
                  className="mt-[5%] mr-[2%] bg-[#f8f5f0] text-green-500"
                  onClick={cancelModal}
                >
                  Cancel
                </Button>
              </ConfigProvider>
              <ConfigProvider theme={{ token: { colorPrimary: "#898FCD" } }}>
                <Button
                  type="primary"
                  className="mt-[5%] ml-[2%] bg-[#6B73C1]"
                  onClick={handleCheckDuplication}
                  loading={checkLoanMutation.isPending || ClickLoan.isLoading}
                >
                  Confirm
                </Button>
              </ConfigProvider>
            </>
          ) : ClickLoan.isLoading ? null : ClickLoan.isSuccess ? (
            <ConfigProvider theme={{ token: { colorPrimary: "#898FCD" } }}>
              <Button
                type="primary"
                className="mt-[5%]"
                onClick={() => {
                  if (direct) {
                    localStorage.setItem("CLID", toEncrypt(code.LoanAppId));
                    closeModal();
                    navigate("/track");
                  } else {
                    localStorage.setItem("SIDC", toEncrypt(code.LoanAppId));
                    localStorage.setItem("SP", "/ckfi/under-marketing");
                    closeModal();
                    navigate(
                      `${localStorage.getItem("SP")}/${
                        getList["LoanDetails"]?.loanAppCode
                      }/loan-details`
                    );
                  }
                }}
              >
                Proceed
              </Button>
            </ConfigProvider>
          ) : (
            // Display only Cancel button when there is an error
            <ConfigProvider theme={{ token: { colorPrimary: "#6067AD" } }}>
              <Button
                className="mt-[5%] bg-[#f8f5f0] text-green-500"
                onClick={cancelModal}
              >
                Cancel
              </Button>
            </ConfigProvider>
          )}
        </center>
      </div>
    </Modal>
  );
}

export default Modal_Result;
