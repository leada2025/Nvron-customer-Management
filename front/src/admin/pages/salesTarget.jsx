import SalesTargetModal from "../components/SalesTargetModal";
import React from "react"
; // or SalesTargetForm

export default function SalesTargetPage() {
  return (
    <div className="min-h-screen bg-[#f6fbfb] p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0b7b7b] mb-4">Assign Sales Target</h1>
        <SalesTargetModal open={true} onClose={() => {}} />
      </div>
    </div>
  );
}
