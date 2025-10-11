import React from "react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <SidebarAdmin />
      <div className="flex-1 ml-64 p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
