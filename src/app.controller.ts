import {
  Controller,
  Get,
  MessageEvent,
  Post,
  Query,
  Res,
  Sse,
} from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { LongPollService } from './longPoll.service';
import { WebsocketGateway } from './websocket.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly sseService: SseService,
    private readonly longPollService: LongPollService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.sseService.getEventStream();
  }

  @Post('sse/trigger')
  triggerSseEvent(): { success: boolean; message: string } {
    this.sseService.triggerEvent({ message: 'sse event triggered' });

    return {
      success: true,
      message: 'SSE event triggered successfully',
    };
  }

  @Get('poll')
  async longPoll(
    @Res() response: Response,
    @Query('lastEventId') lastEventId?: string,
  ): Promise<void> {
    const clientLastEventId = lastEventId ? parseInt(lastEventId, 10) : 0;

    // Use the long poll service to wait for events
    // This will keep the connection open until an event is fired or timeout occurs
    const result = await this.longPollService.waitForEvents(clientLastEventId);

    response.json(result);
  }

  @Post('poll/trigger')
  triggerPollEvent(): { success: boolean; message: string } {
    // Use the long poll service to trigger an event
    this.longPollService.triggerEvent({
      message: 'long poll event triggered',
    });

    return {
      success: true,
      message: 'Long poll event triggered successfully',
    };
  }

  @Post('websocket/trigger')
  triggerWebsocketEvent(): { success: boolean; message: string } {
    this.websocketGateway.sendEventToClient('websocket event triggered');

    return {
      success: true,
      message: 'WebSocket event triggered successfully',
    };
  }
}
