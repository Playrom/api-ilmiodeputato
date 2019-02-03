"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger_1 = require("./util/logger");
const port_1 = require("./util/port");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const api_js_1 = require("./api.js");
const app = express();
app.use(cors());
app.use(express.static('public'));
app.set('json spaces', 2);
app.use('/api', api_js_1.apiController);
const customHost = process.env.HOST;
const host = customHost || undefined;
const prettyHost = customHost || 'localhost';
app.listen(port_1.port, host, (err) => {
    if (err) {
        return logger_1.logger.error(err);
    }
    logger_1.logger.appStarted(port_1.port, prettyHost);
});
