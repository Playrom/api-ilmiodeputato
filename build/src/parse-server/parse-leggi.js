"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const dataCamera_1 = require("./dataCamera");
const queryCamera_1 = require("./queryCamera");
const utils_1 = require("./utils");
function parseLeggi() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'collegi',
            password: '',
            port: 5432
        });
        yield db.connect();
        console.log('PARSE LEGGI');
        try {
            let data = yield dataCamera_1.getFromRemote(queryCamera_1.getLeggi());
            const leggi = utils_1.extractBindings(data);
            for (const value of leggi) {
                const attoUrl = value.atto;
                const attoId = attoUrl.replace('http://dati.camera.it/ocd/attocamera.rdf/', '');
                const numero = parseInt(value.numero, 10);
                const iniziativa = value.iniziativa;
                const tipo = value.tipo;
                const titolo = value.titolo;
                const dataPresentazione = utils_1.parseDate(value.dataPresentazione);
                let dataApprovazione;
                if (value.dataApprovazione)
                    dataApprovazione = utils_1.parseDate(value.dataApprovazione);
                try {
                    const queryLeggi = `INSERT INTO "public"."leggi" (
                "id",
                "numero",
                "iniziativa",
                "tipo",
                "titolo",
                "data_presentazione",
                "data_approvazione")
                VALUES ($1,$2,$3,$4,$5,$6,$7)`;
                    const queryLeggiData = [
                        attoId,
                        numero,
                        iniziativa,
                        tipo,
                        titolo,
                        dataPresentazione,
                        dataApprovazione
                    ];
                    yield db.query(queryLeggi, queryLeggiData);
                }
                catch (e) {
                    console.log(e);
                    console.log(value);
                    return;
                }
            }
            data = (yield dataCamera_1.getFromRemote(queryCamera_1.getPrimiFirmatari()));
            const primiFirmatari = utils_1.extractBindings(data);
            for (const value of primiFirmatari) {
                const attoUrl = value.atto;
                const attoId = attoUrl.replace('http://dati.camera.it/ocd/attocamera.rdf/', '');
                let deputatoUrl;
                let deputatoId;
                if (value.deputato) {
                    deputatoUrl = value.deputato;
                    deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/', '');
                }
                let personaUrl;
                let personaId;
                if (value.persona) {
                    personaUrl = value.persona;
                    personaId = personaUrl.replace('http://dati.camera.it/ocd/persona.rdf/', '');
                }
                let ruolo;
                if (value.ruolo) {
                    ruolo = value.ruolo;
                }
                const primoFirmatario = true;
                try {
                    const queryFirmatari = `INSERT INTO "public"."firmatari_legge" (
                "legge_id",
                "deputato_id",
                "persona_id",
                "ruolo",
                "primo_firmatario")
                VALUES ($1,$2,$3,$4,$5)`;
                    const queryFirmatariData = [
                        attoId,
                        deputatoId,
                        personaId,
                        ruolo,
                        primoFirmatario
                    ];
                    yield db.query(queryFirmatari, queryFirmatariData);
                }
                catch (e) {
                    console.log(e);
                    console.log(value);
                    return;
                }
            }
            data = (yield dataCamera_1.getFromRemote(queryCamera_1.getAltriFirmatari()));
            const altriFirmatari = utils_1.extractBindings(data);
            for (const value of altriFirmatari) {
                const attoUrl = value.atto;
                const attoId = attoUrl.replace('http://dati.camera.it/ocd/attocamera.rdf/', '');
                let deputatoUrl;
                let deputatoId;
                if (value.deputato) {
                    deputatoUrl = value.deputato;
                    deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/', '');
                }
                let personaUrl;
                let personaId;
                if (value.persona) {
                    personaUrl = value.persona;
                    personaId = personaUrl.replace('http://dati.camera.it/ocd/persona.rdf/', '');
                }
                let ruolo;
                if (value.ruolo) {
                    ruolo = value.ruolo;
                }
                const primoFirmatario = false;
                try {
                    const queryFirmatari = `INSERT INTO "public"."firmatari_legge" (
              "legge_id",
              "deputato_id",
              "persona_id",
              "ruolo",
              "primo_firmatario")
              VALUES ($1,$2,$3,$4,$5)`;
                    const queryFirmatariData = [
                        attoId,
                        deputatoId,
                        personaId,
                        ruolo,
                        primoFirmatario
                    ];
                    yield db.query(queryFirmatari, queryFirmatariData);
                }
                catch (e) {
                    console.log(e);
                    console.log(value);
                    return;
                }
            }
            data = (yield dataCamera_1.getFromRemote(queryCamera_1.getStatiLegge()));
            const statiLegge = utils_1.extractBindings(data);
            for (const value of statiLegge) {
                const attoUrl = value.atto;
                const attoId = attoUrl.replace('http://dati.camera.it/ocd/attocamera.rdf/', '');
                const iterUrl = value.iter;
                const iterId = iterUrl.replace('http://dati.camera.it/ocd/statoIter.rdf/', '');
                const stato = value.stato;
                const dataIter = utils_1.parseDate(value.data);
                try {
                    const queryStati = `INSERT INTO "public"."stati_legge" (
              "id",
              "legge_id",
              "stato",
              "data")
              VALUES ($1,$2,$3,$4)`;
                    const queryStatiData = [
                        iterId,
                        attoId,
                        stato,
                        dataIter
                    ];
                    yield db.query(queryStati, queryStatiData);
                }
                catch (e) {
                    console.log(e);
                    console.log(value);
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
exports.parseLeggi = parseLeggi;
