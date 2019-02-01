import * as express from 'express'

import { config }  from '../config'
import { db } from './db'

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
    let result = await db.query(`
            SELECT leggi.*
            FROM leggi
            WHERE leggi.id = $1
            LIMIT 1;
    `, [req.params.id])

    if (result.rowCount > 0) {
      const legge = result.rows[0]
      legge.numero = parseInt(legge.numero, 10).toString()
      legge.data_presentazione = (new Date(legge.data_presentazione)).toISOString()

      if (legge.data_approvazione) {
        legge.data_approvazione = (new Date(legge.data_approvazione)).toISOString()
      }
      let firmatari = []
      result = await db.query(`
        SELECT d.id, d.nome, d.cognome, fl.primo_firmatario
        FROM firmatari_legge fl
        INNER JOIN deputati d ON fl.deputato_id = d.id
        WHERE fl.legge_id = $1;
      `, [req.params.id])
      firmatari = firmatari.concat(result.rows)

      result = await db.query(`
        SELECT p.id, p.nome, p.cognome, fl.primo_firmatario, fl.ruolo
        FROM firmatari_legge fl
        INNER JOIN persone p ON fl.persona_id = p.id
        WHERE fl.legge_id = $1;
      `, [req.params.id])
      firmatari = firmatari.concat(result.rows)

      legge.firmatari = firmatari

      result = await db.query(`
        SELECT sl.stato, sl.data
        FROM stati_legge sl
        WHERE sl.legge_id = $1;
      `, [req.params.id])
      legge.stati = result.rows

      res.json(legge)
    } else {
      res.json({})
    }
  } catch (e) {
    console.log(e)
    res.json({})
  }
})

// router.get('/:numero/votazioni', async (req: express.Request, res: express.Response) => {
//   try {
//     const fromCameraTotal = await getFromRemote(getNumeroVotazioniLegge(req.params.numero))
//     const total = parseInt(extractBindings(fromCameraTotal)[0].count, 10)

//     let offset
//     let limit

//     const jsonPaging = { totalRecord: total, numberOfPages: 1, currentPage: 1, offset : 0 , limit: 0 }

//     if (req.query.offset && req.query.limit) {
//       offset = parseInt(req.query.offset, 10)
//       limit = parseInt(req.query.limit, 10)
//       jsonPaging.numberOfPages = Math.ceil(total / limit)
//       jsonPaging.currentPage = Math.floor((offset / limit) + 1)
//       jsonPaging.offset = offset
//       jsonPaging.limit = limit
//     }

//     const fromCamera = await getFromRemote(getVotazioniLegge(req.params.numero,limit,offset))
//     const json = extractBindings(fromCamera)

//     res.json({ data: json, paging: jsonPaging })

//   } catch (e) {
//     console.log(e)
//     res.json({})
//   }
// })

export { router as leggi}
