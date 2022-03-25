import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Admin from 'src/admin/admin.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
