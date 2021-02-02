// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const http = require('http');

const httpServer = http.createServer(app);
// listen to requests
httpServer.listen(port, () =>
  console.info(`server started on port ${port} (${env})`),
);

// open mongoose connection
mongoose.connect();

/**
 * Exports express
 * @public
 */
module.exports = app;
