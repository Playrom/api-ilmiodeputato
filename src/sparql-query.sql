prefix dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT ?persona ?cognome ?nome ?info ?urlFoto
?dataNascita ?luogoNascita ?genere ?inizioMandato ?fineMandato
?tipoCollegio ?collegio ?collegioUni ?lista ?gruppo ?nomeGruppo ?siglaGruppo ?incarico ?inizioIncarico ?fineIncarico  ?aggiornamento
WHERE {
?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.

## deputato
?d a ocd:deputato; ocd:aderisce ?aderisce;
ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
ocd:rif_mandatoCamera ?mandato.
OPTIONAL{?d dc:description ?info}
OPTIONAL{ ?d foaf:depiction ?urlFoto. }



##anagrafica
?d foaf:surname ?cognome; foaf:gender ?genere;foaf:firstName ?nome.
OPTIONAL{
?persona <http://purl.org/vocab/bio/0.1/Birth> ?nascita.
?nascita <http://purl.org/vocab/bio/0.1/date> ?dataNascita;
rdfs:label ?nato; ocd:rif_luogo ?luogoNascitaUri.
?luogoNascitaUri dc:title ?luogoNascita.
}

##aggiornamento del sistema
OPTIONAL{?d <http://lod.xdams.org/ontologies/ods/modified> ?aggiornamento.}

## mandato
?mandato ocd:rif_elezione ?elezione. 
?mandato ocd:startDate ?inizioMandato.
OPTIONAL{?mandato ocd:endDate ?fineMandato.}


## elezione
OPTIONAL {
?elezione dc:coverage ?collegio.
}
OPTIONAL {  
?elezione ocd:tipoElezione ?tipoCollegio.
}
OPTIONAL {
?elezione ocd:lista ?lista.
}
  
OPTIONAL {
?elezione dcterms:spatial ?collegioUni.
}

## adesione a gruppo
OPTIONAL{
  ?aderisce ocd:rif_gruppoParlamentare ?gruppo.
  ?gruppo dcterms:alternative ?siglaGruppo.
  ?gruppo rdfs:label ?nomeGruppo.
}

MINUS{?aderisce ocd:endDate ?fineAdesione}


## uffici parlamentari
OPTIONAL{ ?d ocd:rif_incarico ?incaricoUri. }
OPTIONAL{ ?incaricoUri ocd:ruolo ?incarico. }
OPTIONAL{ ?incaricoUri ocd:endDate ?fineIncarico. }
OPTIONAL{ ?incaricoUri ocd:startDate ?inizioIncarico. }

}
		
		