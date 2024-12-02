import * as React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { IoMail } from "react-icons/io5";
import { FaKey } from "react-icons/fa";
import {
  Button,
  Input,
  ConfigProvider,
  Space,
  notification,
  Spin,
  Divider,
} from "antd";
import axios from "axios";
import FullScreenBackground from "@assets/images/LoginBG.jpg";
import LoginBackground from "@assets/images/side.jpg";
import { useNavigate, useLocation } from "react-router-dom";
//import Logo from "@assets/images/WHITE.svg";
import Logo from "@assets/images/Nexus_v3a.png";
import Datos from "@assets/images/datos.png";
import ResponsiveModal from "@components/global/ResponsiveModal";
import {
  viewModal,
  viewResetPasswordModal,
  viewForgotPasswordModal,
  viewUnlockAccountModal,
} from "@hooks/ModalController";
import ForgotPassword from "@containers/portalLogin/ForgotPassword";
import { DisplayOTP } from "@hooks/OTPController";
import TrackLoanApp from "@containers/portalLogin/TrackLoanApp";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaCalendar } from "react-icons/fa";
import ResetPassword from "@containers/portalLogin/ResetPassword";
import { useCookies } from "react-cookie";
// import OTPModal from '@components/global/OTPModal';
import ValidationOTP from "@containers/portalLogin/ValidationOTP";
import { useMutation } from "@tanstack/react-query";
import UnlockAccount from "@containers/portalLogin/UnlockAccount";
import { decode } from "@utils/Secure";
import { toEncrypt } from "@utils/Converter";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { useAuth } from "@auth/AuthProvider";

function PortalLogin() {
  const {
    getAccount,
    setAccount,
    onClickLogin,
    getAccessList,
    setOTPStatus,
    getOTPStatus,
    setAccessList,
    setCookie,
    PasswordMatch,
    PasswordNotMatch,
    getModalResetStatus,
    setModalResetStatus,
  } = useAuth();
  document.title = "CKFI";
  const [api, contextHolder] = notification.useNotification();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { resetAppDetails } = React.useContext(LoanApplicationContext);

  React.useEffect(() => {
    if (state && state.status) {
      api[state.status]({
        message: state.message,
        description: state.description,
      });
      navigate("/", {});
    }
  }, [state]);

  // const [getAccount, setAccount] = React.useState({
  //     Username: '',
  //     Password: ''
  // })

  function handleChange(e) {
    setAccount({
      ...getAccount,
      [e.target.name]: e.target.value,
    });
  }
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      onClickLogin.mutate();
    }
  }
  // const [cookies, setCookie] = useCookies(['SESSION_ID'])
  const getModalStatus = viewModal((state) => state.modalStatus);
  const setModalStatus = viewModal((state) => state.setStatus);

  // const getModalResetStatus = viewResetPasswordModal(
  //   (state) => state.modalStatus
  // );
  // const setModalResetStatus = viewResetPasswordModal(
  //   (state) => state.setStatus
  // );
  // const setAccountId = viewResetPasswordModal((state) => state.setId);

  // const getOTPStatus = DisplayOTP((state) => state.modalStatus)
  // const setOTPStatus = DisplayOTP((state) => state.setStatus)

  const getForgotStatus = viewForgotPasswordModal((state) => state.modalStatus);
  const setForgotStatus = viewForgotPasswordModal((state) => state.setStatus);

  const getUnlockStatus = viewUnlockAccountModal((state) => state.modalStatus);
  const setUnlockStatus = viewUnlockAccountModal((state) => state.setStatus);
  // const [getAccessList, setAccessList] = React.useState()

  //   const onClickLogin = useMutation({
  //     mutationFn: async () => {
  //       if (getAccount.Username === "" || getAccount.Password === "") {
  //         api["info"]({
  //           message: "Invalid input",
  //           description: "Please input your username and password to login.",
  //         });
  //       } else {
  //         await axios
  //           .post("/login", getAccount)
  //           .then((result) => {
  //             console.log(
  //               decode(result.data.userData.password) === getAccount.Password
  //             );
  //             console.log("Received response:", result.data);
  //             if (
  //               result.data.message === "Account not found" ||
  //               result.data.message === "Account disabled" ||
  //               result.data.message === "Account for approval" ||
  //               result.data.message === "Account rejected"
  //             ) {
  //               api[result.data.status]({
  //                 message: result.data.message,
  //                 description: result.data.description,
  //               });
  //             } else {
  //               if (
  //                 decode(result.data.userData.password) === getAccount.Password
  //               ) {
  //                 PasswordMatch.mutate();
  //                 resetAppDetails();
  //               } else {
  //                 PasswordNotMatch.mutate();
  //               }
  //             }
  //           })
  //           .catch((error) => {
  //             api["error"]({
  //               message: "Something went wrong",
  //               description: error.message,
  //             });
  //           });
  //       }
  //     },
  //   });

  //   const PasswordMatch = useMutation({
  //     mutationFn: async () => {
  //       await axios
  //         .post("/verifiedAccount", getAccount)
  //         .then((result) => {
  //           if (result.data.status === "warning") {
  //             api[result.data.status]({
  //               message: result.data.message,
  //               description: result.data.description,
  //             });
  //           } else if (result.data.status === "info") {
  //             setModalResetStatus(true);
  //             const data = {
  //               id: result.data.container.id,
  //               username: result.data.container.username,
  //               password: getAccount.Password,
  //             };
  //             setAccountId(data);
  //             setAccount({
  //               Username: "",
  //               Password: "",
  //             });
  //             api[result.data.status]({
  //               message: result.data.message,
  //               description: result.data.description,
  //             });
  //           } else {
  //             let AccessPath = "";
  //             result.data.access?.map((x) => {
  //               if (AccessPath === "") {
  //                 AccessPath += x.accessPath;
  //               } else {
  //                 AccessPath += "," + x.accessPath;
  //               }
  //             });

  // //expirationInHours is set on seconds for testing purposes.
  //             if (result.data.department === "LC") {
  //               axios
  //                 .post(
  //                   `verify/access-token/${result.data.eeyyy}?expirationInHours=60`
  //                 )
  //                 .then(function (response) {
  //                     const accessToken = response.data.accessToken;
  //                     const refreshToken = response.data.refreshToken;
  //                     const refreshExpiresIn = response.data.refreshExpiresIn; // In seconds

  //                     // Store tokens
  //                     localStorage.setItem("ACCESS TOKEN", accessToken);
  //                     setCookie("REFRESH TOKEN", refreshToken, {
  //                       secure: true,
  //                       sameSite: "strict",
  //                       maxAge: refreshExpiresIn, // Expiration in seconds
  //                     });

  //                     // Alert before the cookie expires (5 seconds before expiration for demonstration)
  //                     // const alertBeforeExpiry = 5; // Adjust the time before expiry to show alert (in seconds)
  //                     // const alertTimeout = (refreshExpiresIn - alertBeforeExpiry) * 1000; // Convert to milliseconds

  //                     // setTimeout(() => {
  //                     //   alert("Your session is about to expire. Please refresh or re-login.");
  //                     // }, alertTimeout);
  //                 })
  //                 .catch(function (error) {
  //                   console.error(error);
  //                   throw new Error("Token generation failed.");
  //                 });
  //               localStorage.setItem("UTK", result.data.eeyyy);
  //               localStorage.setItem("UPTH", toEncrypt(AccessPath));
  //               localStorage.setItem("SP", "/ckfi/dashboard");
  //               localStorage.setItem("USRFN", toEncrypt(result.data.fn));
  //               localStorage.setItem(
  //                 "USRDT",
  //                 toEncrypt(
  //                   `${result.data.department}?${result.data.role}?${result.data.branch}`
  //                 )
  //               );
  //               navigate("/ckfi/dashboard");
  //               setCookie("SESSION_ID", result.data.eeyyy, {
  //                 secure: true,
  //                 sameSite: "strict",
  //               });
  //               api[result.data.status]({
  //                 message: result.data.message,
  //                 description: result.data.description,
  //               });
  //             } else {
  //               setAccessList(AccessPath);
  //               setOTPStatus(true);
  //             }
  //           }
  //         })
  //         .catch((error) => {
  //           api["error"]({
  //             message: "Something went wrong",
  //             description: error.message,
  //           });
  //         });
  //     },
  //   });

  //   const PasswordNotMatch = useMutation({
  //     mutationFn: async () => {
  //       await axios
  //         .post("/passwordAttempt", getAccount)
  //         .then((result) => {
  //           api[result.data.status]({
  //             message: result.data.message,
  //             description: result.data.description,
  //           });
  //         })
  //         .catch((error) => {
  //           api["error"]({
  //             message: "Something went wrong",
  //             description: error.message,
  //           });
  //         });
  //     },
  //   });


  async function onClickCancelOTP() {
    await axios
      .post(`POST/P89CO/${getAccount.Username}`)
      .then((result) => {
        setOTPStatus(false);
      })
      .catch((error) => {
        api["error"]({
          message: "Something went wrong",
          description: error.message,
        });
      });
  }

  return (
    <div
    className="flex flex-wrap bg-cover bg-no-repeat h-screen w-full overflow-hidden"
    style={{ backgroundImage: `url(${FullScreenBackground})` }}
    >
      {contextHolder}

      <ResponsiveModal
        showModal={getModalStatus}
        closeModal={() => {
          setModalStatus(false);
        }}
        modalWidth={"600px"}
        modalTitle={
          <>
            <a
              href="
        https://secure.trust-provider.com/ttb_searcher/trustlogo?v_querytype=W&v_shortname=POSDV&v_search=https://ckfi.live/cepat-portal/index.php&x=6&y=5"
              target="_blank"
            >
              <img
                src="
        https://www.positivessl.com/images/seals/positivessl_trust_seal_sm_124x32.png"
              />
            </a>
          </>
        }
        contextHeight={"h-[500px]"}
        contextInside={
          <>
            <TrackLoanApp />
          </>
        }
      />

      <ResponsiveModal
        showModal={getModalResetStatus}
        closeModal={() => {
          setModalResetStatus(false);
        }}
        modalTitle={<span>Reset Temporary Password</span>}
        modalWidth={"400px"}
        contextHeight={"h-[420px]"}
        contextInside={
          <>
            <ResetPassword />
          </>
        }
      />

      <ResponsiveModal
        showModal={getOTPStatus}
        closeModal={() => {
          onClickCancelOTP();
        }}
        modalWidth={"500px"}
        contextHeight={"500px"}
        contextInside={
          <ValidationOTP
            username={getAccount.Username}
            accessList={getAccessList}
          />
        }
      />

      <ResponsiveModal
        showModal={getForgotStatus}
        closeModal={() => {
          setForgotStatus(false);
        }}
        modalWidth={"400px"}
        contextHeight={"250px"}
        modalTitle={<span>Forgot Password</span>}
        contextInside={
          <>
            <ForgotPassword />
          </>
        }
      />

      <ResponsiveModal
        showModal={getUnlockStatus}
        closeModal={() => {
          setUnlockStatus(false);
        }}
        modalWidth={"400px"}
        contextHeight={"250px"}
        modalTitle={<span>Unlock Account</span>}
        contextInside={
          <>
            <UnlockAccount />
          </>
        }
      />

      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 100, color: "green" }} spin />
        }
        fullscreen
        spinning={
          onClickLogin.isPending ||
          PasswordMatch.isPending ||
          PasswordNotMatch.isPending
        }
      />
      <div className="h-full xs1:h-[28%] xs2:h-[25%] xs:h-[12%] sm:h-[70%] md:h-[100%] lg:h-[100%] xl:h-[100%] 2xl:h-[100%] 3xl:h-[100%]  w-full xs1:w-[100%] xs2:w-[100%] xs:w-[100%] sm:w-[55%] md:w-[67%] lg:w-[70%] xl:w-[67%] 2xl:w-[67%] 3xl:w-[70%]">
        <div className="pt-3  xs1:pt-3 xs2:pt-3 xs:pt-3 md:pt-3 ml-3  xs:ml-5 md:ml-3 w-full xs:w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] xl:w-[120px] 2xl:w-[150px] 3xl:w-[160px]">
          <a
            href="https://secure.trust-provider.com/ttb_searcher/trustlogo?v_querytype=W&v_shortname=POSDV&v_search=https://ckfi.live/cepat-portal/index.php&x=6&y=5"
            target="_blank"
          >
            <img
              className="w-full xs1:w-[80px] xs2:w-[80px] xs:w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] xl:w-[120px] 2xl:w-[150px] 3xl:w-[160px]"
              src="https://www.positivessl.com/images/seals/positivessl_trust_seal_sm_124x32.png"
            />
          </a>
        </div>
        <center>
          <img src={Logo} alt="logo" className="h-[60px] xs1:h-[60px] xs2:h-[70px] xs:h-[80px] sm:h-[100px] md:h-[120px] lg:h-[130px] xl:h-[135px] 2xl:h-[180px] mt-[8%] xs1:mt-[3%] sm:mt-[4%] md:mt-[5%] lg:mt-[6%] xl:mt-[9%] mx-auto" />
          <div className="font-sans font-bold text-4xl xs1:text-xs xs:text-xs sm:text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-stone-100 drop-shadow-[0_5px_5px_rgba(0,0,0,.7)] text-center">
            <span>Loan Origination System</span>
          </div>
          <div>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#6b21a8",
                  borderRadius: 100,
                  borderRadiusLG: 100,
                  borderRadiusSM: 100,
                },
              }}
            >
              <Button
                className="mt-8 xs1:mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-8 text-2xl xs1:text-sm sm:text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold 
                w-full xs1:w-[200px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px] 2xl:w-[400px] 3xl:w-[500px] h-[50px] xs1:h-[30px] sm:h-[35px] md:h-[40px] lg:h-[45px] xl:h-[50px] bg-[#3b0764]"
                size="large"
                type="primary"
                onClick={() => {
                  resetAppDetails();
                  navigate("/loan-application");
                }}
                onKeyUp={(e) => {
                  e.key === "enter" ? navigate("/loan-application") : "";
                }}
              >
                APPLY FOR A LOAN
              </Button>
            </ConfigProvider>
          </div>
          <div>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#b3b2b1",
                  borderRadius: 100,
                  borderRadiusLG: 100,
                  borderRadiusSM: 100,
                },
              }}
            >
              <Button
                className="mt-5 xs1:mt-2 sm:mt-2 md:mt-3 lg:mt-4 xl:mt-5 text-2xl text-2xl xs1:text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-black 
                w-full xs1:w-[200px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px] 2xl:w-[400px] 3xl:w-[500px] h-[50px] xs1:h-[30px] sm:h-[35px] md:h-[40px] lg:h-[45px] xl:h-[50px] bg-[#ffffff]"
                size="large"
                type="primary"
                onClick={() => {
                  setModalStatus(true);
                }}
                onKeyUp={(e) => {
                  e.key === "enter" ? setModalStatus(true) : "";
                }}
              >
                LOAN APPLICATION STATUS
              </Button>
            </ConfigProvider>
          </div>
        </center>
      </div>
      <div
        className="h-full xs1:h-[35%] xs2:h-[35%] xs:h-[35%] sm:h-[50%] md:h-[50%] lg:h-[53%] xl:h-[100%] 2xl:h-[100%] 3xl:h-[100%] 
        w-full xs1:w-full sm:w-[42%] md:w-[31%] lg:w-[28%] xl:w-[30%] 2xl:w-[30%] 3xl:w-[28%] bg-left drop-shadow-[0_5px_5px_rgba(0,0,0,.5)]"
        style={{ backgroundImage: `url(${LoginBackground})`}}
      >
        <div className="h-full w-full bg-stone-500/70">
          <center>
            <div className="pt-[50%] xs1:pt-[4%] sm:pt-[36%] md:pt-[30%] lg:pt-[40%] xl:pt-[62%] h-[500px] w-full">
              <div className="text-2xl xs1:text-xs xs:text-sm sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl font-normal text-stone-100">
                <div>For registered personnel and</div>
                <div>loan consultants, please log in below:</div>
              </div>
              <div className="w-full xs1:w-[80%] sm:w-[80%] md:w-[85%] lg:w-[75%] xl:w-[80%] 2xl:w-[90%] 3xl:w-[95%] pt-2">
                <div className="pt-2">
                  <ConfigProvider
                    theme={{
                      token: {
                        borderRadius: 100,
                        borderRadiusLG: 100,
                        borderRadiusSM: 200,
                      },
                    }}
                  >
                    <Input
                      name="Username"
                      placeholder="Email Address"
                      prefix={
                        <Space.Compact className="px-2 w-[40px] text-stone-400">
                          <IoMail  className="xs1:text-[12px] sm:text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[20px] 3xl:text-[20px]" />
                        </Space.Compact>
                      }
                      autoComplete="off"
                      value={getAccount.Username}
                      onChange={handleChange}
                      className="h-[50px] xs1:h-[28px] sm:h-[35px] md:h-[35px] lg:h-[45px] xl:h-[50px] text-xs xs1:text-xs sm:text-sm md:text-md lg:text-md xl:text-md 2xl:text-lg 3xl:text-xl"
                    />
                  </ConfigProvider>
                </div>
                <div className="pt-2">
                  <ConfigProvider
                    theme={{
                      token: {
                        borderRadius: 100,
                        borderRadiusLG: 100,
                        borderRadiusSM: 200,
                      },
                    }}
                  >
                    <Input.Password
                      name="Password"
                      placeholder="Password"
                      maxLength={15}
                      visibilityToggle={{
                        visible: passwordVisible,
                        onVisibleChange: setPasswordVisible,
                      }}
                      prefix={
                        <Space.Compact className="px-2 w-[40px] text-stone-400">
                           <FaKey className="xs1:text-[12px] sm:text-[10px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[20px] 3xl:text-[20px]" />
                        </Space.Compact>
                      }
                      autoComplete="off"
                      onChange={handleChange}
                      value={getAccount.Password}
                      className="h-[50px] xs1:h-[28px] sm:h-[35px] md:h-[35px] lg:h-[45px] xl:h-[50px] text-xs xs1:text-xs sm:text-sm md:text-md lg:text-md xl:text-md 2xl:text-lg 3xl:text-xl"
                      onKeyDown={handleKeyDown}
                    />
                  </ConfigProvider>
                </div>
                <div className="flex place-content-between">
                  <div
                    className="pt-2 pr-2 h-[10px] pl-2 cursor-pointer"
                    onClick={() => {
                      setUnlockStatus(true);
                    }}
                  >
                    <span className="font-bold text-sky-400 hover:text-cyan-300 text-base xs1:text-[10px] sm:text-[10px] md:text-[10px] lg:text-md xl:text-base 2xl:text-base">
                      Unlock Account
                    </span>
                  </div>
                  <div
                    className="pt-2 pr-2 h-[10px] cursor-pointer"
                    onClick={() => {
                      setForgotStatus(true);
                    }}
                  >
                    <span className="font-bold text-sky-400 hover:text-cyan-300 text-base xs1:text-[10px] sm:text-[10px] md:text-[10px] lg:text-md xl:text-base 2xl:text-base">

                      Forgot Password?
                    </span>
                  </div>
                </div>
                <div className="text-center pt-9 xs1:pt-5 xs:pt-9">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#31b234",
                        borderRadius: 100,
                        borderRadiusLG: 100,
                        borderRadiusSM: 100,
                      },
                    }}
                  >
                    <Button
                      className="text-2xl xs1:text-xs xs:text-sm sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold w-full xs1:w-[100px] xs:w-[150px] sm:w-[150px] md:w-[200px] lg:w-[200px] xl:w-[200px] 2xl:w-[200px] 3xl:w-[250px] 
                      h-[50px] xs1:h-[30px] sm:h-[35px] md:h-[35px] lg:h-[45px] xl:h-[40px] bg-[#31b234]"
                      onClick={() => {
                        onClickLogin.mutate(navigate);
                      }}
                      onKeyUp={(e) => {
                        e.key === "enter" ? onClickLogin.mutate(navigate) : "";
                      }}
                      type="primary"
                    >
                      Login
                    </Button>
                  </ConfigProvider>
                </div>
              </div>
            </div>
          </center>
        </div>
      </div>
      <div className="flex flex-wrap w-full mb-[-100] xs1:mb-[-50px] xs2:mb-[-80px] xs:mb-[-50px] 2xl:mb-[-0px] mt-[-180px] xs1:mt-[-40px] xs2:mt-[-50px] xs:mt-[-115px] sm:mt-[-370px] md:mt-[-480px] lg:mt-[-820px] xl:mt-[-190px] 2xl:mt-[-180px]">
        <div className="pl-[3%]">
          <img
            src={Datos} alt="datos" className="w-[70px] xs1:w-[20px] sm:w-[60px] md:w-[80px] lg:w-[80px] xl:w-[90px] 2xl:w-[90px] h-[70px] xs1:h-[35px] sm:h-[85px] md:h-[140px] lg:h-[150px] xl:h-[150px] 2xl:h-[150px]" />
        </div>
        <div className="pl-[3%] text-white w-full xs1:w-[50%] sm:w-[50%] md:w-[50%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%] xs1:text-[4.5px] sm:text-[8px] md:text-[8px] lg:text-[8px] xl:text-[8px] 2xl:text-[8px] 3xl:text-[10px]">
          <strong>
            <h5>CEPAT KREDIT FINANCING INC.</h5>
            <br />
            <article>
              SEC Registration No.: CS201909976
              <br />
              CEPAT KREDIT FINANCING INC. is regulated by the Securities and
              Exchange Commission (SEC)
              <br />
              SEC Contact Information : (02)8818-5990 / cgfd-flcd@sec.gov.ph.
              <br />
              Certificate of Authority to Operate: No. 1223
              <br />
              <br />
            </article>
            <article>
              ADVISORY: Welcome to CEPAT KREDIT FINANCING’s portal. By accessing
              this website, you agree to be governed by the Terms and Conditions
              and Data Privacy Policy herein set forth. If you find the Terms
              and Conditions and data privacy policy unacceptable, kindly
              discontinue accessing the website. Before proceeding with your
              loan transaction, we advise you to study the Terms and Conditions
              in the disclosure statements.
              <br />
              <br />
            </article>
          </strong>
        </div>
        <ConfigProvider theme={{ token: { colorSplit: "#ffffff", lineWidth: 2 } }}>
          <Divider
            className="h-[150px] xs1:h-[100px] xs:h-[80px] sm:h-[150px] md:h-[150px] lg:h-[170px] xl:h-[155px] 2xl:h-[135px] 3xl:h-[155px]"
            type="vertical"
          />
        </ConfigProvider>
        <div className="pl-[1%] xs1:pl-[3%] lg:pl-[1%] text-white w-full xs1:w-[30%] xs:w-[35%] sm:w-[25%] md:w-[30%] lg:w-[25%] xl:w-[25%] 2xl:w-[30%] 
        text-[6px] xs1:text-[5.6px] sm:text-[9px] md:text-[9px] lg:text-[9px] xl:text-[10px] 2xl:text-[10px] 3xl:text-[12px]">
          <strong>
            <h5>CONTACT DETAILS</h5>
            <br />
            <article>
              <div className="flex">
                <span className="pt-[2px] pr-[5px]">{<IoLocationSharp />}</span>
                <span>
                  Room 2402 Jollibee Plaza, Emerald Ave., San Antonio, Pasig,
                  Metro Manila
                </span>
              </div>
              <div className="flex">
                <span className="pt-[2px] pr-[5px]">{<BsFillTelephoneFill />}</span>
                <span>
                  <div> +63 917 822 7598 </div>
                  <div> +63 919 059 9599 </div>
                  <div> 0288 412 374 </div>
                </span>
              </div>
              <div className="flex">
                <span className="pt-[3.5px] pr-[5px]">{<IoMail />}</span>
                <span>customerservice@cepatkredit.com</span>
              </div>
              <div className="flex">
                <span className="pt-[3px] pr-[5px]">{<FaCalendar />}</span>
                <span>Monday to Friday | 9AM - 6PM</span>
              </div>
            </article>
          </strong>
        </div>
      </div>
    </div>
  );
}

export default PortalLogin;