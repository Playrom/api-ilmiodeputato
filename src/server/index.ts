import * as express from 'express'
import { logger } from './util/logger'

// import { argv } from './util/argv'
import { port } from './util/port'

import * as dotenv from 'dotenv'
import * as cors from 'cors'
dotenv.config()

import { apiController } from './api.js'

const app = express()
app.use(cors())
app.use(express.static('public'))
app.set('json spaces', 2)

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.use('/api', apiController)

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = process.env.HOST // argv.host || process.env.HOST
const host = customHost || undefined // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'

// Start your app.
app.listen(port, host, (err: Error) => {
  if (err) {
    return logger.error(err)
  }
  logger.appStarted(port, prettyHost)
})
