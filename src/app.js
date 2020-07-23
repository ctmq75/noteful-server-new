
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config.js');
const nRouter = require('./notes/notes-router.js');
const fRouter = require('./folders/folders-router.js');


const app = express();


var whitelist = ['http://localhost:3000', 'https://noteful-client.chrismcardle.vercel.app/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'}));
app.use(helmet());
app.use(cors(corsOptions))

app.use('/api/notes', nRouter);
app.use('/api/folders', fRouter);

app.get('/', (req, res) => {
  res.send('Hello, noteful users!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    console.error(error);
     response = { error: { message: 'server errorrrrrrr' }};
  } else {
    console.error(error);
    response = { error, message: error.message };
   }
   res.status(500).json(response);
 });

module.exports = app;