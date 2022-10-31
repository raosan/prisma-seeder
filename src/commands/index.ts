import { Command, Flags } from '@oclif/core'
import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import { updateEnv } from '../scripts/env-edit'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default class PrismaSeeder extends Command {
  static description =
    'Start seeding by providing path_to_schema_prisma_file and url_of_the_database'

  static examples = [
    `$ oex --schema <path_to_schema_prisma_file> --database-url <url_of_the_database>
Start seeding...
Finish seeding.
`,
  ]

  static flags = {
    schema: Flags.string({
      char: 's',
      description: 'path to schema prisma file',
      required: true,
    }),
    'database-url': Flags.string({
      char: 'd',
      description: 'url of the database',
      required: true,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(PrismaSeeder)

    this.log('Start seeding...')
    this.log('============================')
    this.log(
      `The schema path: ${flags.schema} \nand the DB url: ${flags['database-url']}`
    )
    this.log('============================')

    // update env DB
    this.log('Updating env...')
    this.log('============================')
    execSync('cp ./.env.example ./.env', { encoding: 'utf-8' })
    updateEnv('./.env', 'DATABASE_URL', flags['database-url'])

    const schemaFlags = `--schema=${flags.schema}`
    // generate json file
    this.log('Generating prisma schema...')
    this.log('============================')
    execSync(`npx prisma generate ${schemaFlags}`, {
      encoding: 'utf-8',
    })
    // migrate DB
    this.log('Resetting DB...')
    this.log('============================')
    execSync('rm -rf migrations', { encoding: 'utf-8' })
    execSync(`npx prisma migrate reset --force ${schemaFlags}`, {
      encoding: 'utf-8',
    })
    this.log('Migrating DB...')
    this.log('============================')
    execSync(`npx prisma migrate dev --name init ${schemaFlags}`, {
      encoding: 'utf-8',
    })

    // read from json file
    const text = fs.readFileSync('json-schema/json-schema.json', 'utf8')
    const jsonFile = JSON.parse(text)
    const models = Object.keys(jsonFile.definitions)

    // iterate models, for each key.properties, insert data
    const results = []
    for (const model of models) {
      this.log('Seeding model ' + model + '...')
      this.log('============================')
      const propertiesObj = jsonFile.definitions[model].properties
      const propertiesArr = Object.keys(propertiesObj)

      const fakeDatas: any = []
      for (let index = 0; index < 3; index++) {
        const fake: any = Object.assign(
          {},
          ...propertiesArr
            .filter(
              (key) =>
                key !== 'id' &&
                (propertiesObj[key].type === 'integer' ||
                  propertiesObj[key].type === 'string')
            )
            .map((key) => ({
              [key]: propertiesObj[key].type === 'integer' ? 1 : 'lalala',
            }))
        )

        fakeDatas.push(fake)
      }

      const key = model.toLowerCase()
      results.push(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        prisma[key].createMany({
          data: fakeDatas,
        })
      )
    }

    await Promise.all(results)

    await prisma.$disconnect()
    this.log('============================')
    this.log('Finish seeding.')
  }
}
