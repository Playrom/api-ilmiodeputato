export interface Binding {
  bindingType: string,
  value: string,
  datatype: string
}

export interface Bindings {[key: string]: Binding}

export interface CameraJSON {
  head: {
    link: [string];
    vars: [string];
  },
  results: {
    distinct: Boolean;
    ordered: Boolean;
    bindings: [Bindings];
  }
}

// tslint:disable-next-line: no-any
export interface BindingReturn {[key: string]: string | undefined}

// tslint:disable-next-line: no-any
export function isString (test: any): test is string {
  return typeof test === 'string'
}

// tslint:disable-next-line: no-any
export function isNumber (test: any): test is number {
    return typeof test === 'number'
}

export function extractBindings (obj: CameraJSON) {
  const json = obj.results.bindings
  const arr: BindingReturn[] = []

  json.forEach((item: Bindings) => {
    const object: {[id: string]: string} = {}

    Object.keys(item).forEach((current: string) => {
      if (item[current].datatype === 'http://www.w3.org/2001/XMLSchema#integer') {
        object[current] = parseInt(item[current].value, 10).toString()
      } else {
        object[current] = item[current].value
      }
// tslint:disable-next-line: no-unsafe-any
      if (!isNumber(object[current])) {
        if (object[current].includes !== undefined && object[current].includes('node')) {
          object[current] = undefined
        }
// tslint:disable-next-line: no-unsafe-any
      } else if (object[current].replace !== undefined) {
// tslint:disable-next-line: no-unsafe-any
        object[current] = object[current].replace('http://dati.camera.it/ocd/deputato.rdf/','')
      }

    })
    arr.push(object)
  })

  return arr
}

export function parseDate (date: string) {
  const year = date.substring(0, 4)
  const month = date.substring(4, 6)
  const day = date.substring(6, 8)

  return `${year}-${month}-${day}`
}

export function deleteParentesis (str: string) {
  return str.replace(/ \(.*\)*/g, '')
}

export function listaToSigla (lista: string) {
  switch (lista) {
    case 'forza italia': return 'fi'
    case 'partito democratico': return 'pd'
    case 'liberi e uguali': return 'leu'
    case 'lega': return 'lega'
    case "fratelli d'italia": return 'fdi'
    case 'movimento 5 stelle': return 'm5s'
    default: return undefined
  }
}

export function letteraGenere (genere: string) {
  return genere === 'FEMALE' ? 'a' : 'o'
}
