"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const config_1 = require("../config");
const db_1 = require("./db");
const router = express.Router();
exports.deputati = router;
router.get('/', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        let fields = ['id', 'nome', 'cognome'];
        if (req.query.fields) {
            fields = req.query.fields.split(',');
        }
        const sqlSelect = fields.reduce((final, current) => `${final},${current}`, fields[0]);
        const result = yield db_1.db.query(`
            SELECT ${sqlSelect}
            FROM deputati
            ORDER BY cognome ASC;
    `);
        if (result.rowCount > 0) {
            res.json(result.rows);
        }
    }
    catch (e) {
        console.log(e);
        res.json({});
    }
}));
router.get('/:id', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        let result = yield db_1.db.query(`
            SELECT deputati.*
            FROM deputati
            WHERE deputati.id = $1
            LIMIT 1;
    `, [req.params.id]);
        if (result.rowCount > 0) {
            const deputato = result.rows[0];
            result = yield db_1.db.query(`
            SELECT g.*, gd.inizio_adesione, gd.fine_adesione, gd.motivo_fine_adesione
            FROM gruppo_deputato gd
            INNER JOIN gruppi g ON gd.gruppo_id = g.id
            WHERE gd.deputato_id = $1;
      `, [req.params.id]);
            if (result.rowCount > 0) {
                const gruppi = [];
                for (const gruppo of result.rows) {
                    if (gruppo.id === 'gr3033') {
                        const componenti = yield db_1.db.query(`
              SELECT c.*, cd.inizio_adesione, cd.fine_adesione
              FROM componente_deputato cd
              INNER JOIN componenti c ON cd.componente_id = c.id
              WHERE cd.deputato_id = $1;
            `, [req.params.id]);
                        gruppo.componenti = componenti.rows;
                    }
                    let incarichiGruppo = [];
                    const innerResult = yield db_1.db.query(`
                SELECT igd.*
                FROM incarichi_gruppo_deputato igd
                WHERE igd.deputato_id = $1 AND
                      igd.gruppo_id = $2;
          `, [req.params.id, gruppo.id]);
                    if (innerResult.rowCount > 0) {
                        incarichiGruppo = incarichiGruppo.concat(innerResult.rows);
                    }
                    gruppo.incarichi = incarichiGruppo;
                    gruppi.push(gruppo);
                }
                deputato.gruppi = result.rows;
            }
            result = yield db_1.db.query(`
            SELECT o.*, up.inizio_incarico, up.fine_incarico, up.carica
            FROM uffici_parlamentari_deputato up
            INNER JOIN organi o ON up.organo_id = o.id
            WHERE up.deputato_id = $1;
      `, [req.params.id]);
            if (result.rowCount > 0) {
                deputato.uffici_parlamentari = result.rows;
            }
            result = yield db_1.db.query(`
            SELECT o.*, cd.inizio_incarico, cd.fine_incarico, cd.tipo
            FROM commissioni_deputato cd
            INNER JOIN organi o ON cd.organo_id = o.id
            WHERE cd.deputato_id = $1;
      `, [req.params.id]);
            if (result.rowCount > 0) {
                deputato.commissioni = result.rows;
            }
            let resultCollegio;
            if (deputato.collegio_plurinominale.toLowerCase().includes('america') ||
                deputato.collegio_plurinominale.toLowerCase().includes('africa') ||
                deputato.collegio_plurinominale.toLowerCase().includes('europa')) {
                deputato.estero = true;
            }
            else if (deputato.tipo_collegio === 'maggioritario') {
                resultCollegio = yield db_1.db.query(`
            SELECT gid
            FROM collegi
            WHERE UPPER(cam17u_nom) = UPPER($1)
            LIMIT 1;
        `, [deputato.nome_collegio_uninominale]);
                deputato.geoJsonMap = `${config_1.config.apiPath}/collegi/${resultCollegio.rows[0].gid}/mappa`;
                deputato.estero = false;
            }
            else {
                resultCollegio = yield db_1.db.query(`
            SELECT gid
            FROM collegi
            WHERE UPPER(cam17p_den) = UPPER($1)
            LIMIT 1;
        `, [deputato.collegio_plurinominale]);
                deputato.geoJsonMap = `${config_1.config.apiPath}/collegi/${resultCollegio.rows[0].gid}/mappa`;
                deputato.estero = false;
            }
            res.json(deputato);
        }
    }
    catch (e) {
        console.log(e);
        res.json({});
    }
}));
router.get('/:id/leggi', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const result = yield db_1.db.query(`
        SELECT l.*, fl.primo_firmatario
        FROM firmatari_legge fl
        INNER JOIN leggi l ON fl.legge_id = l.id
        WHERE fl.deputato_id = $1;
    `, [req.params.id]);
        const json = result.rows;
        res.json(json);
    }
    catch (e) {
        console.log(e);
        res.json([]);
    }
}));
