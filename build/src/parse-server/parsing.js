"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const parse_deputati_1 = require("./parse-deputati");
const parse_adesioni_1 = require("./parse-adesioni");
const parse_componenti_1 = require("./parse-componenti");
const parse_incarichi_gruppo_1 = require("./parse-incarichi-gruppo");
const parse_uffici_parlamentari_1 = require("./parse-uffici-parlamentari");
const parse_commissioni_1 = require("./parse-commissioni");
const parse_leggi_1 = require("./parse-leggi");
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const db = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'collegi',
            password: '',
            port: 5432
        });
        yield db.connect();
        yield db.query(`
    DELETE FROM "public"."incarichi_gruppo_deputato";
    DELETE FROM "public"."uffici_parlamentari_deputato";
    DELETE FROM "public"."componente_deputato";
    DELETE FROM "public"."gruppo_deputato";
    DELETE FROM "public"."componenti";
    DELETE FROM "public"."gruppi";
    DELETE FROM "public"."firmatari_legge";
    DELETE FROM "public"."stati_legge";
    DELETE FROM "public"."leggi";
    DELETE FROM "public"."organi";
    DELETE FROM "public"."deputati";
    DELETE FROM "public"."persone";
  `);
        console.log('DB CLEANED');
        yield db.end();
        yield parse_deputati_1.parseDeputati();
        yield parse_adesioni_1.parseAdesioni();
        yield parse_componenti_1.parseComponenti();
        yield parse_incarichi_gruppo_1.parseIncarichiGruppo();
        yield parse_uffici_parlamentari_1.parseUfficiParlamentari();
        yield parse_commissioni_1.parseCommissioni();
        yield parse_leggi_1.parseLeggi();
        console.log('PARSE COMPLETED');
    });
}
main()
    .then(() => {
    process.exit();
})
    .catch((error) => {
    console.log(error);
});
