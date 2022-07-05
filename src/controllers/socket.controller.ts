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
		this.socket.join(frendsObj._id);
		this.socket.broadcast.emit(EVENTS.SERVER.ROOMS, frendsObj);
		this.socket.emit(EVENTS.SERVER.ROOM, frendsObj);
	}

	joinMessage(id: string) {
		console.log('my>>>>', id);
		this.io.emit(EVENTS.SERVER.JOINED_ROOM, id);
	}

	getAllFrindesChats(frendschats: IFriend[]) {
		this.socket.emit(EVENTS.SERVER.ROOMS, frendschats);
	}
}
