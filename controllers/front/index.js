const https = require('https');
let controller = {};

controller.index = (req, res) => {
  let amount = '';//set message to undefined to avoid errors
  res.render('front/index', {amount: amount});
}

controller.convert = (req, res) => {

//perform conversions then respond with the particular answer
  function convertCurrency(amount, fromCurrency, toCurrency, cb) {

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    let query = fromCurrency + '_' + toCurrency;

    let url = 'https://free.currencyconverterapi.com/api/v5/convert?q='
              + query + '&compact=ultra';

    https.get(url, function(res){
        let body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            try {
              let jsonObj = JSON.parse(body);

              let val = jsonObj[query];
              if (val) {
                let total = val * amount;
                cb(null, Math.round(total * 100) / 100);
              } else {
                let err = new Error("Value not found for " + query);
                console.log(err);
                cb(err);
              }
            } catch(e) {
              console.log("Parse error: ", e);
              cb(e);
            }
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
          cb(e);
    });
  }

  let quantity = req.body.amount;
  let fromCurrency = req.body.fromCurrency;
  let toCurrency = req.body.toCurrency;
  convertCurrency(quantity, fromCurrency, toCurrency, function(err, amount) {
    console.log(amount);
    //res.json({
    //    status: "Success",
    //    amount: amount
    //})
    res.render('front/index', {amount: amount});
    //res.send('Result: '+amount);
  });
}

module.exports = controller;
