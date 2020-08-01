import { WebSocketGateway, SubscribeMessage, MessageBody, WsResponse, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('EventsGateway');

    private userCount = 0;

    @WebSocketServer()
    wss: Server;

    afterInit(server: Server) {
        this.logger.log('EventsGateway Initialized');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.userCount = this.userCount - 1;
        this.wss.emit('users', this.userCount);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        this.userCount = this.userCount + 1;
        this.wss.emit('users', this.userCount);
    }

    @SubscribeMessage('chat-message')
    handleChatMessage(@MessageBody() data: { name: string, message: string }) {
        const { name, message } = data;
        const event = 'chat-message';
        const text = `${name} said ${message} at ${new Date().toISOString()}`;
        this.wss.emit(event, text);
        // return { 
        //     event, 
        //     data: text
        // };
    }
}