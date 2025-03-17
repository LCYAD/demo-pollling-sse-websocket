import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SseService } from './sse.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SseService],
})
export class AppModule {}
