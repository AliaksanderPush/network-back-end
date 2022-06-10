import { model, Schema, Model } from 'mongoose';
import { IToken } from '../dto/token.dto';

const TokenShema: Schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
	refreshToken: { type: String, required: true },
});

export const TokenModel: Model<IToken> = model('TokenModel', TokenShema);
