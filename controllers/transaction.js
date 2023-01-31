const { Transaction } = require("../models/Transaction");
const moment = require("moment");
const createTransaction = async (req, res) => {
  try {
    const transactionCode = Math.floor(10000 + Math.random() * 90000);

    const {
      postCode,
      title,
      typeTransaction,
      costs,
      textNote,
      district,
      finalBalance,
      createdBy,
      dayCreated,
      monthCreated,
    } = req.body;
    const transaction = new Transaction({
      transactionCode: "MGD" + transactionCode,
      postCode,
      title,
      typeTransaction,
      costs,
      textNote,
      district,
      finalBalance,
      createdBy,
      dayCreated,
      monthCreated,
    });
    const transactionResult = await transaction.save();
    return res.status(200).json({ transactionResult });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getAllTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.find().sort({
      ["createdAt"]: "desc",
    });
    return res.status(200).json({ transaction });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getTransactionOfUser = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.find({ createdBy: id }).sort({
      ["createdAt"]: "asc",
    });
    return res.status(200).json({ transaction });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const filterTransaction = async (req, res) => {
  try {
    console.log(req.query);
    const { createdBy } = req.query;
    const { dateFrom } = req.query || "";
    const { dateTo } = req.query || "";
    const { typeTransaction } = req.query || "";
    const { postCode } = req.query || "";

    const result = await Transaction.find({
      $and: [
        {
          createdBy: createdBy,
        },
        {
          createdAt: {
            $gte: dateFrom !== "" ? new Date(dateFrom) : "",
            $lte: dateTo !== "" ? new Date(dateTo) : "",
          },
        },
        { typeTransaction: { $regex: typeTransaction || "" } },
        { postCode: { $regex: postCode || "" } },
      ],
    });
    return res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const filterTransactionByType = async (req, res) => {
  try {
    const { type } = req.query;
    const transaction = await Transaction.find({ typeTransaction: type });
    return res.status(200).json({ transaction });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const filterRevenueByMonth = async (req, res) => {
  const date = new Date();
  const lastDate = new Date(date.setMonth(date.getMonth()));
  console.log(lastDate);
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $lte: lastDate },
          typeTransaction: "Thanh toán",
        },
      },
      {
        $project: {
          yearMonthDayUTC: {
            $dateToString: { format: "%Y/%m", date: "$createdAt" },
          },
          total: "$costs",
        },
      },
      {
        $group: {
          _id: "$yearMonthDayUTC",
          totalTransaction: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]).sort({ ["_id"]: "asc" });
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const filterRevenueByDistrict = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { district: { $regex: "" }, typeTransaction: "Thanh toán" } },
      {
        $project: {
          address: "$district",
          total: "$costs",
        },
      },
      {
        $group: {
          _id: "$address",
          totalTransaction: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]).sort({ ["totalTransaction"]: "desc" });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getRevenueByDate = async (req, res) => {
  const date = new Date();
  const lastDate = new Date(date.setDate(date.getDate()));
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $lte: lastDate },
          typeTransaction: "Thanh toán",
        },
      },
      {
        $project: {
          // dayOfMonth: { $dayOfMonth: "$createdAt" },
          // month: { $month: "$createdAt" },
          // year: { $year: "$createdAt" },
          yearMonthDayUTC: {
            $dateToString: { format: "%Y/%m/%d", date: "$createdAt" },
          },
          total: "$costs",
        },
      },
      {
        $group: {
          _id: "$yearMonthDayUTC",
          totalTransaction: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]).sort({ ["_id"]: "asc" });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const getTransactionOfDay = async (req, res) => {
  try {
    const { date } = req.query;
    console.log(date);
    const transaction = await Transaction.find({
      $and: [
        {
          dayCreated: date,
        },
      ],
    });
    return res.status(200).json({ transaction });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getTransactionOfMonth = async (req, res) => {
  const { date } = req.query;
  console.log(date);
  try {
    const result = await Transaction.find({
      $and: [{ monthCreated: { $regex: date } }],
    }).sort({ ["createdAt"]: "asc" });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getTransactionOfDistrict = async (req, res) => {
  try {
    const { district } = req.query;
    const result = await Transaction.find({
      $and: [{ district: { $regex: district } }],
    });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getTransactionNewest = async (req, res) => {
  const limit = 8;
  try {
    const result = await Transaction.find()
      .sort({ ["createdAt"]: "desc" })
      .limit(limit);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getRevenueOfMonth = async (req, res) => {
  const { date } = req.query;
  console.log(date);
  try {
    const result = await Transaction.find({
      $and: [
        { monthCreated: { $regex: date } },
        { typeTransaction: "Thanh toán" },
      ],
    });

    let total = 0;
    result.map((item, index) => {
      console.log(index);
      return (total += item.costs);
    });
    return res.status(200).json(total);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  createTransaction,
  getAllTransaction,
  getTransactionOfUser,
  filterTransaction,
  filterTransactionByType,
  filterRevenueByDistrict,
  filterRevenueByMonth,
  getRevenueByDate,
  getRevenueOfMonth,
  getTransactionOfMonth,
  getTransactionOfDay,
  getTransactionOfDistrict,
  getTransactionNewest,
};
