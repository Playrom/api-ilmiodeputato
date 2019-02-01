import * as express from 'express'
import { getFromRemote } from '../dataCamera'

import {
 getVotazione, getVotiDeputatiVotazione
} from '../queryCamera.js'

import { extractBindings } from '../utils'

const router = express.Router()

router.get('/', async (_req: express.Request, res: express.Response) => {
  try {
    res.json({})
  } catch (e) {
    console.log(e)
    res.json({})
  }
})

router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const fromCamera = await getFromRemote(getVotazione(req.params.id))
    const json = extractBindings(fromCamera)
    res.json(json)
  } catch (e) {
    console.log(e)
    res.json({})
  }
})

router.get('/:id/votanti', async (req: express.Request, res: express.Response) => {
  try {
    const fromCamera = await getFromRemote(getVotiDeputatiVotazione(req.params.id))
    const json = extractBindings(fromCamera)
    res.json(json)
  } catch (e) {
    console.log(e)
    res.json({})
  }
})

export { router as votazioni }
