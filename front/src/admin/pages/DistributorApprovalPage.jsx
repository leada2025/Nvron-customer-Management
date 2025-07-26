import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "../components/UserModel";
import AssignExistingCustomersModal from "../components/AssignExistingCustomersModal"

const DistributorApprovalPage = () => {
  const [distributors, setDistributors] = useState([]);
  const [approvedDistributors, setApprovedDistributors] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [customerRoleId, setCustomerRoleId] = useState("");
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [expandedDistributorId, setExpandedDistributorId] = useState(null);
const [referredCustomers, setReferredCustomers] = useState({});

const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchDistributors();
    fetchApprovedDistributors();
    fetchCustomerRole();
    fetchAssignableUsers();
  }, []);

  const fetchDistributors = async () => {
    try {
      const { data } = await axios.get("/api/distributors/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDistributors(data);
    } catch (err) {
      console.error("Error fetching pending distributors:", err);
    }
  };
const fetchApprovedDistributors = async () => {
  try {
    const { data } = await axios.get("/api/distributors/approved", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // ✅ Remove duplicates by userId (if exists), otherwise _id
    const seenUserIds = new Set();
    const uniqueDistributors = [];

    for (const dist of data) {
      const idToCheck = dist.userId || dist._id;

      if (!seenUserIds.has(idToCheck)) {
        seenUserIds.add(idToCheck);
        uniqueDistributors.push(dist);
      }
    }

    setApprovedDistributors(uniqueDistributors);
  } catch (err) {
    console.error("Error fetching approved distributors:", err);
  }
};


  const fetchCustomerRole = async () => {
    try {
      const { data } = await axios.get("/admin/roles", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const customerRole = data.find((r) => r.name.toLowerCase() === "customer");
      if (customerRole) setCustomerRoleId(customerRole._id);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchAssignableUsers = async () => {
    try {
      const { data } = await axios.get("/admin/users/assignable", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignableUsers(data);
    } catch (err) {
      console.error("Error fetching assignable users:", err);
    }
  };

  const handleApproveClick = (distributor) => {
    setSelectedDistributor(distributor);
    console.log("Selected distributor password:", distributor.password); 
    setAddModalOpen(true);
  };

const handleCreateFromDistributor = async (userData) => {
  try {
    const createResponse = await axios.post("/admin/users", userData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const newUserId = createResponse.data?.user?._id || createResponse.data?._id;

    if (createResponse.status === 201 || createResponse.status === 200) {
      if (distributors.find((d) => d._id === selectedDistributor._id)) {
        const approveResponse = await axios.patch(
          `/api/distributors/approve/${selectedDistributor._id}`,
          { userId: newUserId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (approveResponse.status === 200) {
          alert("Distributor approved and user created.");
        } else {
          alert("User created, but distributor approval failed.");
        }
      } else {
        alert("User created.");
      }

      fetchDistributors();
      fetchApprovedDistributors();
      setAddModalOpen(false);
      setSelectedDistributor(null);
    } else {
      alert("Failed to create user.");
    }
  } catch (err) {
    console.error("Error during user creation/approval:", err);
    alert("Failed to create user or approve distributor.");
  }
};

const handleHoldDistributor = async (id) => {
  if (window.confirm("Put this distributor on hold?")) {
    try {
      await axios.patch(`/api/distributors/hold/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Distributor put on hold.");
      fetchDistributors();
    } catch (err) {
      console.error("Hold failed:", err);
      alert("Failed to put distributor on hold.");
    }
  }
};

const handleRejectDistributor = async (id) => {
  if (window.confirm("Reject this distributor?")) {
    try {
      await axios.patch(`/api/distributors/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Distributor rejected.");
      fetchDistributors();
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject distributor.");
    }
  }
};


  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-[#f7fafc] space-y-12">
      {/* Pending Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#0b7b7b] mb-6">Pending Distributor Approvals</h2>

        {distributors.length === 0 ? (
          <p className="text-gray-500">No pending distributors found.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#e6f7f7] text-[#0b7b7b]">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {distributors.map((d) => (
                  <tr key={d._id} className="border-t hover:bg-[#f0fdfd]">
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.email}</td>
                    <td className="p-3">{d.phone}</td>
                    <td className="p-3 text-center">
                     <div className="space-x-2">
  <button
    onClick={() => handleApproveClick(d)}
    className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-4 py-1 rounded-md text-sm"
  >
    Approve
  </button>

  <button
    onClick={() => handleHoldDistributor(d._id)}
    className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-4 py-1 rounded-md text-sm"
  >
    Hold
  </button>

  <button
    onClick={() => handleRejectDistributor(d._id)}
    className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-4 py-1 rounded-md text-sm"
  >
    Reject
  </button>
</div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approved Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#0b7b7b] mb-6">Approved Distributors</h2>

        {approvedDistributors.length === 0 ? (
          <p className="text-gray-500">No approved distributors yet.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#0b7b7b] text-white">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3 text-center">Add Customer</th>

                </tr>
              </thead>
              <tbody>
           {approvedDistributors.map((d) => (
  <React.Fragment key={d._id}>
    <tr
      onClick={async () => {
        if (expandedDistributorId === d._id) {
          setExpandedDistributorId(null);
          return;
        }
        setExpandedDistributorId(d._id);

        if (!referredCustomers[d._id]) {
          try {
            const res = await axios.get(`/api/distributors/${d.userId}/customers`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setReferredCustomers((prev) => ({ ...prev, [d._id]: res.data }));
          } catch (err) {
            console.error("Error fetching referred customers:", err);
          }
        }
      }}
      className="border-t hover:bg-green-50 cursor-pointer"
    >
      <td className="p-3">{d.name}</td>
      <td className="p-3">{d.email}</td>
      <td className="p-3">{d.phone}</td>
      <td className="p-3 text-center">
   <button
  onClick={(e) => {
    e.stopPropagation();
    setSelectedDistributor({ ...d, userId: d.userId });
    setAddModalOpen(true);
  }}
  className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-3 py-1 rounded text-sm mr-2"
>
  + Add Customer
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    setSelectedDistributor({ ...d, userId: d.userId });
    setShowAssignModal(true);
  }}
  className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-3 py-1 rounded text-sm"
>
  Assign Existing
</button>

      </td>
    </tr>

    {expandedDistributorId === d._id && referredCustomers[d._id] && (
      <tr className="bg-white">
        <td colSpan={4} className="p-4 border-t">
          <h4 className="text-sm font-semibold mb-2 text-[#0b7b7b]">Referred Customers:</h4>
          {referredCustomers[d._id].length === 0 ? (
            <p className="text-gray-500 text-sm">No referred customers found.</p>
          ) : (
            <table className="w-full text-sm border rounded">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                 
                  <th className="p-2 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {referredCustomers[d._id].map((cust) => (
                  <tr key={cust._id} className="border-t">
                    <td className="p-2">{cust.name}</td>
                    <td className="p-2">{cust.email}</td>
                   
                    <td className="p-2">{new Date(cust.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </td>
      </tr>
    )}
  </React.Fragment>
))}

              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
     {addModalOpen && selectedDistributor && (
  <UserModal
    user={null}
    prefill={
      // Only pass prefill when it's from pending distributor approval (i.e., Approve button flow)
      distributors.some(d => d._id === selectedDistributor._id)
        ? {
            name: selectedDistributor.name,
            email: selectedDistributor.email,
            role: customerRoleId,
            roleName: "Customer",
            position: "Partners",
            password: selectedDistributor.password,
          }
        : {}
    }
    onClose={() => {
      setAddModalOpen(false);
      setSelectedDistributor(null);
    }}
    onSave={handleCreateFromDistributor}
    allRoles={[{ _id: customerRoleId, name: "Customer", permissions: [] }]}
    assignableUsers={assignableUsers}
    partners={approvedDistributors.filter(d => d.userId)}
    addViaDistributor={true}
    partnerUserId={selectedDistributor.userId}
  />
)}

{showAssignModal && selectedDistributor && (
  <AssignExistingCustomersModal
    distributor={selectedDistributor}
    onClose={() => {
      setShowAssignModal(false);
      setSelectedDistributor(null);
    }}
    onAssigned={() => {
      fetchApprovedDistributors(); // refresh list
      if (expandedDistributorId === selectedDistributor._id) {
        setExpandedDistributorId(null); // force close and re-fetch
      }
    }}
  />
)}


    </div>
  );
};

export default DistributorApprovalPage;
