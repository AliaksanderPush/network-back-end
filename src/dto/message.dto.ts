import { Document } from 'mongoose';
import { IUsers } from './user.dto';
import { IFriend } from './friends.dto';

export interface IMessage extends Document {
	text: string;
	user: IUsers;
	friendBy: IFriend;
	read: boolean;
	attachments: string;
}
