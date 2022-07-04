import { injectable } from 'inversify';
import 'reflect-metadata';
import { FriendsModel } from '../model/friends.model';
import { IFriend } from '../dto/friends.dto';
import { MessageModel } from '../model/message.model';

@injectable()
export class FriendsServise {
	async addNewFriends(userId: string, _id: string): Promise<IFriend | null> {
		const newMessage = await new MessageModel({
			text: 'Hi!',
			user: _id,
			attachments: '',
		}).save();

		const newFriends = await new FriendsModel({
			friends: [_id, userId],
			messages: [newMessage._id],
		}).save();

		await MessageModel.findByIdAndUpdate(newMessage._id, {
			friendBy: newFriends._id,
		});

		return newFriends;
	}

	async getFriends(id: string): Promise<IFriend[] | null> {
		const result = await FriendsModel.find({
			friends: { $in: [id] },
		}).populate({ path: 'messages' });
		return result;
	}

	async deleteFriend(friendId: string, myId: string): Promise<IFriend | null> {
		const modelFriends = await FriendsModel.findOne({
			friends: { $all: [friendId, myId] },
		});
		if (modelFriends) {
			const result = await FriendsModel.findByIdAndDelete(modelFriends?._id);
			await MessageModel.deleteMany({ friendBy: friendId });
			return result;
		} else {
			return null;
		}
	}
}
