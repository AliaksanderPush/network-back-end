import { injectable } from 'inversify';
import { UserModel } from '../model/user.model';
import { PostModel } from '../model/posts.model';
import 'reflect-metadata';
import { IPost } from '../dto/post.dto';
import { CommentModel } from '../model/comment.model';
import { IComment } from '../dto/comment.dto';

@injectable()
export class CommitsServise {
	async createNewCommit(body: string, postId: string, _id: string): Promise<IComment> {
		let created = await new CommentModel({
			content: body,
			postId,
			postedBy: _id,
		}).save();
		created = await created.populate('postedBy', '_id name');
		return created;
	}

	async updateCommit(content: string, commentId: string): Promise<IComment | null> {
		const updated = await CommentModel.findByIdAndUpdate(commentId, { content }, { new: true });
		return updated;
	}

	async removeCommit(commentId: string) {
		return await CommentModel.findByIdAndDelete(commentId);
	}

	async getAllCommits(): Promise<IComment[]> {
		try {
			return await CommentModel.find();
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async countCommits(): Promise<number> {
		return await CommentModel.countDocuments();
	}
}
