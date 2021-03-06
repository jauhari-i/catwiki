const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const log = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(log('dev'));

mongoose.connect(
  dbUrl,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Connected to the database');
    }
  }
);

app.use('/api', require('./routes/api'));

app.use(express.static(path.join(__dirname, './public')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({
    message: req.method + ' ' + req.url + ' not found',
    error: 'NoEndpointExist',
    code: 404,
  });
  next();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
