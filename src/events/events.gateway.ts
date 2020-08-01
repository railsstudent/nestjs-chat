import { WebSocketGateway, SubscribeMessage, MessageBody, WsResponse, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('EventsGateway');

    @WebSocketServer()
    wss: Server;

    afterInit(server: Server) {
        this.logger.log('EventsGateway Initialized');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('chat-message')
    handleChatMessage(@MessageBody() data: { name: string, message: string }) {
        const { name, message } = data;
        const event = 'chat-message';
        const text = `${new Date().toISOString()}: ${name} said ${message}`;
        this.wss.emit(event, text);
        // return { 
        //     event, 
        //     data: text
        // };
    }
}