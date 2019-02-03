"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_fetch_1 = require("node-fetch");
const url = 'http://dati.camera.it/sparql';
function getFromRemote(sql) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fetchUrl = `${url}?query=${encodeURIComponent(sql).replace(/%20/g, '+')}&default-graph-uri=&format=application%2Fsparql-results%2Bjson`;
        const result = yield node_fetch_1.default(fetchUrl);
        return result.json();
    });
}
exports.getFromRemote = getFromRemote;
