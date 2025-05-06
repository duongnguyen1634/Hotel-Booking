import React from "react";
import { Outlet } from "react-router-dom";

const SSOLayout: React.FC = () => {
  return (
    <div>
      <h1>SSOLayout</h1>
      <Outlet />
    </div>
  );
};
export default SSOLayout;