import { model, Schema, Model } from 'mongoose';
import { IComment } from '../dto/comment.dto';

const commentSchema = new Schema(
	{
		content: {
			type: String,
			trim: true,
			required: true,
			max: 20000,
		},
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: 'UserModel',
		},
		postId: {
			type: Schema.Types.ObjectId,
			ref: 'PostModel',
		},
	},
	{ timestamps: true },
);

export const CommentModel: Model<IComment> = model('CommentModel', commentSchema);
