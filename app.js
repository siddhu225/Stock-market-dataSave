const express = require('express');
require('./db/mongoose');
const cors = require('cors');
const StockModel = require('./models/stock');


let firstStock = {
  'Nasdaq Traded': 'Y',
  Symbol: 'A',
  'Security Name': 'Agilent Technologies, Inc. Common Stock',
  'Listing Exchange': 'N',
  'Market Category': ' ',
  ETF: 'N',
  'Round Lot Size': '100.0',
  'Test Issue': 'N',
  'Financial Status': '',
  'CQS Symbol': 'A',
  'NASDAQ Symbol': 'A',
  NextShares: 'N'
};

// This stock addition is to create DB and its collection.
(async () => {
  firstStock = new StockModel(firstStock)
  await firstStock.save();
})();


const app = express();

app.use(cors());
app.use(express.json());

require('./scripts/AddDataFromCSV');

app.listen(8081, ()=> {
  console.log('app is listening at 8081');
})