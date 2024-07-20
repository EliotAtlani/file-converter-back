import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConvertorModule } from './convertor/convertor.module';

@Module({
  imports: [ConvertorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
