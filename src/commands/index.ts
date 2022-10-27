import {Command, Flags} from '@oclif/core'
import {execSync} from 'node:child_process'
import * as fs from 'node:fs'
import { updateEnv } from '../scripts/env-edit'
export default class PrismaSeeder extends Command {
  static description = 'Start seeding by providing path_to_schema_prisma_file and url_of_the_database'

  static examples = [
    `$ oex --schema <path_to_schema_prisma_file> --database-url <url_of_the_database>
Start seeding...
Finish seeding.
`,
  ]

  static flags = {
    schema: Flags.string({char: 's', description: 'path to schema prisma file', required: true}),
    'database-url': Flags.string({char: 'd', description: 'url of the database', required: true}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(PrismaSeeder)

    this.log('Start seeding...')
    this.log('============================')
    this.log(`The schema path: ${flags.schema} \nand the DB url: ${flags['database-url']}`)
    this.log('============================')

    // generate json file
    execSync(`npx prisma generate --schema=${flags.schema}`, {encoding: 'utf-8'})  // the default is 'buffer'

    // read from json file
    const text = fs.readFileSync('json-schema/json-schema.json', 'utf8')
    const jsonFile = JSON.parse(text)
    const models = Object.keys(jsonFile.definitions)

    // update env DB
    execSync('cp ./.env.example ./.env', {encoding: 'utf-8'})
    updateEnv('./.env', 'DATABASE_URL', flags['database-url'])

    // migrate DB
    execSync(`npx prisma migrate deploy --schema=${flags.schema}`, {encoding: 'utf-8'})

    // iterate models, for each key.properties, insert data
    for (const model of models) {
      console.log(model)
    }

    this.log('============================')
    this.log('Finish seeding.')
  }
}
