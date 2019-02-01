import { Client } from 'pg'

import { getFromRemote }  from './dataCamera'
import { getCommissioni } from './queryCamera'
import { parseDate, extractBindings, CameraJSON, deleteParentesis} from './utils'

export async function parseCommissioni () {
  const db = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'collegi',
      password: '',
      port: 5432
  })
  await db.connect()
  console.log('PARSE COMMISSIONI')

  try {
      const data = await getFromRemote(getCommissioni()) as CameraJSON
      const incarichi = extractBindings(data)

      // tslint:disable-next-line: max-func-body-length
      for (const value of incarichi) {
          const deputatoUrl: string = value.deputato
          const deputatoId: string = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/','')
          const organourl: string = value.organo
          const organoId: string = organourl.replace('http://dati.camera.it/ocd/organo.rdf/','')
          const tipo: string = value.tipo
          const nomeOrgano: string = value.nomeOrgano
          const tipoOrgano: string = value.tipoOrgano
          const inizioIncarico: string = parseDate(value.inizioIncarico)

          let fineIncarico: string
          if (value.fineIncarico) fineIncarico = parseDate(value.fineIncarico)

          try {
            const queryOrgani = `INSERT INTO "public"."organi" (
                "id",
                "nome_organo",
                "tipo_organo")
                VALUES ($1,$2,$3)
                ON CONFLICT (nome_organo,tipo_organo) DO UPDATE
                SET nome_organo = excluded.nome_organo,
                    tipo_organo = excluded.tipo_organo;`

            const queryOrganiData = [
                organoId,
                nomeOrgano,
                tipoOrgano
            ]

            await db.query(queryOrgani, queryOrganiData)

            const queryCommissioni = `
                INSERT INTO "public"."commissioni_deputato" (
                "organo_id",
                "deputato_id",
                "inizio_incarico",
                "fine_incarico",
                "tipo")
                VALUES ($1,$2,$3,$4,$5);
            `

            const queryCommissioniData = [
                organoId,
                deputatoId,
                inizioIncarico,
                fineIncarico,
                tipo
            ]

              await db.query(queryCommissioni, queryCommissioniData)
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
