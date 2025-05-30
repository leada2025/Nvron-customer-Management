
import React from "react";

const ProductCard = ({ product, onAddToOrder }) => {
  const {
    productName,
    packing,
    dosageForm,
    description,
    tax,
    mrp,
    netRate,
  } = product;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-2">{productName}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-sm text-gray-500 mb-2">
        {dosageForm} • {packing}
      </p>

      <div className="text-sm mb-2">
        <p>MRP: ₹{mrp}</p>
        <p>Net Rate: ₹{netRate}</p>
        <p>Tax: {tax}%</p>
      </div>

      <button
        onClick={() => onAddToOrder(product)}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Add to Order
      </button>
    </div>
  );
};

export default ProductCard;
