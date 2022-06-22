import { injectable } from 'inversify';
import { UserModel } from '../model/user.model';
import { PostModel } from '../model/posts.model';
import slugify from 'slugify';
import 'reflect-metadata';
import { IPost } from '../dto/post.dto';
import fs from 'fs';

@injectable()
export class PostServise {
	async checkTitleByToken(title: string) {
		return await PostModel.findOne({
			slug: slugify(title),
		}).exec();
	}

	async createNewPost(body: IPost, _id: string): Promise<IPost> {
		const { title, content, featuredImage } = body;

		const newPost = await new PostModel({
			title,
			content,
			featuredImage: featuredImage,
			slug: slugify(body.title),
			postedBy: _id,
		}).save();

		await UserModel.findByIdAndUpdate(_id, {
			$addToSet: { posts: newPost._id },
		});
		return newPost.populate({
			path: 'postedBy',
		});
	}

	async updatePost(body: IPost, postId: string): Promise<IPost | null> {
		const { title, content, featuredImage } = body;
		const upPost = await PostModel.findByIdAndUpdate(
			postId,
			{
				title,
				slug: slugify(title),
				content,
				featuredImage,
			},
			{
				new: true,
			},
		).populate({
			path: 'postedBy',
		});

		return upPost;
	}

	async removePost(postId: string, _id: string) {
		const res = await PostModel.findByIdAndDelete(postId);
		await UserModel.findByIdAndUpdate(_id, { $pull: { posts: postId } });
		return res;
	}

	async getAllPost(): Promise<IPost[]> {
		try {
			return await PostModel.find()
				.populate({
					path: 'postedBy',
					//populate: { path: 'posts' },
				})
				.sort({ createdAt: +1 });
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async removeOldImage(postId: string) {
		const oldPath = await PostModel.findById(postId);
		if (oldPath?.featuredImage) {
			const fullPath = `${__dirname}/../../build/assets/${oldPath?.featuredImage}`;
			fs.unlinkSync(fullPath);
			return oldPath;
		}

		return;
	}
}
