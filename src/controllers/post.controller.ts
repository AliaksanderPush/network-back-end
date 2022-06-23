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
			{ path: '/view-count/:id', methot: 'put', func: this.view },
			{ path: '/like', methot: 'put', func: this.like },
			{ path: '/unlike', methot: 'put', func: this.unLike },
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

	async like(req: Request, res: Response, next: NextFunction) {
		console.log('prishlo>>', req.params.id);
		try {
			const result = await this.postService.likePost(req.body.id, req.user._id);
			console.log('res>>', result);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}
	async unLike(req: Request, res: Response, next: NextFunction) {
		console.log('prishlo>>', req.params.id);
		try {
			const result = await this.postService.unLikePost(req.body.id, req.user._id);
			console.log('res>>', result);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	async view(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.postService.viewCount(req.params.id);

			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}
}
