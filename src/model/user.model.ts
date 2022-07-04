import { model, Schema, Model } from 'mongoose';
import { IUsers } from '../dto/user.dto';

const UserShema: Schema = new Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	city: { type: String },
	age: { type: Number, required: false },
	email: { type: String, unique: true, required: true },
	gender: { type: String },
	avatar: { type: String, default: '' },
	roles: [{ type: String, ref: 'Role' }],
	resetCode: { type: String },
	posts: [{ type: Schema.Types.ObjectId, ref: 'PostModel' }],
	last_seen: { type: Date, default: new Date() },
	created_at: { type: Date, default: Date.now },
});

export const UserModel: Model<IUsers> = model('UserModel', UserShema);
