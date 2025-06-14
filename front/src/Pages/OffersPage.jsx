import React from "react";

const OfferCard = ({ offer }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center p-4">
    <img src="https://via.placeholder.com/100" alt={offer.name} className="mb-2" />
    <h3 className="text-md font-semibold text-gray-800 text-center">{offer.name}</h3>
    <p className="text-gray-600 text-sm text-center">{offer.description}</p>
    <p className="text-green-600 font-semibold text-center mt-2">{offer.discount}</p>
  </div>
);

const OffersPage = () => {
  const offers = [
    { id: 1, name: "Amlaron", description: "Amlodipine 2.5 / 5 mg", discount: "Flat 20% OFF" },
    { id: 2, name: "Bisoron", description: "Bisoprolol Fumarate 2.5 / 5 mg", discount: "10% OFF + Free Gifts" },
    { id: 3, name: "UpiViron", description: "Atorvastatin 10/20/40 mg", discount: "Save Up to 30%" },
    { id: 4, name: "CilNiron", description: "Cilnidipine 5 / 10 mg", discount: "40-50% OFF" },
    { id: 5, name: "One on XL", description: "Metoprolol Succinate 25 / 50 mg + Amlodipine 5 mg", discount: "Buy 1 Get 1 Free" },
    { id: 6, name: "One on XL", description: "Metoprolol Succinate 25 / 50 mg", discount: "40-50% OFF" },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export default OffersPage; 