const mongoose = require('mongoose');

// Article Schema
let hodlinfoSchema = mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   last: {
      type: Number,
      required: true
   },
   buy: {
      type: Number,
      required: true
   },
   sell: {
      type: Number,
      required: true
   },
   volume: {
      type: Number,
      required: true
   },
   base_unit: {
      type: String,
      required: true
   }
});

let Hodlinfo = module.exports = mongoose.model('Hodlinfo', hodlinfoSchema);