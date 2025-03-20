import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  private eventCounter = 0;

  @SubscribeMessage('clientMessage')
  handleEvents(@MessageBody() data: unknown): void {
    console.log('Received client message:', data);
  }

  // This method will be called from the controller to emit events to all clients
  sendEventToClient(data: string): void {
    this.eventCounter++;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.server.emit('message', {
      message: data,
      eventCounter: this.eventCounter,
    });
  }
}
