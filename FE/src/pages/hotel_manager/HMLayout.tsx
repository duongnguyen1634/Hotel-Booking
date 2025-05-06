import React, { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import HotelMenuList from "./MenuList";
import { Button, Layout, theme } from "antd";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
// import { Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const HMLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(
    localStorage.getItem("menuCollapsed") === "true"
  );
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  useEffect(() => {
    // Save the collapsed state to localStorage whenever it changes
    localStorage.setItem("menuCollapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    // Reset or re-fetch the collapsed state on page load or navigation
    setCollapsed(localStorage.getItem("menuCollapsed") === "true");
  }, [location]);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        // theme="light"
        
        style={{
          background: "#1F618D",
          height: "100vh",
          overflow: "auto",
          top: 0,
          bottom: 0,
          position: "fixed",
          insetInlineStart: 0,
          zIndex: 1,
        }}
      >
        <div className="demo-logo-vertical" />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            // background: "#34495E",
            color: "black",
            fontSize: "20px",
            width: 40,
            height: 80,
          }}
        />
        <HotelMenuList />
      </Sider>
      <Layout>
        <Content
          style={{
            marginLeft: "120px",
            padding: 0,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HMLayout;
