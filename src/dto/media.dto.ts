import { IUsers } from './user.dto';

export interface IMedia extends Document {
	url: string;
	postedBy: IUsers;
	timestamps: Date;
}
