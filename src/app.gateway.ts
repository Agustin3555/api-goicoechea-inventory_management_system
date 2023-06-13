/* eslint-disable prettier/prettier */
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SECTIONS } from './tools';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AppGateway {
  @WebSocketServer() server: Server;

  sendUpdatedSection(section: SECTIONS) {
    this.server.emit('updatedSection', section);
  }
}
