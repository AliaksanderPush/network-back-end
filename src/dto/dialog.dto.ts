import { Document } from 'mongoose';
import { IMessage } from './message.dto';
import { IUsers } from './user.dto';

export interface IDialog extends Document {
	partner: IUsers | string;
	author: IUsers | string;
	messages: IMessage[];
	lastMessage: IMessage | string;
}
