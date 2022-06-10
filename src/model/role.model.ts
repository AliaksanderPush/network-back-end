import { model, Schema, Model } from 'mongoose';
import { IRole } from '../dto/role.dto';

const RoleShema: Schema = new Schema({
	value: { type: String, unique: true, default: 'user' },
});

export const Role: Model<IRole> = model('Role', RoleShema);
