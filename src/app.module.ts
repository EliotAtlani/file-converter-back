import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConvertorModule } from './convertor/convertor.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConvertorModule,
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
