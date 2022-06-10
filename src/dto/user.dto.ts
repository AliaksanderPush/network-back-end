import { Document } from 'mongoose';

export interface IUsers extends Document {
	name: string;
	password: string;
	resetCode?: string;
	city: string;
	age: number;
	email: string;
	gender: string;
	avatar?: string;
	roles?: string[];
}
