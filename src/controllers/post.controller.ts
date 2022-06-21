import { PostServise } from '../service/post.service';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export class PostController extends BaseController {
	constructor(@inject(TYPES.PostServise) protected postService: PostServise) {
		super();
		this.bindRouters([
			{ path: '/message', methot: 'post', func: this.createPost },
			{ path: '/update/:id', methot: 'put', func: this.editPost },
			{ path: '/delete/:id', methot: 'delete', func: this.deletePost },
			{ path: '/all', methot: 'get', func: this.getAllPosts },
		]);
	}

	async createPost(req: Request, res: Response, next: NextFunction) {
		try {
			const { title } = req.body;
			const alreadyExist = await this.postService.checkTitleByToken(title);

			if (alreadyExist) {
				return this.send(res, 400, 'Title is taken');
			}

			const result = await this.postService.createNewPost(req.body, req.user._id);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Post is not created!');
		}
	}

	async editPost(req: Request, res: Response, next: NextFunction) {
		try {
			const postId = req.params.id;
			const { imgFormData } = req.body;
			if (imgFormData) {
				await this.postService.removeOldImage(postId);
			}
			const result = await this.postService.updatePost(req.body, postId);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	async deletePost(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const result = await this.postService.removePost(id, req.user._id);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	async getAllPosts(req: Request, res: Response, next: NextFunction) {
		const result = await this.postService.getAllPost();
		res.json(result);
	}
}
