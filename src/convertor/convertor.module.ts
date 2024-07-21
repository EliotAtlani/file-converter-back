import { Module } from '@nestjs/common';
import { ConvertorController } from './convertor.controller';
import { ConvertorService } from './convertor.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  providers: [
    ConvertorService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [ConvertorController],
})
export class ConvertorModule {}
