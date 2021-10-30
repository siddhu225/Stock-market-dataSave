const { ETFModel, StockModel } = require('../models/StockModel');

const mongoose = require('mongoose');

process.on("message", (params) => {
  console.log("Initialize Child Process", params.entries);
  saveDocuments(params);
});

const saveDocuments = (params) => {
  try {
    mongoose.connect('mongodb://localhost:27017/stock', {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    }).then(() => {
      console.log('connected to database!');
    }).catch((err) => {
      console.log('Error while connecting to db!!', err);
    });
    let model = params.modelName === 'stocks' ? StockModel : ETFModel;
    let newDocs = [];
    for (let stock of params.entries) {
      newDocs.push(new model(stock).toObject())
    }
    console.log('newDocs', newDocs);
    model.collection.insertMany(newDocs).then((res) => {
      console.log('res---------------------------', res);
      process.exit(0);
    }).catch((err) => {
      console.log('err---------------------------', err);
    });
  } catch (e) {
    console.log('errro', e);
  }
}