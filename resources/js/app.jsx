import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardUser from "./pages/user/DashboardUser";


ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/user/dashboard" element={<DashboardUser />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
