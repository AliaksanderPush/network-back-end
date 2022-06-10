import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

export const connection = async () => {
	dotenv.config();
	try {
		await mongoose.connect('mongodb://localhost:27017/db', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions);
		console.log('DataBase_________________OK!');
	} catch (err) {
		console.log('Error connection', err);
	}
};
