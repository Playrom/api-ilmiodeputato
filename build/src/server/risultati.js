"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const db_1 = require("./db");
const router = express.Router();
exports.risultati = router;
router.get('/', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield db_1.db.query(`
        SELECT *
        FROM risultati_nazionali_liste;`);
        return res.json(result.rows);
    }
    catch (e) {
        console.log(e);
        return res.send('error');
    }
}));
