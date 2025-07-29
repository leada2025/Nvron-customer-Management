const express = require("express");
const router = express.Router();
const LoginLog = require("../models/LoginLog");

router.get("/logins/by-date", async (req, res) => {
  try {
    const { date } = req.query; // format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const logs = await LoginLog.find({
      timestamp: { $gte: start, $lt: end },
    }).populate("customerId", "name email");

    res.json(logs);
  } catch (err) {
    console.error("Login log fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;