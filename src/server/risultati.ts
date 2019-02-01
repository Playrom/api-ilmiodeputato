import * as express from 'express'
import {map} from 'lodash'
import {db} from './db'
import {config} from '../config'
import {continenti} from '../continenti'
import {Deputato, Gruppo} from '../models/Deputato'
import {Collegio, RisultatiPlurinominale, RisultatiUninominale} from '../models/Collegio'

const router = express.Router()

// tslint:disable-next-line:max-func-body-length
router.get('/', async (req: express.Request, res: express.Response) => {

  try {
    const id = req.params.id
    const result = await db.query(`
        SELECT *
        FROM risultati_nazionali_liste;`
      )

    return res.json(result.rows)
  } catch (e) {
    // this will eventually be handled by your error handling middleware
    console.log(e)

    return res.send('error')
  }
})

export { router as risultati }
