"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const dataCamera_1 = require("./dataCamera");
const queryCamera_1 = require("./queryCamera");
const utils_1 = require("./utils");
function parseAdesioni() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'collegi',
            password: '',
            port: 5432
        });
        yield db.connect();
        console.log('PARSE ADESIONI');
        try {
            const data = yield dataCamera_1.getFromRemote(queryCamera_1.getAdesioniGruppo());
            const adesioni = utils_1.extractBindings(data);
            for (const value of adesioni) {
                const deputatoUrl = value.deputato;
                const deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/', '');
                const gruppoUrl = value.gruppo;
                const gruppoId = gruppoUrl.replace('http://dati.camera.it/ocd/gruppoParlamentare.rdf/', '');
                const nomeGruppo = utils_1.deleteParentesis(value.nomeGruppo);
                const siglaGruppo = value.siglaGruppo;
                const inizioAdesione = utils_1.parseDate(value.inizioAdesione);
                let fineAdesione;
                if (value.fineAdesione)
                    fineAdesione = utils_1.parseDate(value.fineAdesione);
                let motivoFineAdesione;
                if (value.motivoFineAdesione)
                    motivoFineAdesione = value.motivoFineAdesione;
                try {
                    const queryGruppi = `INSERT INTO "public"."gruppi" (
                    "id",
                    "nome_gruppo",
                    "sigla_gruppo")
                    VALUES ($1,$2,$3)
                    ON CONFLICT (nome_gruppo,sigla_gruppo) DO UPDATE
                    SET nome_gruppo = excluded.nome_gruppo,
                        sigla_gruppo = excluded.sigla_gruppo;`;
                    const queryGruppiData = [
                        gruppoId,
                        nomeGruppo,
                        siglaGruppo
                    ];
                    yield db.query(queryGruppi, queryGruppiData);
                    const queryAdesione = `
                    INSERT INTO "public"."gruppo_deputato" (
                    "gruppo_id",
                    "deputato_id",
                    "inizio_adesione",
                    "fine_adesione",
                    "motivo_fine_adesione")
                    VALUES ($1,$2,$3,$4,$5);
                `;
                    const queryAdesioneData = [
                        gruppoId,
                        deputatoId,
                        inizioAdesione,
                        fineAdesione,
                        motivoFineAdesione
                    ];
                    yield db.query(queryAdesione, queryAdesioneData);
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
exports.parseAdesioni = parseAdesioni;
