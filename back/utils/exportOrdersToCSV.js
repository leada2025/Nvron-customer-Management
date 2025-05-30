const { Parser } = require("json2csv");
const Order = require("../models/Order");

const exportOrdersToCSV = async () => {
  const orders = await Order.find().populate("customerId", "name email");
  const formatted = orders.map(order => ({
    Customer: order.customerId.name,
    Email: order.customerId.email,
    OrderNote: order.note,
    Status: order.status,
    Total: order.totalAmount,
    Date: order.createdAt
  }));

  const parser = new Parser();
  return parser.parse(formatted);
};

module.exports = { exportOrdersToCSV };
