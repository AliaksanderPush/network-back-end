import { model, Schema, Model } from 'mongoose';
import { IUsersChat } from '../dto/usersChat.dto';

const UsersChatShema: Schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
	message: { type: String },
	updated_at: { type: Date },
	created_at: { type: Date },
});

export const UsersChatModel: Model<IUsersChat> = model('TokenModel', UsersChatShema);
