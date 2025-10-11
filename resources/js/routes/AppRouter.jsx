import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import LoginPage from "../auth/LoginPage";
import RegisterPage from "../auth/RegisterPage";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardUser from "../pages/user/DashboardUser";
import BooksList from "../pages/user/BooksList";
import GoogleSuccess from "../pages/GoogleSuccess";
import CategoryManager from "../pages/admin/CategoryManager";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                <Route path="/admin/category-manager" element={<CategoryManager />} />
                <Route path="/user/dashboard" element={<DashboardUser />} />
                <Route path="/google-success" element={<GoogleSuccess />} />
                <Route path="/user/book-list" element={<BooksList />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
