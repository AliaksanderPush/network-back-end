import { UserService } from './../service/user.service';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { IFriend } from '../dto/friends.dto';
import { TYPES } from '../types';
import multer from 'multer';
import { RoleMidleware } from '../middleWares/roles.midleware';
import { storageConfig } from '../configs/multer.config';
import 'reflect-metadata';
import { UserModel } from '../model/user.model';

@injectable()
export class UserController extends BaseController {
	constructor(@inject(TYPES.UserService) protected userService: UserService) {
		super();
		this.bindRouters([
			{ path: '/user', methot: 'get', func: this.getUsers },

			{
				path: '/user/:id',
				methot: 'put',
				func: this.updateUser,
				middlewares: [new RoleMidleware(['user'])],
			},
			{
				path: '/user/:id',
				methot: 'delete',
				func: this.removeUser,
				middlewares: [new RoleMidleware(['admin'])],
			},
			{ path: '/user/:id', methot: 'get', func: this.refreshUser },

			{
				path: '/upload',
				methot: 'post',
				func: this.fileLoader,
				middlewares: [],
			},

			{
				path: '/refresh',
				methot: 'get',
				func: this.refresh,
				middlewares: [],
			},
			{
				path: '/friends/:id',
				methot: 'post',
				func: this.addFriends,
				middlewares: [],
			},
			{
				path: '/getFriends',
				methot: 'get',
				func: this.getFriendsByName,
				middlewares: [],
			},
		]);
	}

	async getUsers(req: Request, res: Response, next: NextFunction) {
		const result = await this.userService.getAll();
		res.json(result);
	}

	async updateUser(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const data = req.body;
		const response = await this.userService.putUser(id, data);
		if (!response) {
			this.send(res, 400, 'This user is not exist');
			return;
		}
		const { roles, email } = response;
		const tokens = await this.userService.generateAndSaveTokens(id, email, roles as string[]);
		this.ok(res, {
			token: { accesToken: tokens.accesToken, refreshToken: tokens.refreshToken },
			searchUser: response,
		});
		return;
	}

	async removeUser(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		await this.userService.deleteUser(id);
		this.ok(res, 'User was delated');
	}

	async refreshUser(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const user = await this.userService.getUser(id);
		res.status(200).json(user);
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization && req.user) {
			const refreshToken = req.headers.authorization.split(' ')[1];
			const getRefresh = await this.userService.refresh(refreshToken);
			if (!getRefresh) {
				return this.send(res, 401, 'Authorization failed');
			}

			this.ok(res, {
				token: {
					accesToken: getRefresh.accesToken,
					refreshToken: getRefresh.refreshToken,
				},
				searchUser: getRefresh.user,
			});
		} else {
			return this.send(res, 401, 'Authorization failed');
		}
	}

	fileLoader(req: Request, res: Response, next: NextFunction) {
		const token = req.headers.authorization!.split(' ')[1];
		const upload = multer(storageConfig).single('filedata');

		upload(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				console.log(err);
				res.status(400).send('Ошибка Multer при загрузке');
			} else if (err) {
				console.log(err);
				res.status(400).send(' При загрузке произошла неизвестная ошибка.');
			} else {
				console.log('weer>>', req.file?.filename);
				await this.userService.upDateAvatar(token, req.file?.filename as string);
				return this.send(res, 200, req.file?.filename);
			}
		});
	}

	async addFriends(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;

		try {
			const result = await this.userService.addNewFriends(req.body, id, req.user._id);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Friend was not created!');
		}
	}

	async getFriendsByName(req: Request, res: Response, next: NextFunction) {
		console.log('id>>>');
		try {
			const result = await UserModel.findById(req.user._id).populate({ path: 'contacts' });
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Friend was not get!');
		}
	}
}
