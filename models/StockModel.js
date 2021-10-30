const mongoose = require('mongoose');
const BaseSchema = require('./BaseSchema');
const _ = require('lodash');

const ETFSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    required: true,
  }
});

const ETFModel =  BaseSchema.discriminator('Etf', ETFSchema)
const StockModel = BaseSchema.discriminator('Stock', _.cloneDeep(ETFSchema));

module.exports = { ETFModel, StockModel };

