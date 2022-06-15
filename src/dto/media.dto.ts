import { IUsers } from './user.dto';

export interface IMedia extends Document {
	url: string;
	public_id: string;
	postedBy: IUsers;
	timestamps: Date;
}
