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

@injectable()
export class SocketController {
	app: Express;
	httpServer: http.Server;
	io: socket.Server;
	constructor() {
		this.app = express();
		this.httpServer = createServer(this.app);
		this.io = new Server(this.httpServer);
	}

	getServer() {
		return this.httpServer;
	}

	getIO() {
		console.log('io>>>>', this.io);
	}
}
