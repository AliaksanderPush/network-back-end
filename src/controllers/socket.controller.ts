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
	constructor() {
		this.io;
	}

	getServer(io: socket.Server) {
		this.io = io;
		this.io.on('connection', (socket: Socket) => {
			console.log('a user Connecterd!!!', socket.id);
		});
	}

	createFrendsChat() {
		this.io.on(EVENTS.CLIENT.CREATE_CHAT_ROOM, (id: string, myId: string) => {
			console.log('friends>>>>', id, myId);
			return { id, myId };
		});
	}

	broadenFrendsChat(frendsObj: IFriend) {
		this.io.emit(EVENTS.SERVER.ROOMS, frendsObj);
	}
}
