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
import Logo from "@assets/images/WHITE.svg";
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
      .post(`//GroupPost/P89CO/${getAccount.Username}`)
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
      className="flex flex-wrap bg-cover bg-no-repeat h-[100vh] w-[100vw]"
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
          <LoadingOutlined style={{ fontSize: 100, color: "white" }} spin />
        }
        fullscreen
        spinning={
          onClickLogin.isPending ||
          PasswordMatch.isPending ||
          PasswordNotMatch.isPending
        }
      />
      <div className="h-[100%] w-[67%]">
        <div className="pt-[3%] ml-[3%] w-[150px]">
          <a
            href="https://secure.trust-provider.com/ttb_searcher/trustlogo?v_querytype=W&v_shortname=POSDV&v_search=https://ckfi.live/cepat-portal/index.php&x=6&y=5"
            target="_blank"
          >
            <img
              className="w-[150px]"
              src="https://www.positivessl.com/images/seals/positivessl_trust_seal_sm_124x32.png"
            />
          </a>
        </div>
        <center>
          <img src={Logo} alt="logo" className="h-[60px] mt-[8%]" />
          <div className="font-sans font-bold text-6xl text-stone-100 drop-shadow-[0_5px_5px_rgba(0,0,0,.7)] pt-[5%]">
            <span>Cepat Kredit Portal</span>
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
                className="mt-8 text-3xl font-semibold w-[400px] h-[50px] bg-[#3b0764]"
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
                className="mt-5 text-2xl font-semibold text-black w-[400px] h-[50px] bg-[#ffffff]"
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
        className="h-[100%] w-[30%] bg-left drop-shadow-[0_5px_5px_rgba(0,0,0,.5)]"
        style={{ backgroundImage: `url(${LoginBackground})` }}
      >
        <div className="h-[100%] w-[100%] bg-stone-800/70">
          <center>
            <div className="pt-[50%] h-[500px]">
              <div className="text-2xl font-normal text-stone-100">
                <div>For registered personnel and</div>
                <div>loan consultants, please log in below:</div>
              </div>
              <div className="w-[90%] pt-2">
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
                      size="large"
                      name="Username"
                      placeholder="Email Address"
                      prefix={
                        <Space.Compact className="px-2 w-[40px]  text-stone-400">
                          <IoMail style={{ fontSize: 20 }} />
                        </Space.Compact>
                      }
                      autoComplete="off"
                      value={getAccount.Username}
                      onChange={handleChange}
                      className="h-[50px]"
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
                      size="large"
                      placeholder="Password"
                      maxLength={15}
                      visibilityToggle={{
                        visible: passwordVisible,
                        onVisibleChange: setPasswordVisible,
                      }}
                      prefix={
                        <Space.Compact className="px-2 w-[40px] text-stone-400">
                          <FaKey style={{ fontSize: 20 }} />
                        </Space.Compact>
                      }
                      autoComplete="off"
                      onChange={handleChange}
                      value={getAccount.Password}
                      className="h-[50px]"
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
                    <span className="font-bold text-sky-400 hover:text-cyan-300 text-base">
                      Unlock Account
                    </span>
                  </div>
                  <div
                    className="pt-2 pr-2 h-[10px] cursor-pointer"
                    onClick={() => {
                      setForgotStatus(true);
                    }}
                  >
                    <span className="font-bold text-sky-400 hover:text-cyan-300 text-base">
                      Forgot Password?
                    </span>
                  </div>
                </div>
                <div className="text-center pt-9">
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
                      className="text-2xl font-semibold w-[200px] h-[50px] bg-[#31b234]"
                      onClick={() => {
                        onClickLogin.mutate(navigate);
                      }}
                      onKeyUp={(e) => {
                        e.key === "enter" ? onClickLogin.mutate(navigate) : "";
                      }}
                      size="large"
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
      <div className="flex flex-wrap w-[100%] mt-[-180px]">
        <div className="pl-[3%]">
          <img src={Datos} alt="datos" height={70} width={70} />
        </div>
        <div className="pl-[3%] text-white w-[30%]" style={{ fontSize: 8 }}>
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
        <ConfigProvider
          theme={{ token: { colorSplit: "#ffffff", lineWidth: 2 } }}
        >
          <Divider className="h-[135px]" type="vertical" />
        </ConfigProvider>
        <div className="pl-[1%] text-white w-[30%]" style={{ fontSize: 10 }}>
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
                <span className="pt-[2px] pr-[5px]">
                  {<BsFillTelephoneFill />}
                </span>
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
