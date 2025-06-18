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
      setError(err.response?.data?.message || "Failed to fetch products.");
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
      alert(err.response?.data?.message || "Failed to save product.");
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
      alert(err.response?.data?.message || "Failed to delete product.");
    }
  };

  const goToPage = (num) => {
    if (num < 1 || num > totalPages) return;
    setPage(num);
  };

  return (
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#0b7b7b]">Products</h2>
          <button
            onClick={openAddModal}
            className="bg-[#0b7b7b] text-white px-4 py-2 rounded hover:bg-[#0a6c6c]"
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
          className="w-full max-w-md border border-[#0b7b7b]/30 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0b7b7b]"
        />

        {loading ? (
          <p className="text-[#0b7b7b]">Loading products...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-auto bg-white border border-[#0b7b7b]/20 rounded-xl shadow-md">
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-[#c2efef] text-[#0b7b7b]">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Packing</th>
                  <th className="px-4 py-2">Dosage Form</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Tax</th>
                  <th className="px-4 py-2">MRP</th>
                  <th className="px-4 py-2">Net Rate</th>
                  <th className="px-4 py-2">PTR</th>
                  <th className="px-4 py-2">PTS</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-4 text-[#0b7b7b]/80">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  pagedProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-[#f0fdfd]">
                      <td className="px-4 py-2 border-t">{p.name}</td>
                      <td className="px-4 py-2 border-t">{p.packing}</td>
                      <td className="px-4 py-2 border-t">{p.dosageForm}</td>
                      <td className="px-4 py-2 border-t">{p.description}</td>
                      <td className="px-4 py-2 border-t">{p.tax}</td>
                      <td className="px-4 py-2 border-t">{p.mrp}</td>
                      <td className="px-4 py-2 border-t">{p.netRate}</td>
                      <td className="px-4 py-2 border-t">{p.ptr}</td>
                      <td className="px-4 py-2 border-t">{p.pts}</td>
                      <td className="px-4 py-2 border-t text-center space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="text-[#0b7b7b] hover:underline"
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
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded bg-white text-[#0b7b7b] disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1
                    ? "bg-[#0b7b7b] text-white"
                    : "bg-white text-[#0b7b7b]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded bg-white text-[#0b7b7b] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
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
