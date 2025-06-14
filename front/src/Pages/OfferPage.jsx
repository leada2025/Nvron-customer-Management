// pages/OfferPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/Axios";

const OfferPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/offers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOffers(response.data);
      } catch (error) {
        console.error("Failed to load offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading offers...</div>;
  }

  if (offers.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No offers available at the moment.
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#f9fafb]">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Current Offers</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800">{offer.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
            {offer.discount && (
              <p className="mt-2 text-green-600 font-medium">
                Save {offer.discount}% on this offer!
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Valid till: {new Date(offer.validTill).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferPage;
