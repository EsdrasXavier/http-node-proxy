const express = require('express');
const https = require('https');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(morgan('tiny'));
app.use(cors());

app.use('/', function (req, res) {
  const url = 'https://www.google.com';
  const parsedHost = url.split('/').splice(2).splice(0, 1).join('/');
  var parsedPort = 80;
  var parsedSSL = http;

  if (url.startsWith('https://')) {
    parsedPort = 443;
    parsedSSL = https;
  }

  const options = {
    hostname: parsedHost,
    port: parsedPort,
    path: req.url,
    method: req.method,
    headers: {
      'User-Agent': req.headers['user-agent']
    }
  };

  var serverRequest = parsedSSL.request(options, function (serverResponse) {
    serverResponse.pipe(res, { end: true });
    res.contentType(serverResponse.headers['content-type'])
  });

  serverRequest.end();
});


const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error('Not Found');
  next(error);
}

const errorHandler = (error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});