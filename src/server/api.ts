import * as express from 'express'

import { collegi }  from './collegi'
import { risultati }  from './risultati'
import { deputati }  from './deputati'
import { leggi }  from './leggi'
// import { votazioni } from './votazioni'

export const apiController = express.Router()

apiController.use('/risultati', risultati)
apiController.use('/collegi', collegi)
apiController.use('/deputati', deputati)
apiController.use('/leggi', leggi)
// apiController.use('/votazioni', votazioni)
