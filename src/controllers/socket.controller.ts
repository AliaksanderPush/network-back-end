import { injectable } from 'inversify';
import 'reflect-metadata';
import socket, { Socket } from 'socket.io';
import { IFriend } from '../dto/friends.dto';
import EVENTS from '../configs/events';
import { IMessage } from '../dto/message.dto';

@injectable()
export class SocketController {
	io: socket.Server;
	socket: Socket;
	constructor() {
		this.io;
		this.socket;
	}

	getServer(io: socket.Server) {
		this.io = io;
		this.io.on('connection', (socket: Socket) => {
			this.socket = socket;
			console.log('a user Connecterd!!!', socket.id);
			this.socket.on(EVENTS.CLIENT.JOIN_ROOM, (userName) => {
				this.socket.emit(EVENTS.SERVER.JOINED_ROOM, `${userName} is join`);
			});
		});
	}

	createFrendsChat(): any {
		this.socket.on(
			EVENTS.CLIENT.CREATE_CHAT_ROOM,
			(id: string, myId: string): { id: string; myId: string } => {
				console.log('friends>>>>', id, myId);
				return { id, myId };
			},
		);
	}

	broadenFrendsChat(frendsObj: IFriend) {
		this.socket.emit(EVENTS.SERVER.ROOM, frendsObj);
	}

	joinMessage(currName: string) {
		this.socket.emit(EVENTS.SERVER.JOINED_ROOM, currName);
	}

	getAllFrindesChats(frendschats: IFriend[], currName: string) {
		this.io.emit(EVENTS.SERVER.ROOMS, frendschats);
	}

	getAllMessages(allMessages: IMessage[]) {
		this.io.emit(EVENTS.SERVER.ROOM_MESSAGES, allMessages);
	}
	getMessage(message: IMessage) {
		console.log('message>>>', message);
		this.io.emit(EVENTS.SERVER.SEND_MESSAGE, message);
	}
}
