import { injectable } from 'inversify';
import { UserModel } from '../model/user.model';
import 'reflect-metadata';
import { FriendsModel } from '../model/friends.model';
import { IUsers } from '../dto/user.dto';
import { IFriend } from '../dto/friends.dto';
import { MessageModel } from '../model/message.model';

@injectable()
export class FriendsServise {
	async addNewFriends(userId: string, _id: string): Promise<IUsers | null> {
		const newMessage = await new MessageModel({
			text: 'Hi!',
			user: _id,
			attachments: '',
		}).save();

		const newFriends = await new FriendsModel({
			friendId: userId,
			myId: _id,
			messages: [newMessage._id],
		}).save();

		await MessageModel.findByIdAndUpdate(newMessage._id, {
			friendBy: newFriends._id,
		});

		const isMe = await UserModel.findByIdAndUpdate(
			_id,
			{
				$addToSet: { contacts: newFriends._id },
			},
			{ new: true },
		);
		await UserModel.findByIdAndUpdate(userId, {
			$addToSet: { contacts: newFriends._id },
		});

		return isMe;
	}

	async getFriends(id: string): Promise<IUsers | null> {
		const result = await UserModel.findById(id).populate({
			path: 'contacts',
			populate: { path: 'userId' },
		});

		return result;
	}

	async deleteFriend(friendId: string, myId: string): Promise<IUsers | null> {
		const res = await FriendsModel.findByIdAndDelete(friendId);
		await UserModel.findByIdAndUpdate(res?.friendId, {
			$pull: { contacts: friendId },
		});
		const user = await UserModel.findByIdAndUpdate(
			myId,
			{ $pull: { contacts: friendId } },
			{ new: true },
		);
		await MessageModel.deleteMany({ friendBy: friendId });
		return user;
	}

	async seachFriends(userId: string): Promise<IFriend | null> {
		return FriendsModel.findOne({ user: userId });
	}
}
