// src/Pages/SupportTicketPage.jsx
import React from "react";

const SupportTicketPage = () => {
  return (
    <div className="min-h-screen bg-[#e6f7f7] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white border border-gray-200 shadow-lg rounded-2xl p-4">
        <h1 className="text-3xl font-bold text-[#0b7b7b] mb-4 text-center">
          Forgot Password - Support Ticket
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please fill out the form below to request password assistance.
        </p>
        <iframe
          id="zsfeedbackFrame"
          width="100%"
          height="550"
          text-color="green"
          name="zsfeedbackFrame"
          scrolling="no"
          frameBorder="0"
          style={{ border: 0 }}
          src="https://desk.zoho.in/support/fbw?formType=AdvancedWebForm&fbwId=edbsnfd683d940e08de6d3d6fcd82b7d2d1cffccd0703247a251850960183969be48f&xnQsjsdp=edbsn86faf6f9c4ce0f9a3e47a9f7f4011f09&mode=showNewWidget&displayType=iframe"
          title="Zoho Desk Support Form"
        />
      </div>
    </div>
  );
};

export default SupportTicketPage;