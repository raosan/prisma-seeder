import { Command, Flags } from '@oclif/core'
import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import { updateEnv } from '../scripts/env-edit'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()
const results: any[] = []

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

    // iterate models, for each models.properties, insert to results array
    const generatedUUID = uuidv4()
    for (const model of models) {
      const propertiesObj = jsonFile.definitions[model].properties
      const propertiesArr = Object.keys(propertiesObj)

      const fakeData = Object.assign(
        {},
        ...propertiesArr
          .filter(
            (key) =>
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
                : generatedUUID,
          }))
      )

      results.push({
        ...fakeData,
        $model: model,
      })
    }

    // iterate insert data
    let i = 0
    while (results.findIndex((val) => val !== null) !== -1) {
      const item = results[i]
      if (item) {
        // eslint-disable-next-line no-await-in-loop
        await insertData(i, item)
      }

      i += 1
    }

    await prisma.$disconnect()
    this.log('============================')
    this.log('Finish seeding.')
  }
}

async function insertData(index: number, data: any) {
  const { $model, ...cleanData } = data

  try {
    console.log('Seeding model ' + $model + '...')
    const key = $model[0].toLowerCase() + $model.slice(1)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await prisma[key].create({ data: cleanData })
    results[index] = null
  } catch (error: any) {
    if (error.code === 'P2003') {
      console.log(
        'Failed seeding model ' +
          $model +
          ' due to [FKey Constarint]. Will be retried'
      )
      results.push(data)
      results[index] = null
    } else {
      console.log(error)
    }
  }
}
