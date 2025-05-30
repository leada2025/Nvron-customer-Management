import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProductPage from "./Pages/ProductPage";
import OrderSummaryPage from "./Pages/OrderSummaryPage";
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import RequestServicePage from './Pages/RequestServicePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThankYouPage from './components/Thankyou';
import OrderDetailsPage from './Pages/OrderDetailsPage';


function AppWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/order-summary" element={<OrderSummaryPage />} />
        <Route path="/request-services" element={<RequestServicePage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
   

      </Routes>
        {!hideNavbar && <Footer />}
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
