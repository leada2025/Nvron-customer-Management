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

    console.log("Service requests response data:", res.data);

    setRequests(res.data); // <--- HERE: Use res.data directly since it's already an array
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
      fetchRequests(); // Refresh after update
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
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Customer Service Requests</h2>
      {Array.isArray(requests) && requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-4 border rounded-xl shadow-sm bg-gray-50"
            >
              <h3 className="text-lg font-semibold">{req.title}</h3>
              <p className="text-gray-700">{req.description}</p>
              <p className="text-sm mt-2 text-gray-600">
                Submitted by: <strong>{req.customerId?.name}</strong> (
                {req.customerId?.email})
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    req.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : req.status === "reviewed"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {req.status}
                </span>
                <select
                  className="ml-auto border px-2 py-1 rounded"
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
        <p>No service requests found.</p>
      )}
    </div>
  );
};

export default AdminServiceRequestsPage;
