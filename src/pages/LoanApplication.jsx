import * as React from "react";
import {
  Steps,
  Typography,
  Button,
  notification,
  ConfigProvider,
  Form,
} from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "@assets/images/logo.png";

import Modal_Result from "@components/loanApplication/Modal_Result";
import createInitialAppDetails from "@utils/IntialValues";
import {
  isValidLoanDetails,
  isValidOFWDetails,
  isValidBeneficiaryDetails,
} from "@utils/Validations";

import { getLoanApplicationSteps } from "@components/loanApplication/LoanApplicationSteps";
import { useAppDetailsEffects, useDirectLoan } from "@hooks/LoanApplicationHooks";
import { LoanApplicationContext } from "@context/LoanApplicationContext";


function LoanApplication() {
    React.useEffect(() => {
      const unloadCallBack = (e) => {
        e.preventDefault();
        e.returnValue = "";
      }
      window.addEventListener("beforeunload", unloadCallBack);
      return () => window.removeEventListener("beforeunload", unloadCallBack);
    }, []);

  // Control if it is direct / lc / marketing
  // let direct = true;
  document.title = "Loan Application Form";

  const [loanrendered, setloanrendered] = React.useState(false);
  const [ofwrendered, setofwrendered] = React.useState(false);
  const [benrendered, setbenrendered] = React.useState(false);

  const [api, contextHolder] = notification.useNotification();
  const [getLoanDetail, setLoanDetail] = React.useState();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [getStep, setStep] = React.useState(0);
  const [confirm, setconfirm] = React.useState(true);

  const {getAppDetails, setAppDetails, direct, resetAppDetails } = React.useContext(LoanApplicationContext)

  const [loadings, setLoadings] = React.useState(false);
  const [getDetails, setDetails] = React.useState();
  const { directLoan } = useDirectLoan(setDetails, setLoadings, setIsModalOpen)

  const lc_loandetails =
    !getAppDetails.dataPrivacy || parseInt(getAppDetails.loanAmount) < 30000 || !isValidLoanDetails(getAppDetails);

  const lc_ofwdetails = !isValidOFWDetails(getAppDetails);

  const loandetails =
    !getAppDetails.dataPrivacy || 
    !isValidLoanDetails(getAppDetails) || 
    ([15, 6].includes(getAppDetails.hckfi) && !getAppDetails.loanBranch);

  const ofwdetails = !isValidOFWDetails(getAppDetails);

  const ben_details = !isValidBeneficiaryDetails(getAppDetails);

  const navigate = useNavigate();

  const steps = getLoanApplicationSteps({
    loanrendered,
    setloanrendered,
    ofwrendered,
    setofwrendered,
    benrendered,
    setbenrendered,
    api,
  });

  useAppDetailsEffects(getAppDetails, setAppDetails);

  const onClickNext = () => {
    setStep(getStep + 1);
  };

  const onClickBack = () => {
    if (getStep == 2) {

    }
    setStep(getStep - 1);
  };

  const applyDirectLoan = () => {
    directLoan(direct)
    resetAppDetails();
  };

  const cancelModal = () => {
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col bg-[#e8eee5] h-[100vh] w-[100vw] justify-center items-center">
      {/* {contextHolder} */}
      <div className="h-[790px] w-[70%] bg-white rounded-lg shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
        <div
          className="float-right mt-[2%] mr-[3%] cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={Logo} alt="logo" className="h-9 mt-[10%]" />
        </div>
        <div className="mt-[3%] ml-[3%] w-[120px]">
          <a
            href="https://secure.trust-provider.com/ttb_searcher/trustlogo?v_querytype=W&v_shortname=POSDV&v_search=https://ckfi.live/cepat-portal/index.php&x=6&y=5"
            target="_blank"
            rel="noopener noreferrer" // Added for security
          >
            <img
              src="https://www.positivessl.com/images/seals/positivessl_trust_seal_sm_124x32.png"
              alt="Positive SSL Trust Seal" // Added alt attribute
            />
          </a>
        </div>

        <Modal_Result
          showModal={isModalOpen}
          closeModal={closeModal}
          closable={false}
          getLoanDetail={getLoanDetail}
          setLoanDetail={setLoanDetail}
          confirm={confirm}
          cancelModal={cancelModal}
          loading={loadings}
          code={getDetails}
          direct={direct}

        />

        <div className="w-[80%] mx-auto mt-[2%]">
          <ConfigProvider
            theme={{
              components: {
                Steps: {
                  colorPrimary: "rgb(100,99,175)",
                },
              },
            }}
          >
            <Steps
              className="mt-[2%]"
              size="small"
              items={steps}
              current={getStep}
            />
          </ConfigProvider>
          <div className="h-[36rem] overflow-y-auto mt-[2%]">
            {steps[getStep].content}
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex mt-2 flex-row">
              {getStep === 0 ? (
                <ConfigProvider theme={{ token: { colorPrimary: "#898FCD" } }}>
                  <Button
                    size="large"
                    onClick={onClickNext}
                    className="bg-[#6B73C1]"
                    type="primary"
                    disabled={direct ? loandetails  : lc_loandetails}
                  >
                    Next
                  </Button>
                </ConfigProvider>
              ) : getStep === 1 ? (
                <>
                  <ConfigProvider
                    theme={{ token: { colorPrimary: "#6067AD" } }}
                  >
                    <Button
                      size="large"
                      onClick={onClickBack}
                      className="mr-5 text-green-500 bg-[#f8f5f0]"
                    >
                      Back
                    </Button>
                  </ConfigProvider>
                  {direct ? (
                    <ConfigProvider
                      theme={{ token: { colorPrimary: "#898FCD" } }}
                    >
                      <Button
                        size="large"
                        onClick={onClickNext}
                        className="bg-[#6B73C1]"
                        type="primary"
                        disabled={ofwdetails}
                      >
                        Next
                      </Button>
                    </ConfigProvider>
                  ) : (
                    <ConfigProvider
                      theme={{ token: { colorPrimary: "#6B73C1" } }}
                    >
                      <Button
                        size="large"
                        onClick={ applyDirectLoan }
                        className="bg-[#31b235]"
                        type="primary"
                        disabled={direct ? ben_details : lc_ofwdetails}
                      >
                        Apply Loan
                      </Button>
                    </ConfigProvider>
                  )}
                </>
              ) : direct && getStep === 2 ? (
                <>
                  <ConfigProvider
                    theme={{ token: { colorPrimary: "#6067AD" } }}
                  >
                    <Button
                      size="large"
                      onClick={onClickBack}
                      className="mr-5 text-green-500 bg-[#f8f5f0]"
                    >
                      Back
                    </Button>
                  </ConfigProvider>
                  <ConfigProvider
                    theme={{ token: { colorPrimary: "#6B73C1" } }}
                  >
                    <Button
                      size="large"
                      onClick={ applyDirectLoan }
                      className="bg-[#31b235]"
                      type="primary"
                      disabled={ben_details}
                    >
                      Apply Loan
                    </Button>
                  </ConfigProvider>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanApplication;
