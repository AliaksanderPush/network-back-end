import { IMedia } from './media.dto';
import { IUsers } from './user.dto';

export interface IPost extends Document {
	title: string;
	slug: string;
	content: Object;
	featuredImage?: IMedia;
	published?: boolean;
	postedBy: IUsers;
	timestamps: Date;
}
