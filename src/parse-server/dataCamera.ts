import fetch from 'node-fetch'

const url = 'http://dati.camera.it/sparql'

export async function getFromRemote (sql: string) {
  const fetchUrl = `${url}?query=${encodeURIComponent(sql).replace(/%20/g, '+')}&default-graph-uri=&format=application%2Fsparql-results%2Bjson`
  const result = await fetch(fetchUrl)

  return result.json()
}
