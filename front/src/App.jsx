import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProductPage from "./Pages/ProductPage";
import OrderSummaryPage from "./Pages/OrderSummaryPage";
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import RequestServicePage from './Pages/RequestServicePage';

import Footer from './components/Footer';
import ThankYouPage from './components/Thankyou';
import OrderDetailsPage from './Pages/OrderDetailsPage';
import OrdersRedirectPage from './Pages/OrdersRedirectPage';
import OrderHistoryPage from './Pages/OrderHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';


import Sidebar from './components/Sidebar'; // updated
import WelcomePage from './Pages/WelcomePage';
import OrdersPage from './Pages/Orders';
import Dashboard from './Pages/Dashboard';
import Navbar from './Pages/Navbar';
import ProfileSettings from './Pages/ProfileSetting';
import NegotiatePricePage from './Pages/NegotiatePricePage';
import NegotiationHistory from './Pages/PriceDetails';


function AppWrapper() {
  const location = useLocation();
  const hideSidebar = ["/", "/login", "/welcome"].includes(location.pathname);


  return (
    <>
   
    
      {!hideSidebar && <Sidebar />}
     <div className={`${!hideSidebar ? "md:ml-61" : ""} min-h-screen `}>
       {!hideSidebar && <Navbar />}
        <Routes>
          <Route path="/" element={<SignupPage />} />
           <Route path="/dashboard" element={<Dashboard />} />
            

          <Route path="/login" element={<LoginPage />} />
          <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
          <Route path="/order-historys" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />


          <Route path="/products" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
          <Route path="/order-summary" element={<ProtectedRoute><OrderSummaryPage /></ProtectedRoute>} />
          <Route path="/request-services" element={<ProtectedRoute><RequestServicePage /></ProtectedRoute>} />
          <Route path="/thank-you" element={<ProtectedRoute><ThankYouPage /></ProtectedRoute>} />
          {/* <Route path="/order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersRedirectPage /></ProtectedRoute>} /> */}
          <Route path="/order-history" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
<Route path="/negotiate/:productId" element={<NegotiatePricePage />} />
<Route path="/negotiationhis" element={<NegotiationHistory />} />

        </Routes>
        {!hideSidebar && <Footer />}
      </div>
    </>
  );
}


function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
