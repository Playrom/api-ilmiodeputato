"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTuttePersone() {
    return `prefix dcterms: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?persona ?cognome ?nome ?dataNascita ?luogoNascita ?genere ?aggiornamento
  WHERE {
    ?persona a foaf:Person.

    ##anagrafica
    ?persona foaf:surname ?cognome; foaf:gender ?genere;foaf:firstName ?nome.
    OPTIONAL{
      ?persona <http://purl.org/vocab/bio/0.1/Birth> ?nascita.
      ?nascita <http://purl.org/vocab/bio/0.1/date> ?dataNascita;
               rdfs:label ?nato; ocd:rif_luogo ?luogoNascitaUri.
      ?luogoNascitaUri dc:title ?luogoNascita.
    }

    ##aggiornamento del sistema
    OPTIONAL{?persona <http://lod.xdams.org/ontologies/ods/modified> ?aggiornamento.}
  }`;
}
exports.getTuttePersone = getTuttePersone;
function getTuttiDeputati() {
    return `prefix dcterms: <http://purl.org/dc/terms/>

    SELECT DISTINCT ?persona ?deputato ?cognome ?nome ?info ?urlFoto
    ?dataNascita ?luogoNascita ?genere ?inizioMandato ?fineMandato
    ?tipoCollegio ?collegio ?collegioUni ?lista  ?aggiornamento ?gruppo ?nomeGruppo ?siglaGruppo
    WHERE {
      ?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.

      ## deputato
      ?deputato a ocd:deputato;
      ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
      ocd:rif_mandatoCamera ?mandato.
      OPTIONAL{?deputato dc:description ?info}
      OPTIONAL{?deputato foaf:depiction ?urlFoto.}

      ##anagrafica
      ?deputato foaf:surname ?cognome; foaf:gender ?genere;foaf:firstName ?nome.
      OPTIONAL{
        ?persona <http://purl.org/vocab/bio/0.1/Birth> ?nascita.
        ?nascita <http://purl.org/vocab/bio/0.1/date> ?dataNascita;
        rdfs:label ?nato; ocd:rif_luogo ?luogoNascitaUri.
        ?luogoNascitaUri dc:title ?luogoNascita.
      }

      ##aggiornamento del sistema
      OPTIONAL{?deputato <http://lod.xdams.org/ontologies/ods/modified> ?aggiornamento.}

      ## mandato
      ?mandato ocd:rif_elezione ?elezione.
      ?mandato ocd:startDate ?inizioMandato.
      OPTIONAL{?mandato ocd:endDate ?fineMandato.}

      ## elezione
      OPTIONAL {?elezione dc:coverage ?collegio.}
      OPTIONAL {?elezione ocd:tipoElezione ?tipoCollegio.}
      OPTIONAL {?elezione ocd:lista ?lista.}
      OPTIONAL {?elezione dcterms:spatial ?collegioUni.}
    }`;
}
exports.getTuttiDeputati = getTuttiDeputati;
function getAdesioniGruppo() {
    return `prefix dcterms: <http://purl.org/dc/terms/>

  SELECT DISTINCT ?deputato ?aggiornamento ?gruppo ?nomeGruppo ?siglaGruppo ?inizioAdesione ?fineAdesione ?motivoFineAdesione
  WHERE {
    ?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.
    ## deputato
    ?deputato a ocd:deputato;
                ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
                ocd:rif_mandatoCamera ?mandato.
    OPTIONAL{?deputato <http://lod.xdams.org/ontologies/ods/modified> ?aggiornamento}
    ?deputato ocd:aderisce ?aderisce.
    ?aderisce ocd:rif_gruppoParlamentare ?gruppo.
    ?gruppo rdfs:label ?nomeGruppo.
    OPTIONAL {?gruppo dcterms:alternative ?siglaGruppo}
    OPTIONAL {?aderisce ocd:motivoTermine ?motivoFineAdesione}
    ?aderisce ocd:startDate ?inizioAdesione.
    OPTIONAL {?aderisce ocd:endDate ?fineAdesione}
  }`;
}
exports.getAdesioniGruppo = getAdesioniGruppo;
function getIncarichiGruppo() {
    return `prefix dcterms: <http://purl.org/dc/terms/>

  SELECT DISTINCT ?deputato ?gruppo ?aggiornamento ?incarico ?inizioIncarico ?fineIncarico
  WHERE {
    ?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.
    ## deputato
    ?deputato a ocd:deputato;
                ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
                ocd:rif_mandatoCamera ?mandato.
    OPTIONAL{?deputato <http://lod.xdams.org/ontologies/ods/modified> ?aggiornamento.}
    ?deputato ocd:rif_incarico ?incaricoUri.
    ?incaricoUri ocd:rif_gruppoParlamentare  ?gruppo; ocd:ruolo ?incarico.
    ?incaricoUri ocd:startDate ?inizioIncarico.
    OPTIONAL{?incaricoUri ocd:endDate ?fineIncarico.}
  }`;
}
exports.getIncarichiGruppo = getIncarichiGruppo;
function getUfficiParlamentari() {
    return `prefix dcterms: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?deputato ?organo ?nomeOrgano ?tipoOrgano ?carica ?inizioIncarico ?fineIncarico
  WHERE {
      ?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.

      ?deputato a ocd:deputato; ocd:aderisce ?aderisce;
      ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
      ocd:rif_mandatoCamera ?mandato.

      ?deputato ocd:rif_ufficioParlamentare ?membroUri.
      ?membroUri ocd:rif_organo ?organo.
      ?membroUri ocd:startDate ?inizioIncarico.
      OPTIONAL{ ?membroUri ocd:carica ?carica. }
      ?organo dc:title ?nomeOrgano.
      ?organo dc:type ?tipoOrgano.
      OPTIONAL{ ?membroUri ocd:endDate ?fineIncarico. }
  }`;
}
exports.getUfficiParlamentari = getUfficiParlamentari;
function getCommissioni() {
    return `prefix dcterms: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?deputato ?organo ?tipo ?nomeOrgano ?tipoOrgano ?inizioIncarico ?fineIncarico
  WHERE {
    ?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.

    ?deputato a ocd:deputato; ocd:aderisce ?aderisce;
    ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
    ocd:rif_mandatoCamera ?mandato.

    ?deputato ocd:membro ?membroUri.
    ?membroUri ocd:rif_organo ?organo.
    ?membroUri ocd:startDate ?inizioIncarico.
    ?membroUri dc:type ?tipo.
    OPTIONAL{ ?membroUri ocd:endDate ?fineIncarico. }

    ?organo dc:title ?nomeOrgano.
    ?organo dc:type ?tipoOrgano.
    FILTER(regex(?tipoOrgano,'COMMISSIONE'))
  }
  `;
}
exports.getCommissioni = getCommissioni;
function getComponentiMisto() {
    return `prefix dcterms: <http://purl.org/dc/terms/>

  SELECT DISTINCT ?nomeComponente ?siglaComponente ?componente ?deputato ?inizioAdesione ?fineAdesione ?inizioComponente ?fineComponente
  WHERE {
    ?gruppo a ocd:gruppoParlamentare.

    ?gruppo ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>.

    ?gruppo ^ocd:rif_gruppoParlamentare ?componente.

    ?componente dc:title ?nomeComponente.
    ?componente dcterms:alternative ?siglaComponente.

    ?componente ocd:siComponeDi ?iscritto.
    ?iscritto ocd:rif_deputato ?deputato.
    ?deputato ocd:aderisce ?aderisce.
    ?aderisce ocd:rif_gruppoParlamentare ?gruppoDeputato.

    ?iscritto ocd:startDate ?inizioAdesione.
    OPTIONAL{?iscritto ocd:endDate ?fineAdesione}

    ?componente ocd:startDate ?inizioComponente.
    OPTIONAL{?componente ocd:endDate ?fineComponente}

    FILTER(regex(?gruppo,'http://dati.camera.it/ocd/gruppoParlamentare.rdf/gr3033','i'))
    FILTER(regex(?gruppoDeputato,'http://dati.camera.it/ocd/gruppoParlamentare.rdf/gr3033','i'))
  }
  `;
}
exports.getComponentiMisto = getComponentiMisto;
function getLeggi() {
    return `prefix dcterms: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?atto ?numero ?iniziativa ?tipo ?dataPresentazione ?dataApprovazione ?titolo
  WHERE {
    ?atto dc:identifier ?numero;
          ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
          dc:date ?dataPresentazione;
          ocd:rif_natura ?natura;
          dc:title ?titolo.
    OPTIONAL{?atto ocd:iniziativa ?iniziativa.}
    OPTIONAL{
      ?votazione a ocd:votazione; ocd:rif_attoCamera ?atto;
                   ocd:approvato "1"^^xsd:integer;
                   ocd:votazioneFinale "1"^^xsd:integer;
                   dc:date ?dataApprovazione.
    }

    ?natura dc:title ?tipo.
  }
  `;
}
exports.getLeggi = getLeggi;
function getPrimiFirmatari() {
    return `prefix dcterms: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?atto ?deputato ?persona ?ruolo ?type
  WHERE {
    ?atto ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
          ocd:primo_firmatario ?deputato.
    OPTIONAL{?deputato ocd:rif_persona ?persona.}
    OPTIONAL{?deputato ocd:ruolo ?ruolo.}
    ?atto rdf:type/rdfs:subClassOf* ?type.
    FILTER(regex(?type,'http://dati.camera.it/ocd/atto','i'))
  }
  `;
}
exports.getPrimiFirmatari = getPrimiFirmatari;
function getAltriFirmatari() {
    return `prefix dcterms: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?atto ?deputato ?persona ?ruolo ?type
  WHERE {
    ?atto ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
          ocd:altro_firmatario ?deputato.
    OPTIONAL{?deputato ocd:rif_persona ?persona.}
    OPTIONAL{?deputato ocd:ruolo ?ruolo.}
    ?atto rdf:type/rdfs:subClassOf* ?type.
    FILTER(regex(?type,'http://dati.camera.it/ocd/atto','i'))
  }
  `;
}
exports.getAltriFirmatari = getAltriFirmatari;
function getStatiLegge() {
    return `prefix dcterms: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?atto ?iter ?stato ?data
  WHERE {
    ?atto ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
          ocd:rif_statoIter ?iter.
    ?iter dc:title ?stato.
    ?iter dc:date ?data.
    ?atto rdf:type/rdfs:subClassOf* ?type.
    FILTER(regex(?type,'http://dati.camera.it/ocd/atto','i'))
  }
  `;
}
exports.getStatiLegge = getStatiLegge;
function getLeggiDeputato(personaUrl, isPrimoFirmatario, limit, offset) {
    let paging = '';
    if (limit !== undefined && offset !== undefined) {
        paging = `LIMIT ${limit} OFFSET ${offset}`;
    }
    let firmatario = '?deputato ^ocd:altro_firmatario ?atto.';
    if (isPrimoFirmatario === true) {
        firmatario = '?deputato ^ocd:primo_firmatario ?atto.';
    }
    return `prefix dcterms: <http://purl.org/dc/terms/>

  SELECT DISTINCT ?persona ?deputato ?atto ?numero ?iniziativa ?tipo ?presentazione ?titolo ?fase ?dataIter ?dataApprovazione
  WHERE {
    ?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.

    ?deputato a ocd:deputato;
    ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
    ocd:rif_mandatoCamera ?mandato.

    ${firmatario}

    ?atto ocd:iniziativa ?iniziativa;
      ocd:iniziativa ?iniziativa;
      dc:identifier ?numero;
      ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
      dc:date ?presentazione;
      ocd:rif_natura ?natura;
      dc:title ?titolo;
      ocd:rif_statoIter ?statoIter.

      ?statoIter  dc:title ?fase ;
      dc:date ?dataIter .

      ?natura dc:title ?tipo.

      ?statoIter  dc:title ?fase;
      dc:date ?dataIter .

    OPTIONAL{
      ?votazione a ocd:votazione; ocd:rif_attoCamera ?atto;
                   ocd:approvato "1"^^xsd:integer;
                   ocd:votazioneFinale "1"^^xsd:integer;
                   dc:date ?dataApprovazione.
    }

    FILTER(regex(?persona,'${personaUrl}','i'))
   } ORDER BY ?numero ${paging}`;
}
exports.getLeggiDeputato = getLeggiDeputato;
function getNumeroLeggiDeputato(personaUrl, isPrimoFirmatario) {
    let firmatario = '';
    if (isPrimoFirmatario === true) {
        firmatario = '?deputato ^ocd:primo_firmatario ?atto.';
    }
    else {
        firmatario = '?deputato ^ocd:altro_firmatario ?atto.';
    }
    return `prefix dcterms: <http://purl.org/dc/terms/>

    SELECT (count(DISTINCT ?atto) as ?count)
    WHERE {
      ?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.

      ?deputato a ocd:deputato;
      ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
      ocd:rif_mandatoCamera ?mandato.

      ${firmatario}

      ?atto ocd:iniziativa ?iniziativa;
        dc:identifier ?numero;
        ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
        dc:date ?presentazione;
        dc:title ?titolo; ocd:rif_statoIter ?statoIter .
      ?statoIter  dc:title ?fase ; dc:date ?dataIter .
      OPTIONAL{
        ?votazione a ocd:votazione; ocd:rif_attoCamera ?atto;
                    ocd:approvato "1"^^xsd:integer;
                    ocd:votazioneFinale "1"^^xsd:integer;
                    dc:date ?dataApprovazione.
      }

      FILTER(regex(?persona,'${personaUrl}','i'))
    }
   `;
}
exports.getNumeroLeggiDeputato = getNumeroLeggiDeputato;
function getDataLegge(numeroLegge) {
    return `select distinct ?atto ?numero ?iniziativa ?presentazione ?tipo ?titolo ?fase ?dataIter ?dataApprovazione ?primoFirmatario {
    ?atto a ocd:atto;
      ocd:iniziativa ?iniziativa;
      dc:identifier ?numero;
      ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
      dc:date ?presentazione;
      ocd:rif_natura ?natura;
      dc:title ?titolo;

      ocd:rif_statoIter ?statoIter.
      ?statoIter  dc:title ?fase ;

      dc:date ?dataIter .

      ?natura dc:title ?tipo.

      ?statoIter  dc:title ?fase;
      dc:date ?dataIter .

    OPTIONAL{
      ?votazione a ocd:votazione; ocd:rif_attoCamera ?atto;
                   ocd:approvato "1"^^xsd:integer;
                   ocd:votazioneFinale "1"^^xsd:integer;
                   dc:date ?dataApprovazione.
    }
    FILTER(regex(?atto,'^http://dati.camera.it/ocd/attocamera.rdf/ac18_${numeroLegge}','i')).


    OPTIONAL{
      ?atto ocd:primo_firmatario ?primoFirmatario.
    }
  }

  ORDER BY DESC(?dataIter)
  `;
}
exports.getDataLegge = getDataLegge;
function getFirmatariLegge(numeroLegge) {
    return `select distinct ?persona ?deputato ?tipo_firmatario WHERE {
    ?atto a ocd:atto;
      dc:identifier ?numero;
      ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>.
    {
      ?atto ocd:primo_firmatario ?deputato.
      BIND( 'primo_firmatario' as ?tipo_firmatario)
    } UNION {
      ?atto ocd:altro_firmatario ?deputato.
      BIND( 'altro_firmatario' as ?tipo_firmatario)
    }

    FILTER(regex(?atto,'^http://dati.camera.it/ocd/attocamera.rdf/ac18_${numeroLegge}$','i')).

    ?deputato ^ocd:rif_deputato ?rifDep.
    ?rifDep ^ocd:rif_mandatoCamera ?persona.
    ?persona rdf:type foaf:Person.

  }
  `;
}
exports.getFirmatariLegge = getFirmatariLegge;
function getVotazioniLegge(numeroLegge, limit, offset) {
    let paging = '';
    if (limit !== undefined && offset !== undefined) {
        paging = `LIMIT ${limit} OFFSET ${offset}`;
    }
    return `select distinct ?titolo ?id ?data ?tipo ?seduta ?approvato ?votazioneFinale ?votazioneSegreta ?presenti ?votanti ?maggioranza ?favorevoli ?contrari ?astenuti ?url {
    ?votazione a ocd:votazione;
      ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
      ocd:rif_attoCamera <http://dati.camera.it/ocd/attocamera.rdf/ac18_${numeroLegge}>;
      dc:title ?titolo;
      dc:type ?tipo;
      dc:identifier ?id;
      dc:relation ?url;
                 dc:date ?data;
                 ocd:rif_seduta ?seduta;
                 ocd:approvato ?approvato;
                 ocd:votazioneFinale ?votazioneFinale;
                 ocd:votazioneSegreta ?votazioneSegreta;
                 ocd:presenti ?presenti;
                 ocd:votanti ?votanti;
                 ocd:maggioranza ?maggioranza;
                 ocd:favorevoli ?favorevoli;
                 ocd:contrari ?contrari;
                 ocd:astenuti ?astenuti.
  } ORDER BY DESC(?id) ${paging}

  `;
}
exports.getVotazioniLegge = getVotazioniLegge;
function getNumeroVotazioniLegge(numeroLegge) {
    return `prefix dcterms: <http://purl.org/dc/terms/>

    SELECT (count(DISTINCT ?votazione) as ?count)
    WHERE {
        ?votazione a ocd:votazione;
          ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
          ocd:rif_attoCamera <http://dati.camera.it/ocd/attocamera.rdf/ac18_${numeroLegge}>.
    }
   `;
}
exports.getNumeroVotazioniLegge = getNumeroVotazioniLegge;
function getVotazione(numeroVotazione) {
    const votazione = `${numeroVotazione.toString().substr(0, 3)} ${numeroVotazione.toString().substr(3, 6)}`;
    return `select distinct ?titolo ?id ?data ?tipo ?seduta ?approvato ?votazioneFinale ?votazioneSegreta ?presenti ?votanti ?maggioranza ?favorevoli ?contrari ?astenuti ?url {
    ?votazione a ocd:votazione;
      ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
      dc:title ?titolo;
      dc:type ?tipo;
      dc:identifier ?id;
      dc:relation ?url;
                 dc:date ?data;
                 ocd:rif_seduta ?seduta;
                 ocd:approvato ?approvato;
                 ocd:votazioneFinale ?votazioneFinale;
                 ocd:votazioneSegreta ?votazioneSegreta;
                 ocd:presenti ?presenti;
                 ocd:votanti ?votanti;
                 ocd:maggioranza ?maggioranza;
                 ocd:favorevoli ?favorevoli;
                 ocd:contrari ?contrari;
                 ocd:astenuti ?astenuti.
    FILTER(regex(?votazione,'http://dati.camera.it/ocd/votazione.rdf/vs18_${votazione}','i')).

  } LIMIT 1

  `;
}
exports.getVotazione = getVotazione;
function getVotiDeputatiVotazione(numeroVotazione) {
    const votazione = `${numeroVotazione.toString().substr(0, 3)} ${numeroVotazione.toString().substr(3, 6)}`;
    return `select distinct ?id ?cognome ?nome ?tipo ?persona {
    ?voto a ocd:voto;
      ocd:rif_votazione <http://dati.camera.it/ocd/votazione.rdf/vs18_${votazione}>;
      dc:type ?tipo;
      dc:identifier ?id;
      ocd:rif_deputato ?deputato.
      ?deputato foaf:surname ?cognome;
                foaf:firstName ?nome.
  	?deputato ^ocd:rif_deputato ?rifDep.
    ?rifDep ^ocd:rif_mandatoCamera ?persona.
    ?persona rdf:type foaf:Person.

  } ORDER BY ?cognome


  `;
}
exports.getVotiDeputatiVotazione = getVotiDeputatiVotazione;
