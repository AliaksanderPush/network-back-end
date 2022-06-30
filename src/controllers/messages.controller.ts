import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { FriendsServise } from '../service/friends.service';
import 'reflect-metadata';
import { MessagesServise } from '../service/messages.service';

@injectable()
export class MessagesController extends BaseController {
	constructor(@inject(TYPES.MessagesServise) protected messagesServise: MessagesServise) {
		super();
		this.bindRouters([
			{
				path: '/addMessage/:id',
				methot: 'post',
				func: this.addMessage,
				middlewares: [],
			},
			{
				path: '/getMessages/:id',
				methot: 'get',
				func: this.getMessages,
				middlewares: [],
			},
			{
				path: '/remove/:id',
				methot: 'delete',
				func: this.removeMessage,
				middlewares: [],
			},
			{
				path: '/update/:id',
				methot: 'put',
				func: this.updateMessage,
				middlewares: [],
			},
		]);
	}

	async getMessages(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		try {
			const result = await this.messagesServise.getmessageAll(id);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			return this.send(res, 400, 'Messages  not found!');
		}
	}

	async addMessage(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		const userId = req.user._id;
		const { content } = req.body;
		try {
			const result = await this.messagesServise.addNewMessage(userId, id, content);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Message was not created!');
		}
	}

	async updateMessage(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		const { content } = req.body;
		try {
			const result = await this.messagesServise.updateMessage(id, content);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Message was not created!');
		}
	}

	async removeMessage(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		const { friendRoomId } = req.body;
		try {
			const result = await this.messagesServise.deleteMessage(id, friendRoomId);
			console.log('result>>>', result);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Message was not deleted!');
		}
	}
}
