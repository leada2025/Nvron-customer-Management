import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  Package2,
  Activity,
  UserPlus,
  ShoppingCart,
  Rocket,
  FileText,
} from "lucide-react";

const DistributorSignupPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signup request submitted!");
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6f7f7]">
      {/* Navbar */}
      <div className="flex items-center justify-between p-3 md:h-[70px] h-15 -ml-10 bg-gradient-to-br from-[#e6f7f7] via-[#d0f0f0] shadow-md">
        <div className="mb-4 ml-[50px]">
          <img
            src="/fishman.png"
            alt="Fishman Logo"
            className="md:h-60 h-40 mt-3 md:ml-10 object-contain transition-transform duration-300"
          />
        </div>
        <div className="space-x-4 -mt-2">
          <Link
            to="/partner-login"
            className="text-sm px-4 py-2 rounded-lg border border-[#0b7b7b] text-[#0b7b7b] hover:bg-[#0b7b7b] hover:text-white transition shadow-sm"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm px-4 py-2 rounded-lg border border-[#0b7b7b] text-[#0b7b7b] hover:bg-[#0b7b7b] hover:text-white transition shadow-sm"
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#e6f7f7] via-[#d0f0f0] to-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 relative group">
            <img
              src="/chat.png"
              alt="Earn with Fishman"
              className="rounded-xl shadow-lg w-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/30 rounded-xl group-hover:bg-black/10 transition duration-300"></div>
          </div>

          <div className="w-full md:w-1/2 space-y-5">
            <h2 className="text-4xl font-bold text-[#0b7b7b] leading-tight">
              Earn & Grow with Fishman
            </h2>
            <p className="text-gray-700 text-lg">
              Become a distributor, earn from every sale, and build your health-focused business powered by Fishman.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-md border border-[#d6eeee]">
                <Award className="text-[#0b7b7b] mb-2" />
                <h4 className="text-[#0b7b7b] font-semibold mb-1">
                  Start Earning Today
                </h4>
                <p>Earns up to 25% from new orders placed by your network.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-md border border-[#d6eeee]">
                <Package2 className="text-[#0b7b7b] mb-2" />
                <h4 className="text-[#0b7b7b] font-semibold mb-1">
                  Tools to Succeed
                </h4>
                <p>Dashboard, referral links & analytics to grow smartly.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/partner-login"
                className="inline-block bg-[#0b7b7b] text-white px-6 py-3 rounded-full shadow hover:bg-[#095e5e] transition font-medium"
              >
                Become a Partner Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0b7b7b] mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-gray-600 mb-12 text-md md:text-lg">
            Join the Fishman community with ease and unlock exclusive rewards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <FileText className="text-[#0b7b7b] w-10 h-10" />,
                title: "Step 1: Fill Details",
                desc: "Enter your name, contact info, and source.",
              },
              {
                icon: <ShoppingCart className="text-[#0b7b7b] w-10 h-10" />,
                title: "Step 2: Place Order",
                desc: "Purchase your first pack — wholesale access unlocked!",
              },
              {
                icon: <Rocket className="text-[#0b7b7b] w-10 h-10" />,
                title: "Step 3: Start Earning",
                desc: "Access your dashboard & start referring others.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-[#f0fdfd] border border-[#ccecec] rounded-xl shadow-sm hover:shadow-md transition p-6 text-left"
              >
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-[#0b7b7b] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/signup"
              className="inline-block bg-[#0b7b7b] text-white px-8 py-3 rounded-full hover:bg-[#095e5e] transition text-lg font-medium shadow"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      {/* Earn & Save Section */}
      <section className="py-20 bg-[#f7fdfd]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0b7b7b] mb-4">
            Earn <span className="text-green-600">AND</span> Save with Fishman
          </h2>
          <p className="text-md text-gray-600 mb-12 max-w-2xl mx-auto">
            Whether you're starting or scaling, we reward you at every stage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="text-[#0b7b7b] w-10 h-10 mx-auto" />,
                title: "Rapid Rewards",
                desc: "Earns up to 25% on all new customer orders — paid daily.",
              },
              {
                icon: <CheckCircle2 className="text-[#0b7b7b] w-10 h-10 mx-auto" />,
                title: "Builder Bonus",
                desc: "Earn up to ₹66,000 with monthly milestones.",
              },
              {
                icon: <Package2 className="text-[#0b7b7b] w-10 h-10 mx-auto" />,
                title: "MyShop",
                desc: "Digital storefront with real-time tracking.",
              },
              {
                icon: <Rocket className="text-[#0b7b7b] w-10 h-10 mx-auto" />,
                title: "Fast Start",
                desc: "Special packs & boosted commissions in your first month.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-[#d6eeee] rounded-xl shadow-sm p-6 hover:shadow-lg transition-transform transform hover:-translate-y-1"
              >
                {item.icon}
                <h3 className="text-xl font-semibold text-[#0b7b7b] mb-2 mt-4">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/signup"
              className="bg-[#0b7b7b] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#095e5e] transition shadow"
            >
              Start Earning Today
            </Link>
          </div>
        </div>
      </section>

      {/* Social Sharing */}
      <section className="py-16 text-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0b7b7b] mb-4">
            Share What You Love, Earn While You Do!
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto mb-12">
            Become a Fishman Brand Ambassador and turn your passion into income by sharing your favorite products.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <img
            src="/image2.webp"
            alt="Ambassador"
            className="w-72 h-64 rounded-lg object-cover shadow-md"
          />
          <img
            src="/grow.jpg"
            alt="Ambassador"
            className="w-72 h-64 rounded-lg object-cover shadow-md"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#e6f7f7] py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Fishman HealthCare. All rights reserved.
      </footer>
    </div>
  );
};

export default DistributorSignupPage;
