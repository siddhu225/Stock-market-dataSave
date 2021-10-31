const express = require('express');
require('./db/mongoose');
const cors = require('cors');
const { ETFModel, StockModel } = require('./models/StockModel');
const companies = require('./models/companies');
const _ = require('lodash');
let ObjectID = require('mongoose').mongo.ObjectId;
const app = express();

app.use(cors());
app.use(express.json());


// Script for bulk insert data from stocks and etf folder

require('./scripts/AddStockData');

app.get('/stocks', async (req, res, next) => {
  console.log(req.params, req.body, req.query);
  try {
    let reqObj = _.defaults(req.body, {
      limit: 200,
      page: 1,
      type: 'stocks',
      from: '',
      to: ''
    });
    let companyIds = [];
    if (_.get(req.body, 'companies', []).length > 0) {
      let allComps = _.map(req.body.companies, (c) => c ? c.toUpperCase().trim() : null);
      allComps = await companies.find({
        name: _.compact(allComps),
      });
      companyIds = _.map(allComps, '_id');
    }
    console.log('companyIds', companyIds);
    let model = reqObj.type === 'stocks' ? StockModel : ETFModel;
    let queryObj = { };
    if (reqObj.from) {
      queryObj['availabledate'] = { 
        $gte: new Date(reqObj.from) 
      }
    }
    if (reqObj.to) {
      queryObj['availabledate'] = { 
        $lt: new Date(reqObj.to) 
      }
    }
    if (companyIds) {
      companyIds = _.filter(_.castArray(companyIds), a => ObjectID.isValid(a));
      companyIds = _.map(companyIds, ObjectID);
      queryObj['companyId'] = { $in: companyIds };
    }
    model.find(queryObj).limit(reqObj.limit).skip(reqObj.page).then((val) => {
      res.status(200).json(val);
    }).catch((err) => {
      next(err);
    })
  } catch (e) {
    console.log('error', e);
  }
});

app.listen(8081, ()=> {
  console.log('app is listening at 8081');
})
