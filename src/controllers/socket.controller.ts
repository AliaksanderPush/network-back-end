import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { CommitsServise } from '../service/commits.service';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import socket, { Socket } from 'socket.io';
import express, { Express } from 'express';
import { Server } from 'socket.io';
import http, { createServer } from 'http';
import { IFriend } from '../dto/friends.dto';
import EVENTS from '../configs/events';

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
		console.log('addFriend>>>', frendsObj);
		this.socket.emit(EVENTS.SERVER.ROOM, frendsObj);
	}

	joinMessage(currName: string) {
		console.log('popali v join');
		this.socket.emit(EVENTS.SERVER.JOINED_ROOM, currName);
	}

	getAllFrindesChats(frendschats: IFriend[], currName: string) {
		console.log('popali v chats');
		this.io.emit(EVENTS.SERVER.ROOMS, frendschats);
	}
}
