import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { CommitsServise } from '../service/commits.service';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export class CommitsController extends BaseController {
	constructor(@inject(TYPES.CommitsServise) protected commitsServise: CommitsServise) {
		super();
		this.bindRouters([
			{ path: '/:id', methot: 'post', func: this.createCommit },
			{ path: '/delete/:id', methot: 'delete', func: this.deleteCommit },
			{ path: '/commits', methot: 'get', func: this.getAllCommits },
		]);
	}

	async createCommit(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { content } = req.body;
			const created = await this.commitsServise.createNewCommit(content, id, req.user._id);
			this.ok(res, created);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Commit was not created!');
		}
	}

	async deleteCommit(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const result = await this.commitsServise.removeCommit(id, req.body.postId);
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Commit was not deleted!');
		}
	}

	async getAllCommits(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.commitsServise.getAllCommits();
			return this.ok(res, result);
		} catch (err) {
			console.log(err);
			this.send(res, 400, 'Commits were not got!');
		}
	}
}
