import { Client } from 'pg'

import { getFromRemote }  from './dataCamera'
import { getTuttiDeputati, getTuttePersone } from './queryCamera'
import { parseDate, extractBindings, CameraJSON} from './utils'

export async function parseDeputati () {
    const db = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'collegi',
        password: '',
        port: 5432
    })
    await db.connect()
    console.log('PARSE ANAGRAFICHE')
    try {

        let exit = true
        let OFFSET = 0
        while (exit) {
            const dataInner = await getFromRemote(`${getTuttePersone()} LIMIT 1000 OFFSET ${OFFSET}`) as CameraJSON
            const persone = extractBindings(dataInner)
            OFFSET = OFFSET + 1000
            if (persone.length === 0) {
                exit = false
                break
            }
            // tslint:disable-next-line: max-func-body-length
            for (const value of persone) {
                const personaUrl: string = value.persona
                const personaId: string = personaUrl.replace('http://dati.camera.it/ocd/persona.rdf/','')
                const cognome: string = value.cognome.toUpperCase()
                const nome: string = value.nome.toUpperCase()
                const genere: string = value.genere.toUpperCase()

                let aggiornamento: string
                if (value.aggiornamento) aggiornamento = value.aggiornamento

                let dataNascita: string
                if (value.dataNascita) dataNascita = parseDate(value.dataNascita)

                let luogoNascita: string
                if (value.luogoNascita) luogoNascita = value.luogoNascita

                try {

                    const queryPersone = `INSERT INTO "public"."persone" (
                    "id",
                    "cognome",
                    "nome" ,
                    "genere" ,
                    "data_nascita",
                    "luogo_nascita")
                    VALUES ($1,$2,$3,$4,$5,$6)
                    ON CONFLICT (id) DO NOTHING;
                    `

                    const queryPersoneData = [
                        personaId,
                        cognome,
                        nome,
                        genere,
                        dataNascita,
                        luogoNascita
                    ]

                    await db.query(queryPersone, queryPersoneData)
                } catch (e) {
                    console.log(e)

                    return
                }
            }
        }

        const data = await getFromRemote(getTuttiDeputati()) as CameraJSON
        const deputati = extractBindings(data)

        // tslint:disable-next-line: max-func-body-length
        for (const value of deputati) {
            const personaUrl: string = value.persona
            const personaId: string = personaUrl.replace('http://dati.camera.it/ocd/persona.rdf/','')
            const deputatoUrl: string = value.deputato
            const deputatoId: string = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/','')
            const cognome: string = value.cognome.toUpperCase()
            const nome: string = value.nome.toUpperCase()
            const genere: string = value.genere.toUpperCase()

            const tipoCollegio: string = value.tipoCollegio
            let collegioPlurinominale: string = value.collegio.toLowerCase()
            collegioPlurinominale = collegioPlurinominale.charAt(0).toUpperCase() + collegioPlurinominale.slice(1)

            let codiceCollegioUninominale: string
            let nomeCollegioUninominale: string

            if (value.collegioUni !== undefined) {
                const collegioUninominale: string = value.collegioUni
                const codeUniInCollegio: string = collegioUninominale.substring(0, 2)
                nomeCollegioUninominale = collegioUninominale.substring(5, collegioUninominale.length)
                codiceCollegioUninominale = collegioPlurinominale.substring(0, collegioPlurinominale.length - 2) + codeUniInCollegio
            }

            const aggiornamento: string = value.aggiornamento

            let info: string
            if (value.info !== undefined) {
                info = value.info
            }

            let lista: string
            if (value.lista !== undefined) { lista = value.lista }

            let urlFoto: string
            if (value.urlFoto !== undefined) {urlFoto = value.urlFoto}

            const dataNascita: string = parseDate(value.dataNascita)
            const luogoNascita: string = value.luogoNascita

            let inizioMandato: string
            if (value.inizioMandato !== undefined) {inizioMandato = parseDate(value.inizioMandato)}

            let fineMandato: string
            if (value.fineMandato !== undefined) {fineMandato = parseDate(value.fineMandato)}

            const deputato = {
                personaId,
                deputatoId,
                cognome,
                nome,
                genere,
                urlFoto,
                tipoCollegio,
                collegioPlurinominale,
                codiceCollegioUninominale,
                nomeCollegioUninominale,
                lista,
                aggiornamento,
                info,
                dataNascita,
                luogoNascita,
                inizioMandato,
                fineMandato
            }

            try {

                const queryDeputati = `INSERT INTO "public"."deputati" (
                "id",
                "cognome",
                "nome" ,
                "genere" ,
                "url_foto",
                "tipo_collegio",
                "collegio_plurinominale",
                "codice_collegio_uninominale",
                "nome_collegio_uninominale",
                "lista",
                "aggiornamento",
                "info",
                "data_nascita",
                "luogo_nascita",
                "inizio_mandato",
                "fine_mandato",
                "persona_id")
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
                `

                const queryDeputatiData = [
                    deputato.deputatoId,
                    deputato.cognome,
                    deputato.nome,
                    deputato.genere,
                    deputato.urlFoto,
                    deputato.tipoCollegio,
                    deputato.collegioPlurinominale,
                    deputato.codiceCollegioUninominale,
                    deputato.nomeCollegioUninominale,
                    deputato.lista,
                    deputato.aggiornamento,
                    deputato.info,
                    deputato.dataNascita,
                    deputato.luogoNascita,
                    deputato.inizioMandato,
                    deputato.fineMandato,
                    deputato.personaId
                ]

                await db.query(queryDeputati, queryDeputatiData)
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
