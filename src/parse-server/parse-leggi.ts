import { Client } from 'pg'

import { getFromRemote }  from './dataCamera'
import { getLeggi, getPrimiFirmatari, getAltriFirmatari, getStatiLegge } from './queryCamera'
import { parseDate, extractBindings, CameraJSON, deleteParentesis} from './utils'

export async function parseLeggi () {
  const db = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'collegi',
      password: '',
      port: 5432
  })
  await db.connect()
  console.log('PARSE LEGGI')

  try {
      let data = await getFromRemote(getLeggi()) as CameraJSON
      const leggi = extractBindings(data)

      // tslint:disable-next-line: max-func-body-length
      for (const value of leggi) {
          const attoUrl: string = value.atto
          const attoId: string = attoUrl.replace('http://dati.camera.it/ocd/attocamera.rdf/','')
          const numero: number = parseInt(value.numero, 10)
          const iniziativa: string = value.iniziativa
          const tipo: string = value.tipo
          const titolo: string = value.titolo

          const dataPresentazione: string = parseDate(value.dataPresentazione)

          let dataApprovazione: string
          if (value.dataApprovazione) dataApprovazione = parseDate(value.dataApprovazione)

          try {
            const queryLeggi = `INSERT INTO "public"."leggi" (
                "id",
                "numero",
                "iniziativa",
                "tipo",
                "titolo",
                "data_presentazione",
                "data_approvazione")
                VALUES ($1,$2,$3,$4,$5,$6,$7)`

            const queryLeggiData = [
                attoId,
                numero,
                iniziativa,
                tipo,
                titolo,
                dataPresentazione,
                dataApprovazione
            ]

            await db.query(queryLeggi, queryLeggiData)

          } catch (e) {
            console.log(e)
            console.log(value)

            return
        }
      }

      data = await getFromRemote(getPrimiFirmatari()) as CameraJSON
      const primiFirmatari = extractBindings(data)

      // tslint:disable-next-line: max-func-body-length
      for (const value of primiFirmatari) {
          const attoUrl: string = value.atto
          const attoId: string = attoUrl.replace('http://dati.camera.it/ocd/attocamera.rdf/','')

          let deputatoUrl: string
          let deputatoId: string
          if (value.deputato) {
            deputatoUrl = value.deputato
            deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/','')
          }

          let personaUrl: string
          let personaId: string
          if (value.persona) {
            personaUrl = value.persona
            personaId = personaUrl.replace('http://dati.camera.it/ocd/persona.rdf/','')
          }

          let ruolo: string
          if (value.ruolo) {
              ruolo = value.ruolo
          }

          const primoFirmatario: boolean = true

          try {
            const queryFirmatari = `INSERT INTO "public"."firmatari_legge" (
                "legge_id",
                "deputato_id",
                "persona_id",
                "ruolo",
                "primo_firmatario")
                VALUES ($1,$2,$3,$4,$5)`

            const queryFirmatariData = [
                attoId,
                deputatoId,
                personaId,
                ruolo,
                primoFirmatario
            ]

            await db.query(queryFirmatari, queryFirmatariData)

          } catch (e) {
            console.log(e)
            console.log(value)

            return
        }
      }

      data = await getFromRemote(getAltriFirmatari()) as CameraJSON
      const altriFirmatari = extractBindings(data)

      // tslint:disable-next-line: max-func-body-length
      for (const value of altriFirmatari) {
        const attoUrl: string = value.atto
        const attoId: string = attoUrl.replace('http://dati.camera.it/ocd/attocamera.rdf/','')

        let deputatoUrl: string
        let deputatoId: string
        if (value.deputato) {
          deputatoUrl = value.deputato
          deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/','')
        }

        let personaUrl: string
        let personaId: string
        if (value.persona) {
          personaUrl = value.persona
          personaId = personaUrl.replace('http://dati.camera.it/ocd/persona.rdf/','')
        }

        let ruolo: string
        if (value.ruolo) {
            ruolo = value.ruolo
        }

        const primoFirmatario: boolean = false

        try {
          const queryFirmatari = `INSERT INTO "public"."firmatari_legge" (
              "legge_id",
              "deputato_id",
              "persona_id",
              "ruolo",
              "primo_firmatario")
              VALUES ($1,$2,$3,$4,$5)`

          const queryFirmatariData = [
              attoId,
              deputatoId,
              personaId,
              ruolo,
              primoFirmatario
          ]

          await db.query(queryFirmatari, queryFirmatariData)

        } catch (e) {
          console.log(e)
          console.log(value)

          return
        }
      }

      data = await getFromRemote(getStatiLegge()) as CameraJSON
      const statiLegge = extractBindings(data)

      for (const value of statiLegge) {
        const attoUrl: string = value.atto
        const attoId: string = attoUrl.replace('http://dati.camera.it/ocd/attocamera.rdf/','')

        const iterUrl: string = value.iter
        const iterId: string = iterUrl.replace('http://dati.camera.it/ocd/statoIter.rdf/','')

        const stato: string = value.stato
        const dataIter: string = parseDate(value.data)

        try {
          const queryStati = `INSERT INTO "public"."stati_legge" (
              "id",
              "legge_id",
              "stato",
              "data")
              VALUES ($1,$2,$3,$4)`

          const queryStatiData = [
              iterId,
              attoId,
              stato,
              dataIter
          ]

          await db.query(queryStati, queryStatiData)

        } catch (e) {
          console.log(e)
          console.log(value)

          return
        }
      }

    } catch (e) {
        console.log(e)

        return
    }
}
