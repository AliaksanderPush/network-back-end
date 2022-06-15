import { IUsers } from './user.dto';

export interface IFriend extends Document {
	userName: string;
	userId: IUsers;
}
