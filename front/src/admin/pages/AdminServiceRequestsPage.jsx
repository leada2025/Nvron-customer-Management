import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const AdminServiceRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRequests(res.data);
    } catch (err) {
      setError("Failed to fetch service requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `/api/requests/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchRequests();
    } catch (err) {
      alert("Error updating status");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white min-h-screen max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Customer Service Requests</h2>

      {Array.isArray(requests) && requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-1">{req.title}</h3>
              <p className="text-sm text-gray-600">{req.description}</p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <div>
                  Submitted by: <span className="text-gray-700 font-medium">{req.customerId?.name}</span> (
                  {req.customerId?.email})
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "reviewed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>

                <select
                  className="ml-auto border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none"
                  value={req.status}
                  onChange={(e) => updateStatus(req._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No service requests found.</p>
      )}
    </div>
  );
};

export default AdminServiceRequestsPage;
