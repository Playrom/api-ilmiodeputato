"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const db_1 = require("./db");
const router = express.Router();
exports.leggi = router;
router.get('/', (_req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        res.json({});
    }
    catch (e) {
        console.log(e);
        res.json({});
    }
}));
router.get('/:id', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        let result = yield db_1.db.query(`
            SELECT leggi.*
            FROM leggi
            WHERE leggi.id = $1
            LIMIT 1;
    `, [req.params.id]);
        if (result.rowCount > 0) {
            const legge = result.rows[0];
            legge.numero = parseInt(legge.numero, 10).toString();
            legge.data_presentazione = (new Date(legge.data_presentazione)).toISOString();
            if (legge.data_approvazione) {
                legge.data_approvazione = (new Date(legge.data_approvazione)).toISOString();
            }
            let firmatari = [];
            result = yield db_1.db.query(`
        SELECT d.id, d.nome, d.cognome, fl.primo_firmatario
        FROM firmatari_legge fl
        INNER JOIN deputati d ON fl.deputato_id = d.id
        WHERE fl.legge_id = $1;
      `, [req.params.id]);
            firmatari = firmatari.concat(result.rows);
            result = yield db_1.db.query(`
        SELECT p.id, p.nome, p.cognome, fl.primo_firmatario, fl.ruolo
        FROM firmatari_legge fl
        INNER JOIN persone p ON fl.persona_id = p.id
        WHERE fl.legge_id = $1;
      `, [req.params.id]);
            firmatari = firmatari.concat(result.rows);
            legge.firmatari = firmatari;
            result = yield db_1.db.query(`
        SELECT sl.stato, sl.data
        FROM stati_legge sl
        WHERE sl.legge_id = $1;
      `, [req.params.id]);
            legge.stati = result.rows;
            res.json(legge);
        }
        else {
            res.json({});
        }
    }
    catch (e) {
        console.log(e);
        res.json({});
    }
}));
