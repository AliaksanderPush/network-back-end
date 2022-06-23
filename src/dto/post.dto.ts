import { IComment } from './comment.dto';
import { IMedia } from './media.dto';
import { IUsers } from './user.dto';

export interface IPost extends Document {
	title: string;
	slug: string;
	content: Object;
	featuredImage?: IMedia;
	published?: boolean;
	postedBy: IUsers;
	likes: IUsers[];
	views: number;
	comments: IComment[];
	timestamps: Date;
}
