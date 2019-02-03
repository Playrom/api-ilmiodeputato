"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const dataCamera_1 = require("./dataCamera");
const queryCamera_1 = require("./queryCamera");
const utils_1 = require("./utils");
function parseComponenti() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'collegi',
            password: '',
            port: 5432
        });
        yield db.connect();
        console.log('PARSE COMPONENTI');
        try {
            const data = yield dataCamera_1.getFromRemote(queryCamera_1.getComponentiMisto());
            const adesioni = utils_1.extractBindings(data);
            for (const value of adesioni) {
                const deputatoUrl = value.deputato;
                const deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/', '');
                const componenteUrl = value.componente;
                const componenteId = componenteUrl.replace('http://dati.camera.it/ocd/componenteGruppoMisto.rdf/', '');
                const nomeComponente = utils_1.deleteParentesis(value.nomeComponente);
                const siglaComponente = value.siglaComponente;
                const inizioAdesione = utils_1.parseDate(value.inizioAdesione);
                let fineAdesione;
                if (value.fineAdesione)
                    fineAdesione = utils_1.parseDate(value.fineAdesione);
                const inizioComponente = utils_1.parseDate(value.inizioComponente);
                let fineComponente;
                if (value.fineComponente)
                    fineComponente = utils_1.parseDate(value.fineComponente);
                try {
                    const queryComponenti = `INSERT INTO "public"."componenti" (
                "id",
                "nome_componente",
                "sigla_componente")
                VALUES ($1,$2,$3)
                ON CONFLICT (nome_componente,sigla_componente) DO UPDATE
                SET nome_componente = excluded.nome_componente,
                    sigla_componente = excluded.sigla_componente;`;
                    const queryComponentiData = [
                        componenteId,
                        nomeComponente,
                        siglaComponente
                    ];
                    yield db.query(queryComponenti, queryComponentiData);
                    const queryAdesione = `
                INSERT INTO "public"."componente_deputato" (
                "componente_id",
                "deputato_id",
                "inizio_adesione",
                "fine_adesione")
                VALUES ($1,$2,$3,$4);
              `;
                    const queryAdesioneData = [
                        componenteId,
                        deputatoId,
                        inizioAdesione,
                        fineAdesione
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
exports.parseComponenti = parseComponenti;
