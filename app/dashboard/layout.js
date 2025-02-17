import React from "react";
import SideBar from "./Components/SideBar";

function DashboardLayout({ children }) {
  return (
    <div>
      <div>
        <SideBar />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default DashboardLayout;
