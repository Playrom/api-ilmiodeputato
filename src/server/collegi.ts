import * as express from 'express'
import {map} from 'lodash'
import {db} from './db'
import {config} from '../config'
import {continenti} from '../continenti'
import {Deputato, Gruppo} from '../models/Deputato'
import {Collegio, RisultatiPlurinominale, RisultatiUninominale} from '../models/Collegio'

const router = express.Router()

router.get('/:gid/mappa/:tipoCollegio', async (req: express.Request, res: express.Response) => {
  try {
    let result

    if (req.params.gid) {
      if (req.params.tipoCollegio === 'uninominale') {
        result = await db.query(`
        SELECT ST_AsTWKB(ST_Union(geom)) as compressed
        from collegi
        WHERE cam17u_den = ( SELECT cam17u_den FROM Collegi where gid = ${req.params.gid} ) ;
        `
        )
      } else {
        result = await db.query(`
        SELECT ST_AsTWKB(ST_Union(geom)) as compressed
        from collegi
        WHERE cam17p_den = ( SELECT cam17p_den FROM Collegi where gid = ${req.params.gid} ) ;
        `
        )
      }
    } else {
      return res.json({})
    }

    if (result.rowCount <= 0) {
      return res.json({})
    }

    const data = result.rows[0]

    return res.send(data.compressed)
  } catch (e) {
    // this will eventually be handled by your error handling middleware
    console.log(e)

    return res.send('error')
  }
})

// tslint:disable-next-line:max-func-body-length
router.get('/', async (req: express.Request, res: express.Response) => {

  try {
    let latitude
    let longitude
    let id
    let result
    let stato: string
    let continente

    if (req.query.latitude && req.query.longitude) {
      latitude = req.query.latitude
      longitude = req.query.longitude

      result = await db.query(`
        SELECT *
        FROM collegi
        WHERE ST_Contains( geom , ST_GeometryFromText('POINT(${longitude} ${latitude})', 4326) );`
      )
    } else if (req.query.id) {
      id = req.query.id
      result = await db.query(`
        SELECT *
        FROM collegi
        WHERE objectid = ${id} ;`
      )
    } else if (req.query.stato) {
      stato = req.query.stato.toString()
      continente = continenti[stato]
      if (!continente) {
        return res.json({})
      }
    } else {
      result = await db.query(`
        SELECT DISTINCT ON (cam17u_nom)
        objectid,
        cam17p_den as collegio_plurinominale,
        cam17u_nom as nome_collegio_uninominale,
        cam17u_den as codice_collegio_uninominale
        FROM collegi
        GROUP BY objectid , cam17p_den, cam17u_nom, cam17u_den ORDER BY cam17u_nom;`
      )

      return res.json(result.rows)
    }

    let data: Collegio

    if (stato === undefined) {
      if (result.rowCount <= 0) {
        return res.json({})
      }

      delete result.rows[0].geom
      data = result.rows[0]
      data.estero = false

      const deputatiQuery = `
        SELECT deputati.*
        FROM deputati
        WHERE UPPER(codice_collegio_uninominale) = UPPER($1)
        OR (
          UPPER(collegio_plurinominale) = UPPER($2)
          AND deputati.tipo_collegio = $3
          )
        ;`
      const deputatiQueryData = [data.cam17u_den, data.cam17p_den, 'proporzionale']
      result = await db.query(deputatiQuery, deputatiQueryData)

      if (result.rowCount > 0) {
        data.deputati = result.rows as Deputato[]
      }

      data.geoJsonMap = `${config.apiPath}/collegi/${data.gid}/mappa`
    } else {
      Object.assign(data,{
        estero: true, stato, continente, cam17u_nom: 'Circoscrizione Estero', cam17p_den: continente
      })
      const deputatiQuery = `
        SELECT deputati.*
        FROM deputati
        WHERE
          UPPER(collegio_plurinominale) LIKE UPPER($1)
          AND deputati.tipo_collegio = $2
        ;`
      const deputatiQueryData = [`%${continente}%`, 'proporzionale']
      result = await db.query(deputatiQuery, deputatiQueryData)

      if (result.rowCount > 0) {
        data.deputati = result.rows as Deputato[]
      }
    }

    data.deputati =  await Promise.all(map(data.deputati , async (deputato: Deputato) => {
      const datiDeputato = await db.query(`
            SELECT g.*, gd.inizio_adesione, gd.fine_adesione, gd.motivo_fine_adesione
            FROM gruppo_deputato gd
            INNER JOIN gruppi g ON gd.gruppo_id = g.id
            WHERE gd.deputato_id = $1;
      `, [deputato.id])
      const gruppi = datiDeputato.rows as Gruppo[]
      deputato.gruppi = gruppi

      return deputato
    }))

    return res.json(data)
  } catch (e) {
    // this will eventually be handled by your error handling middleware
    console.log(e)

    return res.send('error')
  }
})

// tslint:disable-next-line:max-func-body-length
router.get('/:id', async (req: express.Request, res: express.Response) => {

  try {
    const id = req.params.id
    const result = await db.query(`
        SELECT *
        FROM collegi
        WHERE objectid = ${id} ;`
      )

    let data: Collegio

    if (result.rowCount <= 0) {
      return res.json({})
    }

    delete result.rows[0].geom
    data = result.rows[0]
    data.estero = false

    const deputatiQuery = `
      SELECT deputati.*
      FROM deputati
      WHERE UPPER(codice_collegio_uninominale) = UPPER($1)
      OR (
        UPPER(collegio_plurinominale) = UPPER($2)
        AND deputati.tipo_collegio = $3
        )
      ;`
    const deputatiQueryData = [data.cam17u_den, data.cam17p_den, 'proporzionale']
    const resultDeputati = await db.query(deputatiQuery, deputatiQueryData)

    if (resultDeputati.rowCount > 0) {
      data.deputati = resultDeputati.rows as Deputato[]
    }

    data.geoJsonMap = `${config.apiPath}/collegi/${data.gid}/mappa`

    data.deputati =  await Promise.all(map(data.deputati , async (deputato: Deputato) => {
      const datiDeputato = await db.query(`
            SELECT g.*, gd.inizio_adesione, gd.fine_adesione, gd.motivo_fine_adesione
            FROM gruppo_deputato gd
            INNER JOIN gruppi g ON gd.gruppo_id = g.id
            WHERE gd.deputato_id = $1;
      `, [deputato.id])
      const gruppi = datiDeputato.rows as Gruppo[]
      deputato.gruppi = gruppi

      return deputato
    }))

    return res.json(data)
  } catch (e) {
    // this will eventually be handled by your error handling middleware
    console.log(e)

    return res.send('error')
  }
})

// tslint:disable-next-line:max-func-body-length
router.get('/:id/risultati', async (req: express.Request, res: express.Response) => {

  try {
    const id = req.params.id
    const result = await db.query(`
        SELECT *
        FROM collegi
        WHERE objectid = ${id} ;`
      )

    let data: Collegio

    if (result.rowCount <= 0) {
      return res.json({})
    }

    delete result.rows[0].geom
    data = result.rows[0]
    const nomeUninominale = data.cam17u_den
    const nomePlurinominale = data.cam17p_den

    const risultatiUninominaleQuery = `
      SELECT
      gb.nome,
      gb.cognome,
      c.coalizione,
      c.sigla_coalizione,
      c.colore_coalizione,
      CAST(SUM(gb.voti_candidato_uninominale) as integer) AS voti,
      CAST(
        ROUND(SUM(gb.voti_candidato_uninominale) * 100 / SUM(SUM(gb.voti_candidato_uninominale)) OVER ( PARTITION BY gb.cod_uninominale), 2)
        as float) as percentuale
      FROM (
          SELECT
              camera_2018_scrutini_italia.cod_uninominale,
              camera_2018_scrutini_italia.comune,
              camera_2018_scrutini_italia.nome,
              camera_2018_scrutini_italia.cognome,
              camera_2018_scrutini_italia.voti_candidato_uninominale,
              MIN(camera_2018_scrutini_italia.lista) AS lista
          FROM
              camera_2018_scrutini_italia
          WHERE
              camera_2018_scrutini_italia.cod_uninominale LIKE UPPER($1)
          GROUP BY
              camera_2018_scrutini_italia.cod_uninominale,
              camera_2018_scrutini_italia.comune,
              camera_2018_scrutini_italia.nome,
              camera_2018_scrutini_italia.cognome,
              camera_2018_scrutini_italia.voti_candidato_uninominale) AS gb
      JOIN coalizioni c ON gb.lista = c.nome_lista
      GROUP BY
          gb.cod_uninominale,
          gb.nome,
          gb.cognome,
          c.coalizione,
          c.sigla_coalizione,
          c.colore_coalizione
      ORDER BY
        voti DESC;`

    const risultatiUninominaleData = [nomeUninominale]
    const risultatiUninominale = await db.query(risultatiUninominaleQuery, risultatiUninominaleData)

    const risultatiPlurinominaleQuery = `
      SELECT
      s.plurinominale,
      s.lista,
      c.sigla_lista,
      c.coalizione,
      c.sigla_coalizione,
      c.colore_lista,
      CAST(SUM(s.voti_lista) as integer) AS voti,
      CAST(ROUND(SUM(s.voti_lista) * 100 / SUM(SUM(s.voti_lista))
          OVER (PARTITION BY
                  s.plurinominale),
              2) AS float) AS percentuale,
      CAST(SUM(SUM(s.voti_lista))
        OVER (PARTITION BY
                s.plurinominale,
                c.coalizione) AS integer)
        AS voti_coalizione
      FROM
          camera_2018_scrutini_italia s
          JOIN coalizioni c ON c.nome_lista = s.lista
      WHERE
          s.plurinominale = UPPER($1)
      GROUP BY
          s.plurinominale,
          s.lista,
          c.sigla_lista,
          c.coalizione,
          c.sigla_coalizione,
          c.colore_lista
      ORDER BY
          voti_coalizione DESC,
          voti DESC;`

    const risultatiPlurinominaleData = [nomePlurinominale]
    const risultatiPlurinominale = await db.query(risultatiPlurinominaleQuery, risultatiPlurinominaleData)

    const resUni = map(risultatiUninominale.rows, (risultato: RisultatiUninominale) => {
      risultato.tipo = 'uninominale'

      return risultato
    })

    const resPluri = map(risultatiPlurinominale.rows, (risultato: RisultatiPlurinominale) => {
      risultato.tipo = 'plurinominale'

      return risultato
    })

    const json = {
      risultati_uninominale: resUni,
      risultati_plurinominale: resPluri
    }

    return res.json(json)
  } catch (e) {
    // this will eventually be handled by your error handling middleware
    console.log(e)

    return res.send('error')
  }
})

export { router as collegi }
