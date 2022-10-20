import {Command, Flags} from '@oclif/core'

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

    this.log(`The schema path: ${flags.schema} \nand the DB url: ${flags['database-url']}`)
  }
}
