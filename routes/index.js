const express = require('express');
const app = express.Router();
const controller = require('../controllers/front/index');

app.get('/', (req, res) => {
  controller.index(req,res);
})

app.post('/convert', function(req,res){
  console.log(req.body);
  console.log('converting...');
  controller.convert(req,res);
});

module.exports = app;
