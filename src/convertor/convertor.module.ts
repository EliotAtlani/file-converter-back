import { Module } from '@nestjs/common';
import { ConvertorController } from './convertor.controller';
import { ConvertorService } from './convertor.service';

@Module({
  providers: [ConvertorService],
  controllers: [ConvertorController],
})
export class ConvertorModule {}
