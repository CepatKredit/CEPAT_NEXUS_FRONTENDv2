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
import Logo from "@assets/images/Nexus_v3a2.png";
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
  const [searchValue, setSearchValue] = React.useState("");

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

  return (
    <SessionTimeout>
      <Layout>
        <Sider
          width={"12vw"}
          className="h-[100vh] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
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
                <img src={Logo} alt="logo" className="h-[5.5em] pb-2" />
              </div>
              </center>
            )}
            <div className="overflow-y-hidden hover:overflow-y-auto h-[90vh]">
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
                  }}
                  ref={menuRef}
                  mode="inline"
                  defaultSelectedKeys={localStorage.getItem("SP")}
                  selectedKeys={localStorage.getItem("SP")}
                  items={SideNavRoutes()?.map((x) => ({
                    key: x.key,
                    label: x.label,
                    icon: x.icon,
                    children: x.children,
                  }))}
                />
              </ConfigProvider>

              <div className=" text-center p-2 fixed bottom-0 w-[12vw]">
                <span className="text-xs text-gray-600">v2.0.1</span>
              </div>
            </div>
          </div>
        </Sider>
        <Layout>
          <Header className="pl-[.5em] h-[5em] bg-gradient-to-r from-[#34b331] from-30% via-[#00ff00] via-12% to-[#187817]">
            <div className="flex flex-row">
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
              <div className="flex flex-row items-center">
                <div className="mx-2 my-[4px]">
                  <span className="font-bold text-lg text-stone-100">
                    Search
                  </span>
                </div>
                <Space.Compact>
                  <Select
                    placeholder="filter search"
                    style={{ width: 110 }}
                    options={[
                      { label: "Loan ID", value: "loanID" },
                      {
                        label: "Full Name",
                        value: "name",
                      },
                    ]}
                  />
                  <Input
                    placeholder="search..."
                    allowClear
                    style={{ width: 170 }}
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button
                    type="default"  
                    onClick={handleSearchClick}
                    icon={<SearchOutlined />}
                  />
                </Space.Compact>
              </div>
              <div className="my-[1.3rem] absolute right-5">
                <AccountSettings />
              </div>
            </div>
          </Header>
          <Content className="bg-white h-full">
            {mini_dash !== "/ckfi/dashboard" ? (
              <center>
                <div className="h-[7rem] w-[85vw] pt-[.5em] overflow-x-hidden hover:overflow-x-auto">
                  <DashMini />
                </div>
              </center>
            ) : (
              <></>
            )}
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      {GetData("ROLE").toString() !== "20" && (
        <>
          <div
            ref={chatbotButtonRef}
            onClick={isModalOpen ? closeModal : openModal}
            className="fixed bottom-[-.6rem] right-[1%] flex items-center justify-center cursor-pointer"
            style={{ zIndex: 1050 }} // Set a high z-index
            title="Open Chatbot"
          >
            <img
              src={isModalOpen ? CepatChatbotOpen : CepatChatbot}
              alt="Chatbot Icon"
              className={`${
                isModalOpen ? "w-22 h-24" : "w-18 h-20"
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
              right: buttonPosition.right || 110, // Adjusted for right alignment
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
    </SessionTimeout>
  );
}

export default SideNav;
