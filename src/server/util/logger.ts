// eslint-disable no-console

import  chalk from 'chalk'
import * as ip from 'ip'

const divider = chalk.gray('\n-----------------------------------')

/**
 * Logger middleware, you can customize it to make messages more personal
 */
export const logger = {
  // Called whenever there's an error on the server we want to print
  error: (err: Error) => {
    console.error(chalk.red(err.message.toString()))
  },

  // Called when express.js app starts on given port w/o errors
  appStarted: (port: Number, host: any) => {
    console.log(`Server started ! ${chalk.green('✓')}`)

    console.log(`
${chalk.bold('Access URLs:')}${divider}
Localhost: ${chalk.magenta(`http://${host}:${port}`)}
      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`)}${divider}
${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `)
  }
}
