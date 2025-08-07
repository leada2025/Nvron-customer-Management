// src/Pages/LoginPage.jsx
import React from "react";
import LoginForm from "../components/LoginForm";
import { Helmet } from "react-helmet-async";


const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Helmet>
  <title>Login | Fishman B2B</title>
  <meta name="description" content="Login to your Fishman B2B account and manage orders." />
  <meta name="keywords" content="Fishman login, B2B login, order management" />
</Helmet>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
