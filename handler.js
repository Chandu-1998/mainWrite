'use strict';
const app = require('./app');
const serverless = require('serverless-http');
const { connect } = require('./config/dbConnection');
connect();

module.exports.handler = serverless(app);