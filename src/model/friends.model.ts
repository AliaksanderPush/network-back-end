import { model, Schema, Model } from 'mongoose';
import { IFriend } from '../dto/friends.dto';

const friendsSchema = new Schema({
	userName: {
		type: String,
		trim: true,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'UserModel',
	},
});

export const FriendsModel: Model<IFriend> = model('FriendsModel', friendsSchema);
