import { model, Schema, Model } from 'mongoose';
import { IFriend } from '../dto/friends.dto';

const friendsSchema = new Schema({
	friendId: {
		type: Schema.Types.ObjectId,
		ref: 'UserModel',
	},
	myId: {
		type: Schema.Types.ObjectId,
		ref: 'UserModel',
	},

	messages: [{ type: Schema.Types.ObjectId, ref: 'MessageModel', require: true }],
});

export const FriendsModel: Model<IFriend> = model('FriendsModel', friendsSchema);
