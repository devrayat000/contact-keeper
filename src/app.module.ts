import { Module } from '@nestjs/common'
import AdminJS from 'adminjs'
import { AdminModule } from '@adminjs/nestjs'
import { Database, Resource } from '@adminjs/typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import '@adminjs/express'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import Admin from './admin/admin.entity'

AdminJS.registerAdapter({ Database, Resource })

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ppooii12',
      database: 'contact_keeper',
      entities: [Admin],
      synchronize: true,
    }),
    AdminModule.createAdmin({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [Admin],
      },
      auth: {
        authenticate: async (email, password) => {
          return Admin.findOneBy({ email })
        },
        cookieName: 'test',
        cookiePassword: 'testPass',
      },
      sessionOptions: {
        secret: 'session_secret',
        resave: true,
        saveUninitialized: true,
      },
      shouldBeInitialized: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
