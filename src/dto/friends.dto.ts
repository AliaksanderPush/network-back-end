import { IMessage } from './message.dto';
import { IUsers } from './user.dto';

export interface IFriend extends Document {
	_id: string;
	friendId: string[];
	messages: IMessage[];
}
