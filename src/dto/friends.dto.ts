import { IMessage } from './message.dto';
import { IUsers } from './user.dto';

export interface IFriend extends Document {
	friendId: IUsers;
	myId: IUsers;
	messages: IMessage;
}
