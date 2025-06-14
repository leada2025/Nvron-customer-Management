import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/Axios";

const NegotiatePricePage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [proposedPrice, setProposedPrice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await API.get(`api/products/${productId}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [productId]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!proposedPrice || Number(proposedPrice) <= 0) {
    return alert("Please enter a valid proposed price.");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to negotiate a price.");
    return navigate("/login");
  }

  try {
    await API.post(
      "api/negotiations",
      { productId, proposedPrice },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Request submitted!");
    navigate("/products");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error submitting negotiation request");
  }
};



  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Negotiate Price for {product.name}</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Your Proposed Price (₹):
          <input
            type="number"
            className="w-full p-2 border rounded mt-1"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default NegotiatePricePage;
