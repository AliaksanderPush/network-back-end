import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { PostController } from './controllers/post.controller';
import 'reflect-metadata';
import { TYPES } from './types';
import { AuthMiddleWare } from './middleWares/auth.middleware';
import { CommitsController } from './controllers/commits.controller';
import { FriendsController } from './controllers/friends.controller';
import { createServer } from 'http';
import socket from 'socket.io';
import cors from 'cors';
import { MessagesController } from './controllers/messages.controller';
import { LastSeenUpdate } from './middleWares/lastSeen.middleware';

@injectable()
export class App {
	app: Express;
	port: number | string;
	server: Server;
	http: Server;
	io: socket.Server;
	constructor(
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.AuthController) private authController: AuthController,
		@inject(TYPES.PostController) private postController: PostController,
		@inject(TYPES.CommitsController) private commitsController: CommitsController,
		@inject(TYPES.FriendsController) private friendsController: FriendsController,
		@inject(TYPES.MessagesController) private messagesController: MessagesController,
	) {
		this.app = express();
		this.port = process.env.PORT || 4000;
		this.http = createServer(this.app);
		this.io = require('socket.io')(this.http, {
			path: '/socket.io',
			cors: {
				origin: [`192.168.1.150:${this.port}`],
				methods: ['GET', 'POST'],
				allowedHeaders: ['content-type'],
			},
		});
	}

	useMidleWare() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.static(`${__dirname}\\assets`));
		const authMiddleWare = new AuthMiddleWare();
		this.app.use(authMiddleWare.execute.bind(authMiddleWare));
		const lastSeeenMiddleware = new LastSeenUpdate();
		this.app.use(lastSeeenMiddleware.execute.bind(lastSeeenMiddleware));
		this.app.use(cors());
	}

	useRouters() {
		this.app.use('/commit', this.commitsController.router);
		this.app.use('/auth', this.authController.router);
		this.app.use('/posts', this.postController.router);
		this.app.use('/friend', this.friendsController.router);
		this.app.use('/message', this.messagesController.router);
		this.app.use('/', this.userController.router);
	}

	public async init(): Promise<void> {
		this.useMidleWare();
		this.useRouters();
		this.server = this.app.listen(4000, '192.168.1.150', () => {
			console.log(`🚀 Server ready at 192.168.1.150:${this.port}`);
		});
	}
}
