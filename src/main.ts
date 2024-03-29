import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { ChatController } from './controllers/chat.controller';
import 'reflect-metadata';
import { TYPES } from './types';
import { AuthMiddleWare } from './middleWares/auth.middleware';
import { CommitsController } from './controllers/commits.controller';
import cors from 'cors';

@injectable()
export class App {
	app: Express;
	port: number | string;
	server: Server;
	constructor(
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.AuthController) private authController: AuthController,
		@inject(TYPES.ChatController) private chatController: ChatController,
		@inject(TYPES.CommitsController) private commitsController: CommitsController,
	) {
		this.app = express();
		this.port = process.env.PORT || 4000;
	}

	useMidleWare() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.static(`${__dirname}\\assets`));
		const authMiddleWare = new AuthMiddleWare();
		this.app.use(authMiddleWare.execute.bind(authMiddleWare));
		this.app.use(cors());
	}

	useRouters() {
		this.app.use('/commit', this.commitsController.router);
		this.app.use('/auth', this.authController.router);
		this.app.use('/chat', this.chatController.router);
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
