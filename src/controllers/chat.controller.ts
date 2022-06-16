import { ChatServise } from '../service/chat.service';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export class ChatController extends BaseController {
	constructor(@inject(TYPES.ChatServise) protected chatService: ChatServise) {
		super();
		this.bindRouters([
			{ path: '/message', methot: 'post', func: this.createPost },
			{ path: '/update/:id', methot: 'put', func: this.editPost },
			{ path: '/delete/:id', methot: 'delete', func: this.deletePost },
			{ path: '/posts', methot: 'get', func: this.getAllPosts },
		]);
	}

	async createPost(req: Request, res: Response, next: NextFunction) {
		try {
			const { title } = req.body;
			const alreadyExist = await this.chatService.checkTitleByToken(title);

			if (alreadyExist) {
				return this.send(res, 400, 'Title is taken');
			}

			const result = await this.chatService.createNewPost(req.body, req.user._id);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Post is not created!');
		}
	}

	async editPost(req: Request, res: Response, next: NextFunction) {
		try {
			const postId = req.params.id;

			const result = await this.chatService.updatePost(req.body, postId);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	async deletePost(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await this.chatService.removePost(id, req.user._id);
			return res.json({ ok: true });
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	async getAllPosts(req: Request, res: Response, next: NextFunction) {
		const result = await this.chatService.getAllPost();
		res.json(result);
	}
}
