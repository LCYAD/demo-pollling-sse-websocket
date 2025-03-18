import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SseService } from './sse.service';
import { LongPollService } from './longPoll.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SseService, LongPollService],
})
export class AppModule {}
