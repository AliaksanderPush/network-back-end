import { Document } from 'mongoose';
import { IUsers } from './user.dto';

export interface IToken extends Document {
	user: IUsers;
	refreshToken: string;
}

export interface IJwtTokens {
	accesToken: string;
	refreshToken: string;
}

export interface IRefreshToken {
	user: IUsers;
	accesToken: string;
	refreshToken: string;
}
