const mongoose = require('mongoose');


const BaseSchema = new mongoose.Schema({
  availabledate: Date,
  open: Number,
  close: Number,
  high: Number,
  low: Number,
  adjclose: Number,
  volume: Number
});
BaseSchema.index({ '__t': 1 });
BaseSchema.index({ 'availabledate': 1 });
const stock = mongoose.model('stocks', BaseSchema);
module.exports = stock;