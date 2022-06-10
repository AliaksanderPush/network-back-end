import { Document } from 'mongoose';
import { IUsers } from './user.dto';

export interface IUsersChat extends Document {
	user: IUsers;
	messages: string[];
}
