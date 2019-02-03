"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const dataCamera_1 = require("./dataCamera");
const queryCamera_1 = require("./queryCamera");
const utils_1 = require("./utils");
function parseCommissioni() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'collegi',
            password: '',
            port: 5432
        });
        yield db.connect();
        console.log('PARSE COMMISSIONI');
        try {
            const data = yield dataCamera_1.getFromRemote(queryCamera_1.getCommissioni());
            const incarichi = utils_1.extractBindings(data);
            for (const value of incarichi) {
                const deputatoUrl = value.deputato;
                const deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/', '');
                const organourl = value.organo;
                const organoId = organourl.replace('http://dati.camera.it/ocd/organo.rdf/', '');
                const tipo = value.tipo;
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
                    const queryCommissioni = `
                INSERT INTO "public"."commissioni_deputato" (
                "organo_id",
                "deputato_id",
                "inizio_incarico",
                "fine_incarico",
                "tipo")
                VALUES ($1,$2,$3,$4,$5);
            `;
                    const queryCommissioniData = [
                        organoId,
                        deputatoId,
                        inizioIncarico,
                        fineIncarico,
                        tipo
                    ];
                    yield db.query(queryCommissioni, queryCommissioniData);
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
exports.parseCommissioni = parseCommissioni;
