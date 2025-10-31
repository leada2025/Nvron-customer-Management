const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const pricingRoutes = require("./routes/pricing");
const requestRoutes = require("./routes/requests");
const adminUsersRouter = require("./routes/adminUsers");
const roleRoutes = require("./routes/roles");
const negotiation =require("./routes/negotiation")
const distributorRoutes = require("./routes/distributorRoutes");
const payoutRoutes =require("./routes/payoutRoutes")
const bankDetailsRoutes = require("./routes/bankDetails");
const commissionRoutes = require("./routes/commissionRoutes");
const partnerCommission = require("./routes/partnerCommission")
const offerRoutes = require("./routes/offerRoutes");
const adminRoutes = require("./routes/admin")
const catalogueRoutes = require("./routes/catalogueRoutes");

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5174','https://orders.fishmanb2b.in','http://localhost:5173','https://nvron-customer-management-8oro.onrender.com','https://nvron-customer-management-admin.onrender.com'],
  credentials: true
}));
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/requests", requestRoutes);
app.use("/admin/users", adminUsersRouter);
app.use("/admin/roles", roleRoutes);
app.use("/api/negotiations",negotiation);
app.use("/api/distributors", distributorRoutes);
app.use("/api/payouts",payoutRoutes);
app.use("/api/bank-details", bankDetailsRoutes);
app.use("/api/commission", commissionRoutes);
app.use("/api/partner-commission",partnerCommission);
app.use("/api/offers", offerRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/catalogue", catalogueRoutes);

const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  
  .catch((err) => console.error(err));