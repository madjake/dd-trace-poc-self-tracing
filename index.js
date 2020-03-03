const helmet = require('helmet');
const winston = require('winston');
const expressWinston = require('express-winston');
const ddtracer = require('dd-trace');

const config = {
  port: 8888
};

// Datadog plugin for expressjs. Must be init'd before express
const datadogMiddlewarePlugins = [ 'express', 'http', 'https', 'dns', 'fs', 'net', 'os' ];
const tracer = ddtracer.init({
  service: 'Search',
  runtimeMetrics: true,
});

datadogMiddlewarePlugins.forEach((pluginName) => {
  tracer.use(pluginName, {
    service: 'Search'
  });
});

// Web Server + Middleware
const express = require('express');
const webServer = express();
webServer.use(helmet());

const logger = expressWinston.logger({
  transports: [ new winston.transports.Console() ],
  level: 'info',
  format: winston.format.json()
});
webServer.use(logger);

webServer.get('/search', (request, response) => {
  response.send('Ok.');
});

webServer.listen(config.port, () => {
  console.log(`Now listening on port ${config.port}.`);
});

