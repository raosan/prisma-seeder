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

    // copy prisma schema file
    this.log('Copying schema file...')
    this.log('============================')
    execSync('rm -rf prisma', { encoding: 'utf-8' })
    execSync('mkdir prisma', { encoding: 'utf-8' })
    execSync(`cp ${flags.schema} ./prisma/schema.prisma`, { encoding: 'utf-8' })

    // generate json file
    this.log('Generating prisma schema...')
    this.log('============================')
    execSync(`npx prisma generate`, { encoding: 'utf-8' })

    // migrate DB
    this.log('Resetting DB...')
    this.log('============================')
    execSync('rm -rf migrations', { encoding: 'utf-8' })
    execSync(`npx prisma migrate reset --force --skip-generate`, {
      encoding: 'utf-8',
    })
    this.log('Migrating DB...')
    this.log('============================')
    execSync(`npx prisma migrate dev --name init`, { encoding: 'utf-8' })

    // read from json file
    const text = fs.readFileSync('prisma/json-schema/json-schema.json', 'utf8')
    const jsonFile = JSON.parse(text)
    const models = Object.keys(jsonFile.definitions)

    // iterate models, for each models.properties, insert data
    const results = []
    for (const model of models) {
      this.log('Seeding model ' + model + '...')
      this.log('============================')
      const propertiesObj = jsonFile.definitions[model].properties
      const propertiesArr = Object.keys(propertiesObj)

      const fakeDatas: any = []
      for (let index = 0; index < 1; index++) {
        const fake: any = Object.assign(
          {},
          ...propertiesArr
            .filter(
              (key) =>
                key !== 'id' &&
                key !== 'createdAt' &&
                key !== 'updatedAt' &&
                (propertiesObj[key].type === 'integer' ||
                  propertiesObj[key].type === 'string' ||
                  propertiesObj[key].type === 'boolean')
            )
            .map((key) => ({
              [key]:
                propertiesObj[key].type === 'integer'
                  ? 1
                  : propertiesObj[key].type === 'boolean'
                  ? true
                  : propertiesObj[key].enum
                  ? propertiesObj[key].enum[0]
                  : propertiesObj[key].format === 'date-time'
                  ? '2022-01-20T12:01:30.543Z'
                  : `random string ${index}`,
            }))
        )

        fakeDatas.push(fake)
      }

      const key = model[0].toLowerCase() + model.slice(1)
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
