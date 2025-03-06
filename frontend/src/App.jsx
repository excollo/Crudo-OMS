import { Route, Routes } from "react-router-dom";
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
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgotPasswordPage />} />
        <Route path="/login-with-phone" element={<PhoneLoginPageComponent />} />
        <Route
          path="/password-recovery-confirmation"
          element={<NewPasswordPage />}
        />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        {/* Routes with sidebar */}
        <Route element={<Layout />}>
          {/* <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/track-order" element={<TrackOrder />} /> */}
          <Route path="/create-order" element={<CreateOrderPage />} />
          <Route path="/create-customer" element={<CreateCustomerPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          {/* <Route path="/audit-log" element={<AuditLog />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>
        <Route path="/profile" element={<Profile />} />
        {/* Catch-all route */}
        {/*<Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </>
  );
}

export default App;
