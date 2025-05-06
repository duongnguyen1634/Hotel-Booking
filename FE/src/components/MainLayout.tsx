import React from "react";
import { Layout, Menu } from "antd";
import { Outlet } from "react-router-dom";
const { Header, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
    // <Layout>
    //   <Header
    //     style={{
    //       position: "sticky",
    //       top: 0,
    //       zIndex: 1,
    //       width: "100%",
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       background: '#fff'
    //     }}
    //   >
    //     <Menu
    //       theme="light"
    //       style={{
    //         marginTop: "0px",
    //         marginRight: "0px",
    //         marginLeft: "auto",
    //       }}
    //       mode="horizontal"
    //       items={["Home", "Contract", "About"].map((key) => ({
    //         key,
    //         label: `. ${key}`,
    //       }))}
    //     />
    //   </Header>
    //   <Content
    //     className="site-layout"
    //     style={{
    //       padding: "0px",
    //       margin: "0",
    //       width: "100%",
    //       height: "100%",
    //       overflow: "auto"
    //     }}
    //   >

    //     <Outlet />
    //   </Content>
    //   <Footer style={{ textAlign: "center" }}>Hotel Booking System</Footer>
    // </Layout>
  );
};

export default MainLayout;
