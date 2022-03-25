import { createConnection, DataSource } from 'typeorm'

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: () =>
      createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'ppooii12',
        database: 'contact_keeper',
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true,
      }),
  },
]
