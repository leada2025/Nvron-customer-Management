import React from "react";

const RequestServicePage = () => {
  return (
    <div className="min-h-screen bg-[#e6f7f7] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white border border-gray-200 shadow-lg rounded-2xl p-4">
        <h1 className="text-3xl font-bold text-[#0b7b7b] mb-4">
          Submit a Support Ticket
        </h1>
        <iframe
          id="zsfeedbackFrame"
          width="100%"
          height="600"
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

export default RequestServicePage;
