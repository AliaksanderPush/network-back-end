import { injectable } from 'inversify';
import { UserModel } from '../model/user.model';
import 'reflect-metadata';
import { FriendsModel } from '../model/friends.model';
import { IUsers } from '../dto/user.dto';
import { IFriend } from '../dto/friends.dto';
import { MessageModel } from '../model/message.model';
import { IMessage } from '../dto/message.dto';

@injectable()
export class MessagesServise {
	async getmessageAll(id: string): Promise<IMessage[] | null> {
		return await MessageModel.find({ friendBy: id })
			.populate({ path: 'user' })
			.sort({ createdAt: -1 });
	}

	async addNewMessage(
		userId: string,
		friendRoomId: string,
		content: string,
		image: string,
	): Promise<IMessage> {
		const newMessage = await new MessageModel({
			text: content,
			user: userId,
			attachments: image,
			friendBy: friendRoomId,
		}).save();

		await FriendsModel.findByIdAndUpdate(friendRoomId, {
			$addToSet: { messages: newMessage._id },
		});

		return newMessage;
	}

	async deleteMessage(id: string, friendRoomId: string): Promise<IMessage | null> {
		const message = await MessageModel.findByIdAndDelete(id);
		await FriendsModel.findByIdAndUpdate(friendRoomId, { $pull: { messages: id } });
		return message;
	}

	async updateMessage(id: string, content: string): Promise<IMessage | null> {
		const upMessage = await MessageModel.findByIdAndUpdate(
			id,
			{
				text: content,
			},
			{
				new: true,
			},
		).populate({
			path: 'user',
		});

		return upMessage;
	}
}
