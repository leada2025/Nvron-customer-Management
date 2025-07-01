import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

export default function BankDetailsList() {
  const [bankDetails, setBankDetails] = useState([]);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await axios.get("/api/bank-details");
        setBankDetails(res.data);
      } catch (err) {
        console.error("Error fetching bank details:", err);
      }
    };

    fetchBankDetails();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#0b7b7b]">All Bank Details</h2>
      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#0b7b7b] text-white">
            <tr>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Account Holder</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Account Number</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">IFSC</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Bank Name</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Branch</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {bankDetails.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{item.userId?.name}</div>
                  <div className="text-xs text-gray-500">{item.userId?.email}</div>
                </td>
                <td className="px-6 py-4">{item.accountHolder}</td>
                <td className="px-6 py-4">{item.accountNumber}</td>
                <td className="px-6 py-4">{item.ifsc}</td>
                <td className="px-6 py-4">{item.bankName}</td>
                <td className="px-6 py-4">{item.branch}</td>
              </tr>
            ))}
            {bankDetails.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No bank details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
