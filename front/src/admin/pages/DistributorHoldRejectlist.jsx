import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import UserModal from "../components/UserModel";

const PendingReviewPage = () => {
  const [pendingDistributors, setPendingDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [customerRoleId, setCustomerRoleId] = useState("");
  const [assignableUsers, setAssignableUsers] = useState([]);

  useEffect(() => {
    fetchDistributors();
    fetchCustomerRole();
    fetchAssignableUsers();
  }, []);

  const fetchDistributors = async () => {
    try {
      const { data } = await axios.get("/api/distributors/pending-review", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPendingDistributors(data.distributors || []);
    } catch (err) {
      console.error("Error fetching hold/rejected distributors:", err);
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
      setAssignableUsers(data || []);
    } catch (err) {
      console.error("Error fetching assignable users:", err);
    }
  };

  const handleApproveClick = (distributor) => {
    setSelectedDistributor(distributor);
    setAddModalOpen(true);
  };

  const handleCreateFromDistributor = async (userData) => {
    try {
      const createResponse = await axios.post("/admin/users", userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const newUserId = createResponse.data?.user?._id || createResponse.data?._id;

      if (createResponse.status === 201 || createResponse.status === 200) {
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

        fetchDistributors();
        setAddModalOpen(false);
        setSelectedDistributor(null);
      } else {
        alert("Failed to create user.");
      }
    } catch (err) {
      console.error("Error during approval:", err);
      alert("Failed to create user or approve distributor.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-[#f7fafc] space-y-12">
      <h2 className="text-2xl font-bold text-[#0b7b7b] mb-6">Hold & Rejected Distributors</h2>

      {pendingDistributors.length === 0 ? (
        <p className="text-gray-500">No distributors in hold or rejected status.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#e6f7f7] text-[#0b7b7b]">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingDistributors.map((d) => (
                <tr key={d._id} className="border-t hover:bg-[#f0fdfd]">
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">{d.email}</td>
                  <td className="p-3">{d.phone}</td>
                  <td className="p-3 capitalize">{d.status}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleApproveClick(d)}
                      className="bg-[#0b7b7b] hover:bg-[#095e5e] text-white px-4 py-1 rounded-md text-sm"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {addModalOpen && selectedDistributor && (
        <UserModal
          user={null}
          prefill={{
            name: selectedDistributor.name,
            email: selectedDistributor.email,
            role: customerRoleId,
            roleName: "Customer",
            position: "Partners",
            password: selectedDistributor.password,
          }}
          onClose={() => {
            setAddModalOpen(false);
            setSelectedDistributor(null);
          }}
          onSave={handleCreateFromDistributor}
          allRoles={[{ _id: customerRoleId, name: "Customer", permissions: [] }]}
          assignableUsers={assignableUsers}
          partners={[]}
          addViaDistributor={true}
          partnerUserId={selectedDistributor.userId}
        />
      )}
    </div>
  );
};

export default PendingReviewPage;
