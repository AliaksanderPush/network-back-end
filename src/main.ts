import express, { Express } from 'express';
import { Server } from 'socket.io';
import socket from 'socket.io';
import { inject, injectable } from 'inversify';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { PostController } from './controllers/post.controller';
import 'reflect-metadata';
import { TYPES } from './types';
import { AuthMiddleWare } from './middleWares/auth.middleware';
import { CommitsController } from './controllers/commits.controller';
import { FriendsController } from './controllers/friends.controller';
import cors from 'cors';
import { MessagesController } from './controllers/messages.controller';
import { LastSeenUpdate } from './middleWares/lastSeen.middleware';
import { createServer } from 'http';
import http from 'http';
import { SocketController } from './controllers/socket.controller';

@injectable()
export class App {
	app: Express;
	port: number | string;
	httpServer: http.Server;
	io: socket.Server;

	constructor(
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.AuthController) private authController: AuthController,
		@inject(TYPES.PostController) private postController: PostController,
		@inject(TYPES.CommitsController) private commitsController: CommitsController,
		@inject(TYPES.FriendsController) private friendsController: FriendsController,
		@inject(TYPES.MessagesController) private messagesController: MessagesController,
		@inject(TYPES.SocketController) private socketController: SocketController,
	) {
		this.app = express();
		this.port = process.env.PORT || 4000;
		this.httpServer = createServer(this.app);
		this.io = new Server(this.httpServer);
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
		this.socketController.getServer(this.io);
		this.httpServer.listen(4000, '192.168.0.101', () => {
			console.log(`🚀 Server ready at 192.168.0.101:${this.port}`);
		});
	}
}
