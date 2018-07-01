import express from 'express';
import bodyParser from 'body-parser';
import path  from 'path';

const app = express();

app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(path.join(__dirname, '../public')));

// routes ======================================================================
const front = require('../routes/index');
app.use('/', front);

app.listen(process.env.PORT || 3000, () => {
    console.log('starter listening on port 3000');
});
