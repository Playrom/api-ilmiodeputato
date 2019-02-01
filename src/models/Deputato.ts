export interface Deputato {
    persona_id: string
    cognome: string
    nome: string
    genere: string
    tipo_collegio: string
    collegio_plurinominale: string
    codice_collegio_uninominale: string
    nome_collegio_uninominale: string
    lista: undefined | string
    aggiornamento: string
    url_foto: string
    info: string
    data_nascita: string
    luogo_nascita: string
    inizio_mandato: string
    fine_mandato: undefined | string
    id: string
    gruppi: Gruppo[]
    uffici_parlamentari: UfficioParlamentare[]
    commissioni: UfficioParlamentare[]
    geoJsonMap: string
    estero: boolean
}

export interface UfficioParlamentare {
    id: string
    nome_organo: string
    tipo_organo: string
    inizio_incarico: string
    fine_incarico: undefined | string
    tipo?: string
    carica?: string
}

export interface Gruppo {
    id: string
    nome_gruppo: string
    sigla_gruppo: string
    inizio_adesione: string
    fine_adesione: undefined
    motivo_fine_adesione: undefined,
    componenti: Componente[]
}

export interface Componente {
    id: string
    nome_componente: string
    sigla_componente: string
    inizio_adesione: string
    fine_adesione: undefined
}
