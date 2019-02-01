import { Client } from 'pg'
import { parseDeputati } from './parse-deputati'
import { parseAdesioni } from './parse-adesioni'
import { parseComponenti } from './parse-componenti'
import { parseIncarichiGruppo } from './parse-incarichi-gruppo'
import { parseUfficiParlamentari } from './parse-uffici-parlamentari'
import { parseCommissioni } from './parse-commissioni'
import { parseLeggi } from './parse-leggi'

async function main () {
  const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'collegi',
    password: '',
    port: 5432
  })

  await db.connect()
  await db.query(`
    DELETE FROM "public"."incarichi_gruppo_deputato";
    DELETE FROM "public"."uffici_parlamentari_deputato";
    DELETE FROM "public"."componente_deputato";
    DELETE FROM "public"."gruppo_deputato";
    DELETE FROM "public"."componenti";
    DELETE FROM "public"."gruppi";
    DELETE FROM "public"."firmatari_legge";
    DELETE FROM "public"."stati_legge";
    DELETE FROM "public"."leggi";
    DELETE FROM "public"."organi";
    DELETE FROM "public"."deputati";
    DELETE FROM "public"."persone";
  `
  )
  console.log('DB CLEANED')
  await db.end()
  await parseDeputati()
  await parseAdesioni()
  await parseComponenti()
  await parseIncarichiGruppo()
  await parseUfficiParlamentari()
  await parseCommissioni()
  await parseLeggi()
  console.log('PARSE COMPLETED')
}

main()
.then(() => {
  process.exit()
})
.catch((error: Error) => {
  console.log(error)
})
