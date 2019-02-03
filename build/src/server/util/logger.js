"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const ip = require("ip");
const divider = chalk_1.default.gray('\n-----------------------------------');
exports.logger = {
    error: (err) => {
        console.error(chalk_1.default.red(err.message.toString()));
    },
    appStarted: (port, host) => {
        console.log(`Server started ! ${chalk_1.default.green('✓')}`);
        console.log(`
${chalk_1.default.bold('Access URLs:')}${divider}
Localhost: ${chalk_1.default.magenta(`http://${host}:${port}`)}
      LAN: ${chalk_1.default.magenta(`http://${ip.address()}:${port}`)}${divider}
${chalk_1.default.blue(`Press ${chalk_1.default.italic('CTRL-C')} to stop`)}
    `);
    }
};
