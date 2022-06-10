import { model, Schema, Model } from 'mongoose';
import { IUsers } from '../dto/user.dto';

const UserShema: Schema = new Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	city: { type: String },
	age: { type: Number, required: false },
	email: { type: String, unique: true, required: true },
	gender: { type: String },
	avatar: { type: String, required: false },
	roles: [{ type: String, ref: 'Role' }],
	resetCode: { type: String },
});

export const UserModel: Model<IUsers> = model('UserModel', UserShema);
