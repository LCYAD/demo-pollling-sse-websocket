import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SseService } from './sse.service';
import { LongPollService } from './longPoll.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SseService, LongPollService, WebsocketGateway],
})
export class AppModule {}
