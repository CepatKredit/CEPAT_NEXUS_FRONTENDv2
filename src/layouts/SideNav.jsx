import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  ConfigProvider,
  Modal,
  Select,
  Space,
  Input,
} from "antd";
import Logo from "@assets/images/Nexus_v3a.png";
import small from "@assets/images/Nexus_v3a2.png";
import AccountSettings from "@containers/accountMenu/AccountSettings";
import DashMini from "@layouts/DashMini";
import SessionTimeout from "@auth/SessionTimeout";
import SideNavRoutes from "./SideNavRoutes";
import CepatChatbot from "@assets/images/cepatchatbot.png";
import CepatChatbotOpen from "@assets/images/cepat_girl.png";
import { GetData } from "@utils/UserData";
// import { Input } from "postcss";
import { SearchOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useWindowDimensions } from "@hooks/GetWindowScreenSize";
import { useQueryClient } from "@tanstack/react-query";
import { toDecrypt } from "@utils/Converter";
import { IoArrowDownCircle, IoArrowUpCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { SideNavState } from "@hooks/MiniDashController";


function SideNav() {
  //   const handleFilterChange = (e) => {
  //     setSearchValue(e.target.value);
  //   };

  //   const searchResult = () => {
  //     axios
  //       .get(`/wild-search/${userID}?searching=${value}`)
  //       .then((result) => {
  //         result.data;
  //       })
  //       .catch((error) => {
  //         console.error(error.message);
  //         throw new Error("Token generation failed.");
  //       });
  //   };
  //   const handleSearch = (value) => {
  //     const userID = jwtDecode(token).USRID;
  //     if (value.trim() !== "") {
  //       navigate(`/ckfi/searches/${userID}?searching=${value}`);
  //     }
  //   };
  document.title = "CKFI";
  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = React.useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [buttonPosition, setButtonPosition] = React.useState({
    top: 0,
    left: 0,
  });
  const [isChatbotVisible, setChatbotVisible] = React.useState(false);

  /* const handleMenuClick = ({ key }) => {
     if (key === "chatbot") {
       setChatbotVisible(true); // Show the ChatbotButton
     } else {
       setChatbotVisible(false); // Hide the ChatbotButton if any other menu item is clicked
       navigate(key); // Navigate only if it's not the chatbot
     }
   };*/
  /* const handleMenuClick = ({ key }) => {
     if (key === "chatbot") {
       setChatbotVisible(true); // Show the ChatbotButton
     } else {
       setChatbotVisible(false); // Hide the ChatbotButton if any other menu item is clicked
       navigate(key); // Navigate only if it's not the chatbot
     }
   };*/

  const [searchValue, setSearchValue] = React.useState("");
  const queryClient = useQueryClient();

  const { width } = useWindowDimensions();

 
  React.useEffect(() => {
    if (width <= 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [width]);

   /*React.useEffect(() => {
    console.log('chatbot.....', collapsed)
  },[collapsed])*/

  const getRightPosition = () => {
    if (width < 768) {
      return 'right-2';
    }
    if (width < 1024) {
      return 'right-2';
    }
    if (width < 1280) {
      return 'right-2';
    }
    return 'right-5';
  };
  const handleSearchClick = () => {
    const token = localStorage.getItem("UTK");
    const userID = jwtDecode(token).USRID
    if (searchValue.trim() !== "") {
      console.log(`Navigating to /ckfi/searches/${userID}/${searchValue}`);
      navigate(`/ckfi/searches/${userID}/${searchValue}`);
    }
  };

  const chatbotButtonRef = React.useRef(null);
  const navigate = useNavigate();
  let mini_dash = localStorage.getItem("SP");

  React.useEffect(() => {
    function unloadCallBack(e) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", unloadCallBack);
    return () => window.removeEventListener("beforeunload", unloadCallBack);
  }, []);

  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const updateButtonPosition = () => {
      if (chatbotButtonRef.current) {
        const { top, left } = chatbotButtonRef.current.getBoundingClientRect();
        setButtonPosition({ top, left });
      }
    };
    updateButtonPosition();
    window.addEventListener("resize", updateButtonPosition);
    return () => window.removeEventListener("resize", updateButtonPosition);
  }, []);

  const { isTableExpanded, toggleTableHeight } = SideNavState();
  const [isVisible, setIsVisible] = React.useState(true);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const isDashboard = location.pathname === "/ckfi/dashboard";

  return (
    <SessionTimeout>
      <Layout>
        <Sider
          className="h-[100vh] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-[100vw] md:w-[15vw] lg:w-[18vw] xl:w-[14vw] 2xl:w-[12vw] "
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="bg-stone-100 h-[100%]">
            {collapsed ? (
              <div className="h-[5em] bg-[#34b331]">
                <img src={small} alt="logo" className="h-[4.5em]" />
              </div>
            ) : (
              <center>
                <div className="h-[5em] bg-[#34b331]">
                  <img src={Logo} alt="logo" className="h-[5em] pb-2" />
                </div>
              </center>
            )}
            <div className="overflow-y-hidden hover:overflow-y-auto h-[110vh] xs1:h-[86.1vh] xs:h-[78.1vh] 2xl:h-[78vh]">
              <ConfigProvider
                theme={{
                  components: {
                    Menu: {
                      itemSelectedColor: "rgb(255, 255, 255)",
                      itemSelectedBg: "rgb(59, 7, 100)",
                      itemActiveBg: "rgb(114, 46, 209)",
                      itemHoverColor: "rgba(255, 255, 255, 0.88)",
                      itemHoverBg: "rgb(132, 85, 198)",
                    },
                  },
                }}
              >

                <Menu
                  className="mt-[5%] bg-stone-100"
                  onClick={({ key }) => {
                    navigate(key);
                    localStorage.setItem("SP", key);
                    queryClient.invalidateQueries(
                      ["ClientDataListQuery", toDecrypt(localStorage.getItem("SIDC"))],
                      { exact: true })
                  }}
                  ref={menuRef}
                  mode="inline"
                  defaultSelectedKeys={localStorage.getItem("SP")}
                  selectedKeys={localStorage.getItem("SP")}
                  items={SideNavRoutes(isChatbotVisible)?.map((x) => ({
                    key: x.key,
                    label: x.label,
                    icon: x.icon,
                    children: x.children,
                  }))}
                />



              </ConfigProvider>
            </div>

            {GetData("ROLE").toString() !== "20" && (
              <>
                <div
                  ref={chatbotButtonRef}
                  onClick={isModalOpen ? closeModal : openModal}
                  className="relative flex-col flex items-center cursor-pointer"
                  style={{ zIndex: 1050 }} // Set a high z-index
                  title="Open Chatbot"
                >
                  <img
                    src={isModalOpen ? CepatChatbotOpen : CepatChatbot}
                    alt="Chatbot Icon"
                    className={`${isModalOpen ? "w-22 h-24 mt-[-1rem]" : "w-18 h-20"
                      } transition-transform duration-200 hover:scale-105 hover:-translate-y-3`}
                  />
                </div>

                <Modal
                  // title="Chatbot"
                  open={isModalOpen}
                  onCancel={closeModal}
                  footer={null}
                  width={800}
                  style={{
                    position: "absolute",
                    left: buttonPosition.left || 110, // Adjusted for right alignment
                    top: buttonPosition.top - 520, // Adjust vertical position as needed
                    zIndex: 999,
                  }}
                  className="adjusted-modal-position"
                >
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/1_4jLvllPreXa-Tx-aPRr"
                    className="w-full h-[500px]"
                    allowFullScreen
                  />
                </Modal>
              </>
            )}

            <div className="flex flex-col justify-between">
              <div className="text-center">
                <span className="text-xs text-gray-600">v2.1.0</span>
              </div>
            </div>
          </div>
        </Sider>
        <Layout>
          <Header className="pl-[.5em] h-[5em] bg-gradient-to-r from-[#34b331] from-30% via-[#00ff00] via-12% to-[#187817]">
            <div className="flex flex-row">
              {width >= 640 && (
                <Button
                  type="text"
                  icon={
                    collapsed ? (
                      <MenuUnfoldOutlined style={{ fontSize: "1.3rem" }} />
                    ) : (
                      <MenuFoldOutlined style={{ fontSize: "1.3rem" }} />
                    )
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    width: 50,
                    height: 50,
                    marginLeft: 5,
                    marginTop: 10,
                    color: "white",
                  }}
                />
              )}
              <div className="flex flex-col xs1:flex-row items-center space-y-2 xs:space-y-0">
                <div className="mx-2 my-[4px]">
                  <span className="font-bold text-base xs1:text-[12px] xs:text-[12px] sm:text-lg text-stone-100">
                    Search
                  </span>
                </div>
                <Space.Compact className="flex flex-wrap xs:flex-nowrap">
                  <Select
                    placeholder="Filter"
                    className="w-[100px] xs1:w-[45px] xs2:w-[65px] xs:w-[90px] lg:w-[140px] xl:w-[160px]"
                    options={[
                      { label: "Loan ID", value: "loanID" },
                      { label: "Full Name", value: "name" },
                    ]}
                  />
                  <Input
                    placeholder="Search..."
                    allowClear
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-[120px] xs1:w-[50px] xs2:w-[70px] xs:w-[95px] lg:w-[170px] xl:w-[190px]"
                  />
                  <Button
                    type="default"
                    onClick={handleSearchClick}
                    icon={<SearchOutlined />}
                    className="w-full xs1:w-auto"
                  />
                </Space.Compact>
              </div>
              <div className={`my-[1.3rem] absolute ${getRightPosition()}`}>
                <AccountSettings />
              </div>
            </div>
          </Header>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultHoverBg: "rgba(255,255,255,0)",
                  onlyIconSize: 25,
                },
              },
            }}
          >
            <Content className="bg-white h-full overflow-hidden">
              <div className="relative">
                {!isDashboard && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0, height: isVisible ? "auto" : 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <center>
                      <div className="relative h-[7rem] w-[85vw] pt-[.5em] overflow-x-hidden hover:overflow-x-auto">
                        {isVisible && <DashMini />}
                      </div>
                    </center>
                  </motion.div>
                )}
                {!isDashboard && width >= 640 && (
                  <Button
                    shape="circle"
                    onClick={() => {
                      toggleVisibility();
                      toggleTableHeight();
                    }}
                    className={`ml-[6rem] fixed left-1/2 transform -translate-x-1/2 transition-all duration-300 ${isVisible ? "top-[11rem]" : "top-[4.2rem]"} z-10 bg-transparent border-none hover:bg-transparent opacity-50 hover:opacity-100`}
                    icon={
                      isTableExpanded ? (
                        <IoArrowDownCircle className="text-purple-900 text-2xl" />
                      ) : (
                        <IoArrowUpCircle className="text-purple-900 text-2xl" />
                      )
                    }
                    aria-label={isTableExpanded ? "Collapse" : "Expand"}
                  />
                )}
              </div>
              <Outlet />
            </Content>
          </ConfigProvider>
        </Layout>
      </Layout>




    </SessionTimeout>
  );
}

export default SideNav;