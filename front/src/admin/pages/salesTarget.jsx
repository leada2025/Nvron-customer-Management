import React, { useState } from "react";
import SalesTargetModal from "../components/SalesTargetModal";

export default function SalesTargetPage() {
  const [open, setOpen] = useState(true); // initial open

  return (
    <div className="min-h-screen bg-[#f6fbfb] p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0b7b7b] mb-4">Assign Sales Target</h1>

        <button
          onClick={() => setOpen(true)}
          className="mb-4 bg-[#0b7b7b] text-white px-4 py-2 rounded hover:bg-[#095e5e]"
        >
          + New Target
        </button>

        <SalesTargetModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            // Optionally show toast or reload data
          }}
        />
      </div>
    </div>
  );
}
