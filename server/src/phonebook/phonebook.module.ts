import { Module } from '@nestjs/common';
import { PhonebookService } from './phonebook.service';
import { PhonebookController } from './phonebook.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './files'
    })
  ],
  controllers: [PhonebookController],
  providers: [PhonebookService, PrismaService]
})
export class PhonebookModule {}
