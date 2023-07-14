import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PhonebookModule } from './phonebook/phonebook.module';

@Module({
  imports: [AuthModule, PhonebookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
