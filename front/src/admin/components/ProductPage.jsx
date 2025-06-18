import React, { useState, useEffect, useMemo } from "react";
import axios from "../api/Axios";
import ProductForm from "./ProductForm";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!searchTerm) return products;
    const lower = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.description && p.description.toLowerCase().includes(lower))
    );
  }, [searchTerm, products]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const pagedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const openAddModal = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
  };

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      if (editProduct) {
        await axios.put(`/api/products/${editProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      closeModal();
      await fetchProducts();
      setPage(1);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to save product. Please try again."
      );
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProducts();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete product. Please try again."
      );
    }
  };

  const goToPage = (num) => {
    if (num < 1 || num > totalPages) return;
    setPage(num);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-sm mb-4 border border-gray-300 rounded px-3 py-2"
      />

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="border border-gray-300 px-3 py-1">Name</th>
                <th className="border border-gray-300 px-3 py-1">Packing</th>
                <th className="border border-gray-300 px-3 py-1">Dosage Form</th>
                <th className="border border-gray-300 px-3 py-1">Description</th>
                <th className="border border-gray-300 px-3 py-1">Tax</th>
                <th className="border border-gray-300 px-3 py-1">MRP</th>
                <th className="border border-gray-300 px-3 py-1">Net Rate</th>
                <th className="border border-gray-300 px-3 py-1">PTR</th>
                <th className="border border-gray-300 px-3 py-1">PTS</th>
                <th className="border border-gray-300 px-3 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              ) : (
                pagedProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.name}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.packing}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.dosageForm}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.description}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.tax}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.mrp}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.netRate}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.ptr}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1">{p.pts}</td>
                    <td className="border text-sm border-gray-300 px-3 py-1 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    page === i + 1 ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {modalOpen && (
       <ProductForm
  isOpen={modalOpen}
  onClose={closeModal}
  onSubmit={async () => {
    await fetchProducts();
    closeModal();
    setPage(1);
  }}
  initialData={editProduct}
/>

      )}
    </div>
  );
}
