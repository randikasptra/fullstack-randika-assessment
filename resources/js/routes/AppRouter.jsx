import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import LoginPage from "../auth/LoginPage";
import RegisterPage from "../auth/RegisterPage";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardUser from "../pages/user/DashboardUser";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/user/dashboard" element={<DashboardUser />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
