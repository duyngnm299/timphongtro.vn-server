const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getAllTransaction,
  getTransactionOfUser,
  filterTransaction,
  filterTransactionByType,
  filterRevenueByMonth,
  getRevenueByDate,
  getTransactionOfMonth,
  getTransactionOfDay,
  filterRevenueByDistrict,
  getTransactionOfDistrict,
  getTransactionNewest,
  getRevenueOfMonth,
} = require("../controllers/transaction");
router.post("/create", createTransaction);
router.get("/get-all", getAllTransaction);
router.get("/get-transaction-of-user/:id", getTransactionOfUser);
router.get("/filter/list", filterTransaction);
router.get("/filter/type", filterTransactionByType);
router.get("/revenue/by-month", filterRevenueByMonth);
router.get("/revenue/by-date", getRevenueByDate);
router.get("/get-transaction-of-day", getTransactionOfDay);
router.get("/get-transaction-of-month", getTransactionOfMonth);
router.get("/revenue/by-district", filterRevenueByDistrict);
router.get("/get-transaction-of-district", getTransactionOfDistrict);
router.get("/get-revenue-of-month", getRevenueOfMonth);
router.get("/get-transaction-newest", getTransactionNewest);
module.exports = router;
