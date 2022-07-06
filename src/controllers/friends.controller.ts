import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { FriendsServise } from '../service/friends.service';
import { SocketController } from './socket.controller';
import 'reflect-metadata';
import { UserService } from '../service/user.service';

@injectable()
export class FriendsController extends BaseController {
	constructor(
		@inject(TYPES.FriendsServise) protected friendsServise: FriendsServise,
		@inject(TYPES.SocketController) protected socketController: SocketController,
		@inject(TYPES.UserService) protected userService: UserService,
	) {
		super();
		this.bindRouters([
			{
				path: '/:id',
				methot: 'post',
				func: this.addFriends,
				middlewares: [],
			},
			{
				path: '/getFriends',
				methot: 'get',
				func: this.getFriendsById,
				middlewares: [],
			},
			{
				path: '/remove/:id',
				methot: 'delete',
				func: this.removeFriend,
				middlewares: [],
			},
		]);
	}

	async addFriends(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		const myId = req.user._id;
		try {
			const result = await this.friendsServise.addNewFriends(id, myId);
			if (result) {
				this.socketController.broadenFrendsChat(result);
				return this.ok(res, result);
			} else {
				this.send(res, 400, 'Friend was not created!');
			}
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Error in FrendsService!');
		}
	}

	async getFriendsById(req: Request, res: Response, next: NextFunction) {
		const myId = req.user._id;
		try {
			const result = await this.friendsServise.getFriends(myId);
			const currentUser = await this.userService.getUser(myId);
			if (result && currentUser) {
				this.socketController.getAllFrindesChats(result, currentUser.name);
				//this.socketController.joinMessage(currentUser.name);
			}
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Friend was not get!');
		}
	}

	async removeFriend(req: Request, res: Response, next: NextFunction) {
		const friendsId = req.params.id;
		const myId = req.user._id;
		try {
			const result = await this.friendsServise.deleteFriend(friendsId, myId);
			if (result) {
				return this.ok(res, result);
			}
			this.send(res, 400, 'Not found infrendly list!');
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Friend was not delete!');
		}
	}
}
