import { model, Schema, Model } from 'mongoose';
import { IPost } from '../dto/post.dto';

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
		},
		content: {},
		featuredImage: { type: Schema.Types.ObjectId, ref: 'MediaModel' },
		published: {
			type: Boolean,
			default: true,
		},
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: 'UserModel',
		},
		likes: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
		comments: [{ type: Schema.Types.ObjectId, ref: 'CommentModel' }],
	},
	{ timestamps: true },
);

export const PostModel: Model<IPost> = model('PostModel', postSchema);
