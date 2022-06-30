import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { FriendsServise } from '../service/friends.service';
import 'reflect-metadata';

@injectable()
export class FriendsController extends BaseController {
	constructor(@inject(TYPES.FriendsServise) protected friendsServise: FriendsServise) {
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
		const isFriends = await this.friendsServise.seachFriends(id);
		if (isFriends) {
			return this.send(res, 400, 'The friend has been alredy!!');
		}
		try {
			const result = await this.friendsServise.addNewFriends(id, myId);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Friend was not created!');
		}
	}

	async getFriendsById(req: Request, res: Response, next: NextFunction) {
		const myId = req.user._id;
		try {
			const result = await this.friendsServise.getFriends(myId);
			console.log('result>>>', result);
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
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Friend was not delete!');
		}
	}
}
