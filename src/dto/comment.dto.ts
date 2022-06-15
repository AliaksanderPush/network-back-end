import { IPost } from './post.dto';
import { IUsers } from './user.dto';

export interface IComment extends Document {
	content: string;
	postedBy: IUsers;
	postId: IPost;
	timestamps: Date;
}
