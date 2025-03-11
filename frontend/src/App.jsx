// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Homepage/HomePage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import PhoneLoginPageComponent from "./components/Auth-Component/LoginWithPhone";
import ForgotPasswordPage from "./pages/Auth/ForgetpasswordPage";
import NewPasswordPage from "./pages/Auth/NewPassword";
import OTPVerificationPage from "./pages/Auth/OtpVerificationPage";
import CreateOrderPage from "./pages/Orders/CreateOrderPage";
import Layout from "./pages/Homepage/Layout";
import CreateCustomerPage from "./pages/Orders/CreateCustomerPage";
import NotificationPage from "./pages/NotificationPage/NotificationPage";
import Profile from "./pages/Homepage/ProfilePage.jsx/Profile";
import ProtectedRoute from "./pages/Homepage/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import SidebarLayout from "./pages/Homepage/SidebarLayout";

function App() {
  const isAuthenticated = localStorage.getItem("token") !== null; // Check if user is logged in

  return (
    <>
      <Routes>
        {/* Public routes - accessible without authentication */}
        {/* <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        /> */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/login-with-phone" element={<PhoneLoginPageComponent />} />
        <Route path="/reset-password/:token" element={<NewPasswordPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route
          path="/password-recovery-confirmation/reset-password/:token"
          element={<NewPasswordPage />}
        />

        <Route path="/verify-otp" element={<OTPVerificationPage />} />

        {/* Protected routes - require authentication */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-order" element={<CreateOrderPage />} />
            <Route path="/create-customer" element={<CreateCustomerPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            {/* Add other protected routes with Layout here */}
          </Route>
          <Route element={<SidebarLayout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        {/* Catch-all Route */}
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
}

export default App;
