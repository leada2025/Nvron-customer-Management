import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import CatalogPage from "./Pages/CatalogPage";
import OfferPage from "./Pages/OfferPage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import WelcomePage from "./Pages/WelcomePage";
import ProductPage from "./Pages/ProductPage";
import OrderSummaryPage from "./Pages/OrderSummaryPage";
import RequestServicePage from "./Pages/RequestServicePage";
import ThankYouPage from "./components/Thankyou";
import OrderHistoryPage from "./Pages/OrderHistoryPage";
import OrdersPage from "./Pages/Orders";
import ProfileSettings from "./Pages/ProfileSetting";
import NegotiatePricePage from "./Pages/NegotiatePricePage";
import NegotiationHistory from "./Pages/PriceDetails";
// import Dashboard from "./Pages/Dashboard";
import SupportTicketPage from "./Pages/SupportTicketPage"; 

// Admin
import AdminLayout from './admin/AdminLayout';
import AdminLogin from "./admin/components/AdminLogin";
import UsersPage from "./admin/components/UsersPage";
import ProductsPage from "./admin/components/ProductPage";
import PricingPage from "./admin/components/PricingPage";
import Orders from "./admin/components/OrdersPage";
import SettingsPage from "./admin/components/Setting";
import DashboardPage from "./admin/components/Dashboard";
import Unauthorized from "./admin/components/Unauthorized";
import RequirePermission from "./admin/components/RequirePermission";
import AdminServiceRequestsPage from "./admin/pages/AdminServiceRequestsPage";
import CustomerPage from "./admin/pages/CustomerPage";
import UnapprovedProductsPage from "./admin/pages/UnapprovedProductsPage";
import PricingProposalsPage from "./admin/pages/PricingProposalsPage";
import SalesNegotiationPanel from "./admin/pages/PriceRequest";
import NegotiationApprovalPage from "./admin/pages/PriceApproval";
import RequestPricingPage from "./admin/components/RequestPricingPage";
import SalesTargetPage from "./admin/pages/salesTarget";
import DistributorSignupPage from "./Pages/DistributorSignupPage";
import SignupForm from "./components/SignupForm";
import SignForm from "./Pages/SignForm";
import DistributorApprovalPage from "./admin/pages/DistributorApprovalPage";
import PartnerLoginForm from "./Pages/PartnersLogin";
import PayoutsPage from "./Pages/PayoutsPage";
import AdminPayoutsPage from "./admin/pages/CommissionPay";
import CustomerPages from "./Pages/CustomerPage";
import BankDetailsList from "./admin/pages/BankDetailsList";
import CommissionSettings from "./admin/components/CommissionSettings";
import OffersPage from "./admin/pages/OffersPage";
import AboutPage from "./Pages/AboutPage";
import PendingReviewPage from "./admin/pages/DistributorHoldRejectlist";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public */}
        {/* <Route path="/" element={<SignupPage />} /> */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin Login */}
        <Route
          path="/"
          element={token ? <Navigate to="/admin" replace /> : <AdminLogin setToken={setToken} />}
        />
        <Route path="/admin/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute redirectPath="/">
              <AdminLayout setToken={setToken} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<RequirePermission permission="Manage Users"><UsersPage /></RequirePermission>} />
          <Route path="products" element={<RequirePermission permission={["View Products"]}><ProductsPage /></RequirePermission>} />
          <Route path="customer" element={<RequirePermission permission={["Manage Users"]}><CustomerPage /></RequirePermission>} />
          <Route path="pricing" element={<RequirePermission permission={["Approve Pricing", "Manage Pricing", "View Products"]}><PricingPage /></RequirePermission>} />
          <Route path="orders" element={<RequirePermission permission={["Manage Orders"]}><Orders /></RequirePermission>} />
          <Route path="unapproved" element={<UnapprovedProductsPage />} />
          <Route path="proposals" element={<PricingProposalsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="requests" element={<AdminServiceRequestsPage />} />
          <Route path="priceconsole" element={<SalesNegotiationPanel />} />
          <Route path="priceapproval" element={<NegotiationApprovalPage />} />
          <Route path="request-pricing" element={<RequestPricingPage />} />
          <Route path="salestarget" element={<SalesTargetPage />} />
           <Route path="distributorrequest" element={<DistributorApprovalPage />} />
           <Route path="commissionpay" element={<AdminPayoutsPage />} />
<Route path="bank-details" element={<BankDetailsList />} />
<Route path="commission-settings" element={<CommissionSettings />} />
<Route path="offerspage" element={<OffersPage />} />
<Route path="pendingpartners" element={<PendingReviewPage />} />

        </Route>

  <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
              <Route path="/forgot-password" element={<SupportTicketPage />} />
        {/* User Routes */}
        <Route element={<UserLayout />}>
        <Route path="/catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />

          {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
        
          <Route path="/products" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
          <Route path="/order-summary" element={<ProtectedRoute><OrderSummaryPage /></ProtectedRoute>} />
          <Route path="/request-services" element={<ProtectedRoute><RequestServicePage /></ProtectedRoute>} />
          <Route path="/thank-you" element={<ProtectedRoute><ThankYouPage /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/order-historys" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          <Route path="/negotiate/:productId" element={<ProtectedRoute><NegotiatePricePage /></ProtectedRoute>} />
          <Route path="/negotiationhis" element={<ProtectedRoute><NegotiationHistory /></ProtectedRoute>} />
            <Route path="/offers" element={<OfferPage />} />
            <Route path="/payout" element={<PayoutsPage />} />
             <Route path="/customers" element={<CustomerPages/>} />
               <Route path="/aboutpage" element={<AboutPage/>} />



        </Route>
        <Route path="/distributor-signup" element={<DistributorSignupPage />} />
         <Route path="/signup" element={<SignForm />} />
         <Route path="/partner-login" element={<PartnerLoginForm />} />


      </Routes>
    </Router>
  );
}

export default App;