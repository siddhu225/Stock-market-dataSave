const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

const companies = mongoose.model('companies', CompanySchema);

module.exports = companies;