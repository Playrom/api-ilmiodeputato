import { Client } from 'pg'

import { getFromRemote }  from './dataCamera'
import { getIncarichiGruppo } from './queryCamera'
import { parseDate, extractBindings, CameraJSON } from './utils'

export async function parseIncarichiGruppo () {
  const db = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'collegi',
      password: '',
      port: 5432
  })
  await db.connect()
  console.log('PARSE INCARICHI GRUPPO')

  try {
      const data = await getFromRemote(getIncarichiGruppo()) as CameraJSON
      const incarichi = extractBindings(data)

      // tslint:disable-next-line: max-func-body-length
      for (const value of incarichi) {
          const deputatoUrl: string = value.deputato
          const deputatoId: string = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/','')
          const gruppoUrl: string = value.gruppo
          const gruppoId: string = gruppoUrl.replace('http://dati.camera.it/ocd/gruppoParlamentare.rdf/','')
          const incarico: string = value.incarico
          const inizioIncarico: string = parseDate(value.inizioIncarico)

          let fineIncarico: string
          if (value.fineIncarico) fineIncarico = parseDate(value.fineIncarico)

          try {

              const queryIncarichi = `
                INSERT INTO "public"."incarichi_gruppo_deputato" (
                "gruppo_id",
                "deputato_id",
                "incarico",
                "inizio_incarico",
                "fine_incarico")
                VALUES ($1,$2,$3,$4,$5);
              `

              const queryIncarichiData = [
                gruppoId,
                deputatoId,
                incarico,
                inizioIncarico,
                fineIncarico
              ]

              await db.query(queryIncarichi, queryIncarichiData)
          } catch (e) {
            console.log(e)

            return
        }
      }

    } catch (e) {
        console.log(e)

        return
    }
}
