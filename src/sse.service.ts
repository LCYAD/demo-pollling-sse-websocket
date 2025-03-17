import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private eventSubject = new Subject<MessageEvent>();

  getEventStream(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
  }

  triggerEvent(data: Record<string, unknown>): void {
    const event: MessageEvent = { data };
    this.eventSubject.next(event);
  }
}
