const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  NasdaqTraded: {
    type: String,
  },
  Symbol: {
    type: String,
  },
  SecurityName: {
    type: String,
  },
  ListingExchange: {
    type: String,
  },
  MarketCategory: {
    type: String,
  },
  ETF: {
    type: String,
  },
  RoundLotSize: {
    type: Number,
  },
  TestIssue: {
    type: String,
  },
  FinancialStatus: {
    type: String,
  },
  CQSSymbol: {
    type: String,
  },
  NASDAQSymbol: {
    type: String,
  },
  NextShares: {
    type: String,
  },
});

const StockModel = mongoose.model('Stock', StockSchema);

module.exports = StockModel;

