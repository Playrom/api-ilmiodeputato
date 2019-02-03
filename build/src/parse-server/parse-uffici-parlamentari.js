"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const dataCamera_1 = require("./dataCamera");
const queryCamera_1 = require("./queryCamera");
const utils_1 = require("./utils");
function parseUfficiParlamentari() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'collegi',
            password: '',
            port: 5432
        });
        yield db.connect();
        console.log('PARSE INCARICHI PARLAMENTO');
        try {
            const data = yield dataCamera_1.getFromRemote(queryCamera_1.getUfficiParlamentari());
            const incarichi = utils_1.extractBindings(data);
            for (const value of incarichi) {
                const deputatoUrl = value.deputato;
                const deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/', '');
                const organourl = value.organo;
                const organoId = organourl.replace('http://dati.camera.it/ocd/organo.rdf/', '');
                const carica = value.carica;
                const nomeOrgano = value.nomeOrgano;
                const tipoOrgano = value.tipoOrgano;
                const inizioIncarico = utils_1.parseDate(value.inizioIncarico);
                let fineIncarico;
                if (value.fineIncarico)
                    fineIncarico = utils_1.parseDate(value.fineIncarico);
                try {
                    const queryOrgani = `INSERT INTO "public"."organi" (
                "id",
                "nome_organo",
                "tipo_organo")
                VALUES ($1,$2,$3)
                ON CONFLICT (nome_organo,tipo_organo) DO UPDATE
                SET nome_organo = excluded.nome_organo,
                    tipo_organo = excluded.tipo_organo;`;
                    const queryOrganiData = [
                        organoId,
                        nomeOrgano,
                        tipoOrgano
                    ];
                    yield db.query(queryOrgani, queryOrganiData);
                    const queryUfficio = `
                INSERT INTO "public"."uffici_parlamentari_deputato" (
                "organo_id",
                "deputato_id",
                "inizio_incarico",
                "fine_incarico",
                "carica")
                VALUES ($1,$2,$3,$4,$5);
            `;
                    const queryUfficioData = [
                        organoId,
                        deputatoId,
                        inizioIncarico,
                        fineIncarico,
                        carica
                    ];
                    yield db.query(queryUfficio, queryUfficioData);
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
exports.parseUfficiParlamentari = parseUfficiParlamentari;
