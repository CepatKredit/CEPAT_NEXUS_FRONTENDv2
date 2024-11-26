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
import Logo from "@assets/images/Nexus_v3a.png";

import Modal_Result from "@components/loanApplication/Modal_Result";
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

  document.title = "Loan Application Form";
  const [loanrendered, setloanrendered] = React.useState(false);
  const [ofwrendered, setofwrendered] = React.useState(false);
  const [benrendered, setbenrendered] = React.useState(false);

  const [getLoanDetail, setLoanDetail] = React.useState();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [getStep, setStep] = React.useState(0);
  const [confirm, setconfirm] = React.useState(true);

  const { getAppDetails, setAppDetails, direct, resetAppDetails, api } = React.useContext(LoanApplicationContext)

  const [loadings, setLoadings] = React.useState(false);
  const [getDetails, setDetails] = React.useState();
  const { directLoan } = useDirectLoan(setDetails, setLoadings, setIsModalOpen)
  const stepperView = React.useRef()
  const lc_loandetails =
    !getAppDetails.dataPrivacy || !isValidLoanDetails(getAppDetails);

  const lc_ofwdetails = !isValidOFWDetails(getAppDetails);

  const loandetails =
    !getAppDetails.dataPrivacy ||
    !isValidLoanDetails(getAppDetails) ||
    ([15, 6].includes(getAppDetails.hckfi) && !getAppDetails.loanBranch);

  const ofwdetails = !isValidOFWDetails(getAppDetails);

  const ben_details = !isValidBeneficiaryDetails(getAppDetails);

  React.useEffect(() => {
    if (!getAppDetails.dataPrivacy) {
      resetAppDetails();
    }
  }, [getAppDetails.dataPrivacy]);

  const navigate = useNavigate();

  const onClickNext = (e) => {
    e.preventDefault();

    if (stepperView.current) {
      stepperView.current.scrollIntoView({ behavior: "smooth" });
    }

    setStep((prevStep) => prevStep + 1);
  };

  const steps = getLoanApplicationSteps({
    loanrendered,
    setloanrendered,
    ofwrendered,
    setofwrendered,
    benrendered,
    setbenrendered,
    api,
    stepperView
  });

  useAppDetailsEffects(getAppDetails, setAppDetails);


  const onClickBack = () => {
    if (getStep == 2) {

    }
    setStep(getStep - 1);
  };

  const applyDirectLoan = () => {
    directLoan(direct)
    // resetAppDetails();
  };

  const cancelModal = () => {
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  React.useState(() => {
    console.log(getStep)
  }, [getStep])

  

  return (
    <div className="flex flex-col bg-[#e8eee5] h-[100vh] w-[100vw] justify-center items-center">
      <div className="h-auto xs:h-[790px] xs:h-[890px] sm:h-[790px] md:h-[790px] lg:h-[790px] xl:h-[790px] 2xl:h-[790px] 3xl:h-[790px] w-full xs:w-[100%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[70%] 2xl:w-[70%] 3xl:w-[70%] bg-white rounded-lg shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
        <div
          className="float-right mt-4 sm:mt-[2%] sm:mr-[3%] cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={Logo} alt="logo" className="h-9 xs:mt-[10%]" />
        </div>
        <div className="mt-4 xs:mt-[3%] xs:ml-[3%] w-full xs:w-[120px]">
          <a
            href="https://secure.trust-provider.com/ttb_searcher/trustlogo?v_querytype=W&v_shortname=POSDV&v_search=https://ckfi.live/cepat-portal/index.php&x=6&y=5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.positivessl.com/images/seals/positivessl_trust_seal_sm_124x32.png"
              alt="Positive SSL Trust Seal"
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
  
        <div className="w-full xs:w-[90%] mx-auto mt-4 xs:mt-[2%]">
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
              className="mt-2"
              size="small"
              items={steps}
              current={getStep}
            />
          </ConfigProvider>
          <div className="h-[36rem] xs:h-[23rem] sm:h-[36rem] md:h-[36rem] lg:h-[36rem] xl:h-[36rem] 2xl:h-[36rem] 3xl:h-[36rem] overflow-y-auto mt-4 xs:mt-[2%]">
            {steps[getStep].content}
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col xs:flex-row sm:flex-row mt-2 w-full justify-center items-center">
              {getStep === 0 ? (
                <ConfigProvider theme={{ token: { colorPrimary: "#898FCD" } }}>
                  <Button
                    size="large"
                    onClick={onClickNext}
                    className="bg-[#6B73C1] w-full sm:w-auto"
                    type="primary"
                    disabled={direct ? loandetails : lc_loandetails}
                  >
                    Next
                  </Button>
                </ConfigProvider>
              ) : getStep === 1 ? (
                <>
                  <ConfigProvider theme={{ token: { colorPrimary: "#6067AD" } }}>
                    <Button
                      size="large"
                      onClick={onClickBack}
                      className="mr-5 text-green-500 bg-[#f8f5f0] mb-2 xs:mb-0"
                    >
                      Back
                    </Button>
                  </ConfigProvider>
                  {direct ? (
                    <ConfigProvider theme={{ token: { colorPrimary: "#898FCD" } }}>
                      <Button
                        size="large"
                        onClick={onClickNext}
                        className="bg-[#6B73C1] w-full xs:w-auto"
                        type="primary"
                        disabled={ofwdetails}
                      >
                        Next
                      </Button>
                    </ConfigProvider>
                  ) : (
                    <ConfigProvider theme={{ token: { colorPrimary: "#6B73C1" } }}>
                      <Button
                        size="large"
                        onClick={applyDirectLoan}
                        className="bg-[#31b235] w-full xs:w-auto"
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
                  <ConfigProvider theme={{ token: { colorPrimary: "#6067AD" } }}>
                    <Button
                      size="large"
                      onClick={onClickBack}
                      className="mr-5 text-green-500 bg-[#f8f5f0] mb-2 xs:mb-0"
                    >
                      Back
                    </Button>
                  </ConfigProvider>
                  <ConfigProvider theme={{ token: { colorPrimary: "#6B73C1" } }}>
                    <Button
                      size="large"
                      onClick={applyDirectLoan}
                      className="bg-[#31b235] w-full xs:w-auto"
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
