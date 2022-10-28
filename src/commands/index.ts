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

    // generate json file
    execSync(`npx prisma generate --schema=${flags.schema}`, {
      encoding: 'utf-8',
    }) // the default is 'buffer'

    // read from json file
    const text = fs.readFileSync('json-schema/json-schema.json', 'utf8')
    const jsonFile = JSON.parse(text)
    const models = Object.keys(jsonFile.definitions)

    // update env DB
    execSync('cp ./.env.example ./.env', { encoding: 'utf-8' })
    updateEnv('./.env', 'DATABASE_URL', flags['database-url'])

    // migrate DB
    execSync('rm -rf migrations', { encoding: 'utf-8' })
    execSync(`npx prisma migrate reset --force --schema=${flags.schema}`, {
      encoding: 'utf-8',
    })
    const exec = execSync(
      `npx prisma migrate dev --name init --schema=${flags.schema}`,
      {
        encoding: 'utf-8',
      }
    )
    console.log(exec)

    // // iterate models, for each key.properties, insert data
    // const results = []
    // for (const model of models) {
    //   console.log('========')
    //   console.log('Model:', model)
    //   console.log('========')
    //   const propertiesObj = jsonFile.definitions[model].properties
    //   const propertiesArr = Object.keys(propertiesObj)

    //   const fakeDatas: any = []

    //   for (let index = 0; index < 3; index++) {
    //     const fake: any = Object.assign(
    //       {},
    //       ...propertiesArr.map((key) => ({
    //         [key]:
    //           propertiesObj[key].type === 'integer'
    //             ? Math.random().toString()
    //             : 'lalala',
    //       }))
    //     )

    //     fakeDatas.push(fake)
    //   }

    //   results.push(
    //     // eslint-disable-next-line dot-notation
    //     prisma['user'].createMany({
    //       data: fakeDatas,
    //     })
    //   )
    // }

    // await Promise.all(results)

    await prisma.$disconnect()
    this.log('============================')
    this.log('Finish seeding.')
  }
}
