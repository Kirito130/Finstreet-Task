const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// mongoose
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', () => {
   console.log('Connected to mongodb');
});

// Check for db errors
db.on('error', (err) => {
   console.log(err);
});

// Init App  
const app = express();

// Bring in Article Model
let Hodlinfo = require('./models/hodlinfo');

// Load View Engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', async (req, res) => {

   const url = 'https://api.wazirx.com/api/v2/tickers';
   const options = {"method": "GET"};
   const response = await fetch(url, options);
   const data = await response.json();
   let text = [];
   
   for (const x in data) {
      text.push(x)
      if (text.length > 9) {
         break;
      }
   }

   for (let i = 0; i < text.length; i++) {
      var element = text[i];
      let hodlinfo = new Hodlinfo();
      hodlinfo.name = data[element].name;
      hodlinfo.last = data[element].last;
      hodlinfo.buy = data[element].buy;
      hodlinfo.sell = data[element].sell;
      hodlinfo.volume = data[element].volume;
      hodlinfo.base_unit = data[element].base_unit;
      hodlinfo.save((err) => {
         if (err) {
            console.log(err);
            return;
         } else {
            if(i > 8) {
               disp();
            }
         }
      });
   }

   const disp = () => {
      Hodlinfo.find({}, (err, hodlinfos) => {
         if (err) {
            console.log(err);
         } else {
            res.render('index', {
               hodlinfos
            });
         }
      });
   }
});

// Start Server
app.listen('5000', () => {
   console.log('Server started on port 5000...');
});