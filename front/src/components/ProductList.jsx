import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = ({ products }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addedProductKeys, setAddedProductKeys] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  

  const getProductKey = (product) =>
    `${product.name}_${product.dosageForm}_${product.packing}_${product.description}`;

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("orderItems") || "[]");
    setOrderItems(savedItems);

    const keys = new Set(savedItems.map((item) => getProductKey(item)));
    setAddedProductKeys(keys);

    const qtyMap = {};
    savedItems.forEach((item) => {
      qtyMap[getProductKey(item)] = Number(item.quantity) || 1;
    });
    setQuantities(qtyMap);
  }, []);

  const handleQuantityChange = (key, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[key] || 1) + delta);
      return { ...prev, [key]: newQty };
    });
  };

  const handleToggleAdd = (product) => {
    const key = getProductKey(product);
    const isAlreadyAdded = addedProductKeys.has(key);

    if (isAlreadyAdded) {
      const updatedOrder = orderItems.filter(
        (p) => getProductKey(p) !== key
      );
      const newKeys = new Set(updatedOrder.map((item) => getProductKey(item)));

      setOrderItems(updatedOrder);
      setAddedProductKeys(newKeys);
      localStorage.setItem("orderItems", JSON.stringify(updatedOrder));
    } else {
      const quantity = Number(quantities[key]) || 1;
      const updatedItem = {
        ...product,
        quantity,
        netRate: Number(product.netRate) || 0,
        tax: Number(product.tax) || 0,
      };

      const updatedOrder = [
        ...orderItems.filter((p) => getProductKey(p) !== key),
        updatedItem,
      ];
      const newKeys = new Set(updatedOrder.map((item) => getProductKey(item)));

      setOrderItems(updatedOrder);
      setAddedProductKeys(newKeys);
      localStorage.setItem("orderItems", JSON.stringify(updatedOrder));
    }
  };
const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchQuery.toLowerCase())
);
  const paginatedProducts = filteredProducts.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
 const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="mb-4 flex justify-between items-center">
  <input
    type="text"
    placeholder="Search by product name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="border px-4 py-2 rounded w-full max-w-sm"
  />
</div>

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
            const key = getProductKey(product);
            const isAdded = addedProductKeys.has(key);
            const qty = quantities[key] || 1;

            return (
              <tr
                key={key}
                className={`hover:bg-gray-50 ${
                  isAdded ? "bg-green-50" : ""
                } border-t`}
              >
                <td className="px-4 py-2 font-semibold">{product.name}</td>
                <td className="px-4 py-2 text-gray-600">{product.description}</td>
                <td className="px-4 py-2">{product.dosageForm}</td>
                <td className="px-4 py-2">{product.packing}</td>
                <td className="px-4 py-2">₹{product.mrp}</td>
<td className="px-4 py-2">
  ₹
  {product.specialPrice !== undefined && product.specialPrice !== null
    ? product.specialPrice
    : product.netRate}
  {product.specialPrice !== undefined && product.specialPrice !== null ? (
    <span className="ml-1 text-sm text-green-600 font-semibold">(Special)</span>
  ) : (
    <button
      onClick={() => navigate(`/negotiate/${product._id}`)}
      className="ml-2 text-blue-600 underline text-sm"
    >
      Negotiate Price
    </button>
  )}
</td>



                <td className="px-4 py-2">{product.tax}%</td>
                
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuantityChange(key, -1)}
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
                          setQuantities((prev) => ({ ...prev, [key]: value }));
                        }}
                        className="w-16 text-center border rounded px-1 py-0.5"
                      />
                      <button
                        onClick={() => handleQuantityChange(key, 1)}
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

      {/* Review Order Button */}
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
