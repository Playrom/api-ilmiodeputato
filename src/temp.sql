prefix dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT ?persona ?cognome ?nome ?componente ?nomeGruppo ?siglaGruppo

WHERE {
?persona ocd:rif_mandatoCamera ?mandato; a foaf:Person.

## deputato
?d a ocd:deputato; ocd:aderisce ?aderisce;
ocd:rif_leg <http://dati.camera.it/ocd/legislatura.rdf/repubblica_18>;
ocd:rif_mandatoCamera ?mandato.
OPTIONAL{?d dc:description ?info}
OPTIONAL{ ?d foaf:depiction ?urlFoto. }



##anagrafica
?d foaf:surname ?cognome; foaf:firstName ?nome.


## adesione a gruppo
OPTIONAL{
  ?aderisce ocd:rif_gruppoParlamentare ?gruppo.
  ?gruppo dcterms:alternative ?siglaGruppo.
  ?gruppo rdfs:label ?nomeGruppo.
}

MINUS{?aderisce ocd:endDate ?fineAdesione}

OPTIONAL{
   ?gruppo ocd:rif_gruppoParlamentare ?componente.
}
  
}
		