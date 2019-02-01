import { Client } from 'pg'

import { getFromRemote }  from './dataCamera'
import { getAdesioniGruppo } from './queryCamera'
import { parseDate, extractBindings, CameraJSON, deleteParentesis} from './utils'

export async function parseAdesioni () {
    const db = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'collegi',
        password: '',
        port: 5432
    })
    await db.connect()
    console.log('PARSE ADESIONI')
    try {
        const data = await getFromRemote(getAdesioniGruppo()) as CameraJSON
        const adesioni = extractBindings(data)

        // tslint:disable-next-line: max-func-body-length
        for (const value of adesioni) {
            const deputatoUrl: string = value.deputato
            const deputatoId: string = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/','')
            const gruppoUrl: string = value.gruppo
            const gruppoId: string = gruppoUrl.replace('http://dati.camera.it/ocd/gruppoParlamentare.rdf/','')

            const nomeGruppo: string = deleteParentesis(value.nomeGruppo)
            const siglaGruppo: string = value.siglaGruppo

            const inizioAdesione: string = parseDate(value.inizioAdesione)

            let fineAdesione: string
            if (value.fineAdesione) fineAdesione = parseDate(value.fineAdesione)

            let motivoFineAdesione: string
            if (value.motivoFineAdesione) motivoFineAdesione = value.motivoFineAdesione

            try {

                const queryGruppi = `INSERT INTO "public"."gruppi" (
                    "id",
                    "nome_gruppo",
                    "sigla_gruppo")
                    VALUES ($1,$2,$3)
                    ON CONFLICT (nome_gruppo,sigla_gruppo) DO UPDATE
                    SET nome_gruppo = excluded.nome_gruppo,
                        sigla_gruppo = excluded.sigla_gruppo;`

                const queryGruppiData = [
                    gruppoId,
                    nomeGruppo,
                    siglaGruppo
                ]

                await db.query(queryGruppi, queryGruppiData)

                const queryAdesione = `
                    INSERT INTO "public"."gruppo_deputato" (
                    "gruppo_id",
                    "deputato_id",
                    "inizio_adesione",
                    "fine_adesione",
                    "motivo_fine_adesione")
                    VALUES ($1,$2,$3,$4,$5);
                `

                const queryAdesioneData = [
                    gruppoId,
                    deputatoId,
                    inizioAdesione,
                    fineAdesione,
                    motivoFineAdesione
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
