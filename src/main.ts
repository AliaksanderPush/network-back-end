import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import 'reflect-metadata';
import { TYPES } from './types';
import { AuthMiddleWare } from './middleWares/auth.middleware';
import cors from 'cors';

@injectable()
export class App {
	app: Express;
	port: number | string;
	server: Server;
	constructor(
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.AuthController) private authController: AuthController,
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
		this.app.use('/auth', this.authController.router);
		this.app.use('/', this.userController.router);
	}

	public async init(): Promise<void> {
		this.useMidleWare();
		this.useRouters();
		this.server = this.app.listen(4000, '192.168.0.144', () => {
			console.log(`🚀 Server ready at 192.168.0.144:${this.port}`);
		});
	}
}
