"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isString(test) {
    return typeof test === 'string';
}
exports.isString = isString;
function isNumber(test) {
    return typeof test === 'number';
}
exports.isNumber = isNumber;
function extractBindings(obj) {
    const json = obj.results.bindings;
    const arr = [];
    json.forEach((item) => {
        const object = {};
        Object.keys(item).forEach((current) => {
            if (item[current].datatype === 'http://www.w3.org/2001/XMLSchema#integer') {
                object[current] = parseInt(item[current].value, 10).toString();
            }
            else {
                object[current] = item[current].value;
            }
            if (!isNumber(object[current])) {
                if (object[current].includes !== undefined && object[current].includes('node')) {
                    object[current] = undefined;
                }
            }
            else if (object[current].replace !== undefined) {
                object[current] = object[current].replace('http://dati.camera.it/ocd/deputato.rdf/', '');
            }
        });
        arr.push(object);
    });
    return arr;
}
exports.extractBindings = extractBindings;
function parseDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return `${year}-${month}-${day}`;
}
exports.parseDate = parseDate;
function deleteParentesis(str) {
    return str.replace(/ \(.*\)*/g, '');
}
exports.deleteParentesis = deleteParentesis;
function listaToSigla(lista) {
    switch (lista) {
        case 'forza italia': return 'fi';
        case 'partito democratico': return 'pd';
        case 'liberi e uguali': return 'leu';
        case 'lega': return 'lega';
        case "fratelli d'italia": return 'fdi';
        case 'movimento 5 stelle': return 'm5s';
        default: return undefined;
    }
}
exports.listaToSigla = listaToSigla;
function letteraGenere(genere) {
    return genere === 'FEMALE' ? 'a' : 'o';
}
exports.letteraGenere = letteraGenere;
