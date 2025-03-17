import { Controller, Get, MessageEvent, Post, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SseService } from './sse.service';

@Controller()
export class AppController {
  constructor(private readonly sseService: SseService) {}

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
    this.sseService.triggerEvent({ hello: 'sse event triggered' });

    return {
      success: true,
      message: 'SSE event triggered successfully',
    };
  }
}
