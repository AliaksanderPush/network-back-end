import multer, { Options } from 'multer';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storageConfig = {
	dest: resolve(__dirname, '..', 'assets'),
	storage: multer.diskStorage({
		destination: (request, file, callback) => {
			callback(null, resolve(__dirname, '..', 'assets'));
			//callback(null, resolve(__dirname, '..', '..', '..', 'client/assets/users'));
		},
		filename: (req, file, cb) => {
			const hash = uuidv4();
			let extArray = file.mimetype.split('/');
			let extension = extArray[extArray.length - 1];
			cb(null, hash + '.' + extension);
		},
	}),

	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
	fileFilter: (request, file, callback) => {
		const formats = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg'];

		if (formats.includes(file.mimetype)) {
			callback(null, true);
		} else {
			callback(new Error('Такой формат не поддерживается'));
		}
	},
} as Options;
