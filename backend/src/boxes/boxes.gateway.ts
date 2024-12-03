import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { __userColors__ } from 'src/lib/constants';

interface User {
  id: string;
  socketId: string;
  colorId: string;
  pos: UserPosition;
}

interface UserPosition {
  x: number;
  y: number;
}

@WebSocketGateway({
  cors: true,
})
export class BoxesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('socket-logger');
  private readonly users: Map<string, User> = new Map();

  // private readonly userPositions: Map<string, UserPosition> = new Map();

  @WebSocketServer()
  server: Server; // Socket.IO server instance

  handleConnection(client: Socket) {
    // Log the connection
    this.logger.log(`Client connected: ${client.id}`);

    const userId = `user_${Math.random().toString(36).substring(2, 10)}`;
    const userColor =
      __userColors__[Math.floor(Math.random() * __userColors__.length)];
    const newUser = {
      id: userId,
      socketId: client.id,
      colorId: userColor,
      pos: { x: 0, y: 0 },
    };

    // Initialize user at the origin of the world
    this.users.set(client.id, newUser);

    // Send the user ID back to the client
    client.emit('intializeUser', newUser);

    console.log(`We are sending these users: `, this.users);
    // Let everyone know theres been an update in the user list
    this.server.emit('updateUsersPresence', Array.from(this.users.entries()));
    this.server.emit('updateUsersPosition', [[client.id, newUser]]);
  }

  handleDisconnect(client: Socket) {
    if (this.users.get(client.id)) {
      this.logger.log(
        `Client disconnected: ${client.id}, ID: ${this.users.get(client.id).id}`,
      );
      this.users.delete(client.id);
      this.server.emit('updateUsersPresence', Array.from(this.users.entries()));
    }
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: string): void {
    this.logger.log(`Got a message from the client: ${JSON.stringify(data)}`);

    this.server.emit('newMessage', data);
  }

  @SubscribeMessage('updateUserPos')
  handleUserPosUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { x: number; y: number },
  ): void {
    // TODO - batch updates?
    console.log(`${client.id} is moving!`);

    if (this.users.get(client.id)) {
      this.users.set(client.id, {
        ...this.users.get(client.id),
        pos: { ...data },
      });
    }

    this.server.emit('updateUsersPosition', Array.from(this.users.entries()));
  }
}
