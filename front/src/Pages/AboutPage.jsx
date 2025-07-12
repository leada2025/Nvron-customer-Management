import React from "react";
import {
  ShieldCheck,
  Truck,
  HeartPulse,
  Users,
  Target,
  Briefcase,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#e6f7f7] p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0b7b7b]">About Fishman B2B</h1>
          <p className="text-gray-700 mt-2 text-lg">
            Streamlining Medical Supply Orders for Healthcare Professionals
          </p>
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#0b7b7b]/20">
          <p className="text-gray-700 text-base leading-relaxed">
            At <span className="font-semibold text-[#0b7b7b]">Fishman Healthcare</span>, we empower
            clinics, hospitals, and distributors with a seamless platform to browse,
            negotiate, and order essential medical products. We remove complexity and
            streamline logistics by offering a transparent, commission-aware ordering system —
            so you can focus on what truly matters: your patients.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-[#0b7b7b]/20 shadow hover:shadow-lg transition">
            <HeartPulse className="text-[#0b7b7b] mb-3" size={28} />
            <h4 className="text-lg font-semibold text-[#0b7b7b]">Healthcare Focused</h4>
            <p className="text-sm text-gray-600 mt-1">
              We cater exclusively to healthcare institutions, retailers, and providers.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#0b7b7b]/20 shadow hover:shadow-lg transition">
            <Truck className="text-[#0b7b7b] mb-3" size={28} />
            <h4 className="text-lg font-semibold text-[#0b7b7b]">Efficient Deliveries</h4>
            <p className="text-sm text-gray-600 mt-1">
              Track your orders in real-time with structured delivery schedules.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#0b7b7b]/20 shadow hover:shadow-lg transition">
            <Users className="text-[#0b7b7b] mb-3" size={28} />
            <h4 className="text-lg font-semibold text-[#0b7b7b]">Partner-Driven</h4>
            <p className="text-sm text-gray-600 mt-1">
              Built to support doctors, retailers, and distribution partners with commissions and pricing flexibility.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#0b7b7b]/20 shadow hover:shadow-lg transition">
            <Target className="text-[#0b7b7b] mb-3" size={28} />
            <h4 className="text-lg font-semibold text-[#0b7b7b]">Focused Goals</h4>
            <p className="text-sm text-gray-600 mt-1">
              We aim to simplify procurement while maintaining product quality and transparency.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#0b7b7b]/20 shadow hover:shadow-lg transition">
            <ShieldCheck className="text-[#0b7b7b] mb-3" size={28} />
            <h4 className="text-lg font-semibold text-[#0b7b7b]">Secure Platform</h4>
            <p className="text-sm text-gray-600 mt-1">
              All data and transactions are encrypted and monitored for compliance and safety.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#0b7b7b]/20 shadow hover:shadow-lg transition">
            <Briefcase className="text-[#0b7b7b] mb-3" size={28} />
            <h4 className="text-lg font-semibold text-[#0b7b7b]">Business Ready</h4>
            <p className="text-sm text-gray-600 mt-1">
              Designed for both individual clinics and large-scale procurement teams.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-600 pt-6 border-t border-[#0b7b7b]/30">
          <p>
            📍 V.M. Towers, B2, Selvakumarasamy Gardens, Theivanayagi Nagar, Ganapathy, Coimbatore, Tamil Nadu - 641006
          </p>
          <p>
            📞 <a href="tel:8072437202" className="text-[#0b7b7b] underline">8072437202</a> | 📧 <a href="mailto:info@fishmanhealthcare.com" className="text-[#0b7b7b] underline">info@fishmanhealthcare.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
