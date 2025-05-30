import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = ({ products }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addedProductNames, setAddedProductNames] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // On mount, load order items from localStorage
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
    setOrderItems(savedItems);

    // Set of productNames already added to order
    const names = new Set(savedItems.map((item) => item.productName));
    setAddedProductNames(names);

    // Map productName -> quantity for quantity inputs
    const qtyMap = {};
    savedItems.forEach((item) => {
      qtyMap[item.productName] = Number(item.quantity) || 1;
    });
    setQuantities(qtyMap);
  }, []);

  // Change quantity for a product (min 1)
  const handleQuantityChange = (productName, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[productName] || 1) + delta);
      return { ...prev, [productName]: newQty };
    });
  };

  // Add or Remove product from order
  const handleToggleAdd = (product) => {
    const isAlreadyAdded = addedProductNames.has(product.productName);

    if (isAlreadyAdded) {
      // Remove product from order
      const updatedOrder = orderItems.filter(
        (p) => p.productName !== product.productName
      );
      const newAddedNames = new Set(updatedOrder.map((item) => item.productName));

      setOrderItems(updatedOrder);
      setAddedProductNames(newAddedNames);
      localStorage.setItem("orderItems", JSON.stringify(updatedOrder));
    } else {
      // Add product to order with normalized quantity, netRate, tax
      const quantity = Number(quantities[product.productName]) || 1;
      const updatedItem = {
        ...product,
        quantity,
        netRate: Number(product.netRate) || 0,
        tax: Number(product.tax) || 0,
      };

      // Remove existing entry with same productName (if any) then add new
      const updatedOrder = [
        ...orderItems.filter((p) => p.productName !== product.productName),
        updatedItem,
      ];
      const newAddedNames = new Set(updatedOrder.map((item) => item.productName));

      setOrderItems(updatedOrder);
      setAddedProductNames(newAddedNames);
      localStorage.setItem("orderItems", JSON.stringify(updatedOrder));
    }
  };

  // Paginate products
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <table className="w-full border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Dosage Form</th>
            <th className="px-4 py-2">Packing</th>
            <th className="px-4 py-2">MRP</th>
            <th className="px-4 py-2">Net Rate</th>
            <th className="px-4 py-2">Tax</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product, index) => {
            const isAdded = addedProductNames.has(product.productName);
            const qty = quantities[product.productName] || 1;

            return (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${isAdded ? "bg-green-50" : ""} border-t`}
              >
                <td className="px-4 py-2 font-semibold">{product.productName}</td>
                <td className="px-4 py-2 text-gray-600">{product.description}</td>
                <td className="px-4 py-2">{product.dosageForm}</td>
                <td className="px-4 py-2">{product.packing}</td>
                <td className="px-4 py-2">₹{product.mrp}</td>
                <td className="px-4 py-2">₹{product.netRate}</td>
                <td className="px-4 py-2">{product.tax}%</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {/* Quantity Control */}
                    <div className="flex items-center gap-1">
  <button
    onClick={() => handleQuantityChange(product.productName, -1)}
    className="px-2 py-1 bg-gray-200 rounded"
    disabled={isAdded}
  >
    −
  </button>
  <input
    type="number"
    min="1"
    value={qty}
    disabled={isAdded}
    onChange={(e) => {
      const value = Math.max(1, parseInt(e.target.value) || 1);
      setQuantities((prev) => ({ ...prev, [product.productName]: value }));
    }}
    className="w-16 text-center border rounded px-1 py-0.5"
  />
  <button
    onClick={() => handleQuantityChange(product.productName, 1)}
    className="px-2 py-1 bg-gray-200 rounded"
    disabled={isAdded}
  >
    +
  </button>
</div>


                    {/* Add/Remove Button */}
                    <button
                      onClick={() => handleToggleAdd(product)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        isAdded
                          ? "bg-gray-400 text-white hover:bg-gray-500"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isAdded ? "Added" : "Add"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Go to Order Summary */}
      <div className="mt-6 text-right">
        <button
          onClick={() => navigate("/order-summary")}
          className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
        >
          Review Order
        </button>
      </div>
    </div>
  );
};

export default ProductList;
