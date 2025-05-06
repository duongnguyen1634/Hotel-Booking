import React from "react";
import { Menu } from "antd";
import {
  HomeFilled,
  DashboardFilled,
  AppstoreFilled,
  AccountBookFilled,
  SettingFilled,
  MehFilled,
  CopyFilled,
  QuestionCircleFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../SSO/Login/useAuth";

const HotelMenuList: React.FC = () => {
  const { logoutUser } = useAuth();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/hotel/booking")) {
      return "booking";
    }
    if (path.startsWith("/hotel/room")) {
      return "room";
    }
    if (path.startsWith("/hotel/settings")) {
      return "settings";
    }
    if (path.startsWith("/hotel/settings/")) {
      if (path === "/hotel/settings/hotelinf") {
        return "hotel_infomation"; // Select Hotel Information
      } else if (path === "/hotel/settings/account") {
        return "account"; // Select Account
      }
      return "settings";
    }
    if (path.startsWith("/hotel/dashboard")) {
      return "bookingdashboard";
    }
    if (path.startsWith("/hotel")) {
      return "home";
    }
    return "";
  };

  return (
    <Menu
      theme="light"
      mode="inline"
      className="MenuBar"
      style={{
        background: "#1F618D",
      }}
      selectedKeys={[getSelectedKey()]}
    >
      <Menu.Item key="home" icon={<HomeFilled />}>
        <Link to="/hotel">
          <span className="span-text">Home</span>
        </Link>
      </Menu.Item>

      {/* <Menu.SubMenu
        key="dashboard"
        icon={<DashboardFilled />}
        title="Dashboard"
      > */}
      <Menu.Item key="bookingdashboard" icon={<AccountBookFilled />}>
        <Link to="/hotel/dashboard">
          <span className="span-text">Dashboard</span>
        </Link>
      </Menu.Item>
      {/* <Menu.Item key="guestdashboard" icon={<MehFilled />}>
          Guest
        </Menu.Item>
      </Menu.SubMenu> */}

      <Menu.Item key="room" icon={<AppstoreFilled />}>
        <Link to="/hotel/room">
          <span className="span-text">Room</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="booking" icon={<AccountBookFilled />}>
        <Link to="/hotel/booking">
          <span className="span-text">Booking</span>
        </Link>
      </Menu.Item>

      <Menu.SubMenu key="settings" icon={<SettingFilled />} title="Settings">
        <Menu.Item key="hotel_infomation" icon={<CopyFilled />}>
          <Link to="/hotel/settings/hotelinf">
            <span className="span-text">Hotel</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="account" icon={<CopyFilled />}>
          <Link to="/hotel/settings/account">
            <span className="span-text">Account</span>
          </Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="help" icon={<QuestionCircleFilled />}>
        <span className="span-text">Help</span>
      </Menu.Item>
      <Menu.Item key="menu" icon={<LogoutOutlined />} onClick={logoutUser}>
        <Link to="/">
          <span className="span-text">Logout</span>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default HotelMenuList;
