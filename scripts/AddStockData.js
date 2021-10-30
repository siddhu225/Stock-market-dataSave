const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const _ = require('lodash');
const stocksPath = path.join(__dirname, '../assets/stocks');
const etfPath = path.join(__dirname, '../assets/etfs');
const companies = require('../models/companies');
const { ETFModel, StockModel } = require('../models/StockModel');
let finalCount = 0;
const { fork } = require('child_process');

const createProcess = (allPromises, dName) => {
  const singleBatchCount = 150000; // Save 150,000 records per hit
  const noOfProcess = Math.ceil(allPromises.length/singleBatchCount);
  for(let index = 1; index <= noOfProcess; index++) {
    let newEntries = allPromises.splice(0, singleBatchCount + 1);
    let worker = fork(path.join(__dirname, './dbOperation'));
    worker.send({
      entries: newEntries,
      modelName: dName,
    });
  }
};


(async () => {
  try {
    let start = new Date(); // start measuring time
    for (let dpath of [stocksPath, etfPath]) {
      console.log('directory path--------------------------------------', dpath, dpath.split('/'));
      let model = '';
      let dName = '';
      if (dpath.split('/').includes('stocks')) {
        model = StockModel;
        dName = 'stocks';
      } else {
        model = ETFModel;
        dName = 'etfs';
      }
      await new Promise((resolve, reject) => {
        fs.readdir(dpath, async (err, files) => {
          if (err) {
            return console.log('Unable to open directory: ' + err);
            reject();
          }
          let allPromises = [];
          for (let file of files) {
            console.log('file------------------------------------', file);
            const splitFile = file.split('.');
            let newCompany = new companies({
              name: splitFile[0]
            });
            newCompany = await newCompany.save();
            let fetchedData = await new Promise((resolve, reject) => {
              let allEntries = [];
              fs.createReadStream(`${dpath}/${file}`)
                .pipe(csv.parse({ headers: true }))
                .on('error', error => reject(error))
                .on('data', row => allEntries.push(row))
                .on('end', rowCount => {
                  console.log(`Parsed ${rowCount} rows`, dName);
                  resolve(allEntries);
                });
            });
            for (let stock of fetchedData) {
              let newStock = Object.assign({}, {
                availabledate: _.get(stock, 'Date', new Date()),
                open: _.get(stock, 'Open', 0),
                close: _.get(stock, 'High', 0),
                high: _.get(stock, 'Low', 0),
                low: _.get(stock, 'Close', 0),
                adjclose: _.get(stock, 'Adj Close', 0),
                volume: _.get(stock, 'Volume', 0),
                companyId: newCompany._id.toString(),
              });
              allPromises.push(newStock);
            }
            if (allPromises.length >= 600000) {
              let newVals = allPromises.splice(0, 6000001);
              createProcess(newVals, dName);
            }
          }
          createProcess(allPromises, dName);
          resolve();
        });
      });
    }
    let end = new Date(); // end measuring time
    console.log( `using mongodb insertMany ${ finalCount} for documents it took ${end - start} ms`);
  } catch (e) {
    console.log('error', e);
  }
})();