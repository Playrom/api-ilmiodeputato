"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const dataCamera_1 = require("./dataCamera");
const queryCamera_1 = require("./queryCamera");
const utils_1 = require("./utils");
function parseDeputati() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'collegi',
            password: '',
            port: 5432
        });
        yield db.connect();
        console.log('PARSE ANAGRAFICHE');
        try {
            let exit = true;
            let OFFSET = 0;
            while (exit) {
                const dataInner = yield dataCamera_1.getFromRemote(`${queryCamera_1.getTuttePersone()} LIMIT 1000 OFFSET ${OFFSET}`);
                const persone = utils_1.extractBindings(dataInner);
                OFFSET = OFFSET + 1000;
                if (persone.length === 0) {
                    exit = false;
                    break;
                }
                for (const value of persone) {
                    const personaUrl = value.persona;
                    const personaId = personaUrl.replace('http://dati.camera.it/ocd/persona.rdf/', '');
                    const cognome = value.cognome.toUpperCase();
                    const nome = value.nome.toUpperCase();
                    const genere = value.genere.toUpperCase();
                    let aggiornamento;
                    if (value.aggiornamento)
                        aggiornamento = value.aggiornamento;
                    let dataNascita;
                    if (value.dataNascita)
                        dataNascita = utils_1.parseDate(value.dataNascita);
                    let luogoNascita;
                    if (value.luogoNascita)
                        luogoNascita = value.luogoNascita;
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
                    `;
                        const queryPersoneData = [
                            personaId,
                            cognome,
                            nome,
                            genere,
                            dataNascita,
                            luogoNascita
                        ];
                        yield db.query(queryPersone, queryPersoneData);
                    }
                    catch (e) {
                        console.log(e);
                        return;
                    }
                }
            }
            const data = yield dataCamera_1.getFromRemote(queryCamera_1.getTuttiDeputati());
            const deputati = utils_1.extractBindings(data);
            for (const value of deputati) {
                const personaUrl = value.persona;
                const personaId = personaUrl.replace('http://dati.camera.it/ocd/persona.rdf/', '');
                const deputatoUrl = value.deputato;
                const deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/', '');
                const cognome = value.cognome.toUpperCase();
                const nome = value.nome.toUpperCase();
                const genere = value.genere.toUpperCase();
                const tipoCollegio = value.tipoCollegio;
                let collegioPlurinominale = value.collegio.toLowerCase();
                collegioPlurinominale = collegioPlurinominale.charAt(0).toUpperCase() + collegioPlurinominale.slice(1);
                let codiceCollegioUninominale;
                let nomeCollegioUninominale;
                if (value.collegioUni !== undefined) {
                    const collegioUninominale = value.collegioUni;
                    const codeUniInCollegio = collegioUninominale.substring(0, 2);
                    nomeCollegioUninominale = collegioUninominale.substring(5, collegioUninominale.length);
                    codiceCollegioUninominale = collegioPlurinominale.substring(0, collegioPlurinominale.length - 2) + codeUniInCollegio;
                }
                const aggiornamento = value.aggiornamento;
                let info;
                if (value.info !== undefined) {
                    info = value.info;
                }
                let lista;
                if (value.lista !== undefined) {
                    lista = value.lista;
                }
                let urlFoto;
                if (value.urlFoto !== undefined) {
                    urlFoto = value.urlFoto;
                }
                const dataNascita = utils_1.parseDate(value.dataNascita);
                const luogoNascita = value.luogoNascita;
                let inizioMandato;
                if (value.inizioMandato !== undefined) {
                    inizioMandato = utils_1.parseDate(value.inizioMandato);
                }
                let fineMandato;
                if (value.fineMandato !== undefined) {
                    fineMandato = utils_1.parseDate(value.fineMandato);
                }
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
                };
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
                `;
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
                    ];
                    yield db.query(queryDeputati, queryDeputatiData);
                }
                catch (e) {
                    console.log(e);
                    return;
                }
            }
        }
        catch (e) {
            console.log(e);
            return;
        }
    });
}
exports.parseDeputati = parseDeputati;
