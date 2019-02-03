"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const dataCamera_1 = require("./dataCamera");
const queryCamera_1 = require("./queryCamera");
const utils_1 = require("./utils");
function parseIncarichiGruppo() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'collegi',
            password: '',
            port: 5432
        });
        yield db.connect();
        console.log('PARSE INCARICHI GRUPPO');
        try {
            const data = yield dataCamera_1.getFromRemote(queryCamera_1.getIncarichiGruppo());
            const incarichi = utils_1.extractBindings(data);
            for (const value of incarichi) {
                const deputatoUrl = value.deputato;
                const deputatoId = deputatoUrl.replace('http://dati.camera.it/ocd/deputato.rdf/', '');
                const gruppoUrl = value.gruppo;
                const gruppoId = gruppoUrl.replace('http://dati.camera.it/ocd/gruppoParlamentare.rdf/', '');
                const incarico = value.incarico;
                const inizioIncarico = utils_1.parseDate(value.inizioIncarico);
                let fineIncarico;
                if (value.fineIncarico)
                    fineIncarico = utils_1.parseDate(value.fineIncarico);
                try {
                    const queryIncarichi = `
                INSERT INTO "public"."incarichi_gruppo_deputato" (
                "gruppo_id",
                "deputato_id",
                "incarico",
                "inizio_incarico",
                "fine_incarico")
                VALUES ($1,$2,$3,$4,$5);
              `;
                    const queryIncarichiData = [
                        gruppoId,
                        deputatoId,
                        incarico,
                        inizioIncarico,
                        fineIncarico
                    ];
                    yield db.query(queryIncarichi, queryIncarichiData);
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
exports.parseIncarichiGruppo = parseIncarichiGruppo;
