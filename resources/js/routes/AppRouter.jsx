import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import auth pages
import LoginPage from "../auth/LoginPage";
import RegisterPage from "../auth/RegisterPage";
import GoogleSuccess from "../pages/GoogleSuccess";

// Import admin pages
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import AdminOrders from "../pages/admin/AdminOrders";
import BooksManager from "../pages/admin/BooksManager";
import CategoryManager from "../pages/admin/CategoryManager";
import UsersManager from "../pages/admin/UsersManager";
import SettingsAdmin from "../pages/admin/SettingsAdmin";
import OrderDetailAdmin from "../pages/admin/OrderDetailAdmin";
import TransactionHistory from "../pages/admin/TransactionHistory";

// Import user pages
import DashboardUser from "../pages/user/DashboardUser";
import BooksList from "../pages/user/BooksList";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Payment from "../pages/user/Payment";
import Orders from "../pages/user/Orders";
import OrderDetail from "../pages/user/OrderDetail";
import Profile from "../pages/user/Profile";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/google-success" element={<GoogleSuccess />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                <Route path="/admin/orders-list" element={<AdminOrders />} />
                <Route path="/admin/category-manager" element={<CategoryManager />} />
                <Route path="/admin/users-manager" element={<UsersManager />} />
                <Route path="/admin/books-manager" element={<BooksManager />} />
                <Route path="/admin/settings-admin" element={<SettingsAdmin />} />
                <Route path="/admin/history-transaction" element={<TransactionHistory />} />
                {/* Revisi di sini: Tambah :id untuk dynamic route */}
                <Route path="/admin/detail-orders/:id" element={<OrderDetailAdmin />} />

                {/* User Routes */}
                <Route path="/user/dashboard" element={<DashboardUser />} />
                <Route path="/user/book-list" element={<BooksList />} />

                {/* 🛒 E-Commerce Routes */}
                <Route path="/user/cart" element={<Cart />} />
                <Route path="/user/checkout" element={<Checkout />} />
                <Route path="/user/payment/:orderId" element={<Payment />} />
                <Route path="/user/orders" element={<Orders />} />
                <Route path="/user/profile-users" element={<Profile />} />
                <Route path="/user/orders/:id" element={<OrderDetail />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
