import { Client } from 'pg'

import { getFromRemote }  from './dataCamera'
import { getComponentiMisto } from './queryCamera'
import { parseDate, extractBindings, CameraJSON, deleteParentesis} from './utils'

export async function parseComponenti () {
  const db = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'collegi',
      password: '',
      port: 5432
  })
  await db.connect()
  console.log('PARSE COMPONENTI')

  try {
      const data = await getFromRemote(getComponentiMisto()) as CameraJSON
      const adesioni = extractBindings(data)

      // tslint:disable-next-line: max-func-body-length
      for (const value of adesioni) {
          const deputatoUrl: string = value.deputato
          const deputatoId: string = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/','')
          const componenteUrl: string = value.componente
          const componenteId: string = componenteUrl.replace('http://dati.camera.it/ocd/componenteGruppoMisto.rdf/','')

          const nomeComponente: string = deleteParentesis(value.nomeComponente)
          const siglaComponente: string = value.siglaComponente

          const inizioAdesione: string = parseDate(value.inizioAdesione)

          let fineAdesione: string
          if (value.fineAdesione) fineAdesione = parseDate(value.fineAdesione)

          const inizioComponente: string = parseDate(value.inizioComponente)

          let fineComponente: string
          if (value.fineComponente) fineComponente = parseDate(value.fineComponente)

          try {

              const queryComponenti = `INSERT INTO "public"."componenti" (
                "id",
                "nome_componente",
                "sigla_componente")
                VALUES ($1,$2,$3)
                ON CONFLICT (nome_componente,sigla_componente) DO UPDATE
                SET nome_componente = excluded.nome_componente,
                    sigla_componente = excluded.sigla_componente;`

              const queryComponentiData = [
                componenteId,
                nomeComponente,
                siglaComponente
              ]

              await db.query(queryComponenti, queryComponentiData)

              const queryAdesione = `
                INSERT INTO "public"."componente_deputato" (
                "componente_id",
                "deputato_id",
                "inizio_adesione",
                "fine_adesione")
                VALUES ($1,$2,$3,$4);
              `

              const queryAdesioneData = [
                componenteId,
                deputatoId,
                inizioAdesione,
                fineAdesione
              ]

              await db.query(queryAdesione, queryAdesioneData)
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
