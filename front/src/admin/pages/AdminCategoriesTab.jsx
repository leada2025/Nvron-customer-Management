import React, { useState, useEffect } from "react";
import axios from "../../api/Axios";

export default function AdminCategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/catalogue/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/catalogue/categories", { name: categoryName });
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/catalogue/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/catalogue/categories/${editId}`, { name: editName });
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      console.error("Error editing category:", err);
    }
  };

  return (
    <div className="p-6 bg-[#e6f7f7] min-h-screen">
      <h2 className="text-2xl font-bold text-[#0b7b7b] mb-4">Manage Categories</h2>

      {/* Add Category */}
      <form onSubmit={handleAddCategory} className="mb-6 flex gap-2">
        <input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="New Category Name"
          className="p-2 border rounded w-full"
          required
        />
        <button type="submit" className="bg-[#0b7b7b] text-white px-4 py-2 rounded hover:bg-[#095f5f]">
          Add
        </button>
      </form>

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between bg-white p-4 rounded shadow"
          >
            {editId === cat._id ? (
              <form onSubmit={handleEditCategory} className="flex flex-grow gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="p-2 border rounded w-full"
                  required
                />
                <button type="submit" className="bg-[#0b7b7b] text-white px-3 rounded hover:bg-[#095f5f]">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="text-red-600 px-3 rounded hover:underline"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span className="font-medium text-[#0b7b7b]">{cat.name}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditId(cat._id);
                      setEditName(cat.name);
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
