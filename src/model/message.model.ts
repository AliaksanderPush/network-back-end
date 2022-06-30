import { model, Schema, Model } from 'mongoose';
import { IMessage } from '../dto/message.dto';

const messageSchema = new Schema(
	{
		text: { type: String, require: true },
		user: { type: Schema.Types.ObjectId, ref: 'UserModel', require: true },
		friendBy: { type: Schema.Types.ObjectId, ref: 'FriendsModel' },
		read: {
			type: Boolean,
			default: false,
		},
		attachments: { type: String },
	},
	{
		timestamps: true,
	},
);

export const MessageModel: Model<IMessage> = model('MessageModel', messageSchema);
