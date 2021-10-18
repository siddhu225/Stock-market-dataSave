const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const StockModel = require('../models/stock');
const _ = require('lodash');

/* In this script documents insertion is done in two ways.
  1). Using mongodb insertMany
  2). mongodb Bulk insert
  3). Parallel save
*/

const removeSpaces = (stock) => {
  let newStock = {};
  Object.keys(stock).map((v) => {
    let key = v.split(' ').join('');
    newStock[key] = stock[v];
  })
  return newStock;
}

const addStock = (stock) => {
  let newStock = removeSpaces(stock);
  newStock = new StockModel(newStock)
  return newStock;
}

(async () => {
  try {
    let allEntries = [];
    // parsing data from CSV file using fast-csv package.
    fs.createReadStream(path.resolve(__dirname, '../assets', 'symbols_valid_meta.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', row => {
        allEntries.push(row);
      })
      .on('end', async (rowCount) => {
        allEntries = [...allEntries, ...allEntries, ...allEntries];
        const total = allEntries.length;
        // Using mongodb insertMany
        let start = new Date(); // start measuring time
        let mainPromise = [];
        for (let stock of allEntries) {
          const newStock = addStock(stock);
          mainPromise.push(newStock);
        }
        await StockModel.collection.insertMany(mainPromise, { ordered: false });
        let end = new Date(); // end measuring time
        console.log( `using mongodb insertMany for ${total} documents it took ${end - start} ms`);

        // Using BULK insert
        const bulk = StockModel.collection.initializeUnorderedBulkOp();
        start = new Date();
        for (let stock of allEntries) {
          const newStock = removeSpaces(stock);
          bulk.insert(newStock);
        }
        await bulk.execute();
        end = new Date(); // end measuring time
        console.log( `using mongodb bulk for ${total} documents it took ${end - start} ms`);

        // parallel insertion using promise.all
        let itemChunks = _.chunk(allEntries, 100);
        let itemInfo = [];
        start = new Date();
        for (let index of _.times(itemChunks.length)) {
          for (let stock of itemChunks[index]) {
            let newStock = addStock(stock);
            itemInfo.push(newStock.save());
          }
          if (itemInfo.length % 3000 === 0) {
            await Promise.all(itemInfo);
            itemInfo = [];
          }
        }
        end = new Date(); // end measuring time
        console.log( `using mongodb parallel save for ${total} documents it took ${end - start} ms`);
      });
  } catch (e) {
    console.log('error', e);
  }
})();