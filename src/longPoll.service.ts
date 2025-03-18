import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

interface PollEvent {
  id: number;
  data: Record<string, unknown>;
}

@Injectable()
export class LongPollService {
  private lastEventId: number = 0;
  private eventSubject = new Subject<PollEvent>();

  async waitForEvents(
    clientLastEventId: number,
    timeout: number = 30000,
  ): Promise<{ event: PollEvent | null; lastEventId: number }> {
    // Wait for a new event or timeout
    return new Promise((resolve) => {
      const startTime = Date.now();

      // Create a subscription to listen for new events
      const subscription = this.eventSubject.subscribe((newEvent) => {
        // New event received, unsubscribe and resolve
        subscription.unsubscribe();
        clearInterval(intervalId);

        resolve({
          event: newEvent,
          lastEventId: newEvent.id,
        });
      });

      // Set up interval to check for timeout
      const intervalId = setInterval(() => {
        if (Date.now() - startTime >= timeout) {
          // Timeout reached, unsubscribe and resolve with no event
          subscription.unsubscribe();
          clearInterval(intervalId);

          resolve({
            event: null,
            lastEventId: clientLastEventId,
          });
        }
      }, 1000);
    });
  }

  triggerEvent(data: PollEvent['data']): number {
    this.lastEventId++;
    const event = { id: this.lastEventId, data };
    this.eventSubject.next(event);
    return this.lastEventId;
  }
}
