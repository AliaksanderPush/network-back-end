import multer, { Options } from 'multer';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storageConfig = {
	dest: resolve(__dirname, '..', 'assets'),
	storage: multer.diskStorage({
		destination: (request, file, callback) => {
			callback(null, resolve(__dirname, '..', 'assets'));
		},
		filename: (req, file, cb) => {
			const hash = uuidv4();
			console.log('fille>>>', file);
			let extArray = file.mimetype.split('/');
			let extension = extArray[extArray.length - 1];
			if (extension === 'quicktime') {
				cb(null, hash + '.' + 'mov');
			} else if (extension === 'x-mp4v') {
				cb(null, hash + '.' + 'mp4');
			} else {
				cb(null, hash + '.' + 'mp4');
			}
		},
	}),

	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
	fileFilter: (request, file, callback) => {
		const formats = [
			'image/jpeg',
			'image/jpg',
			'image/png',
			'image/svg',
			'video/mov',
			'video/mp4',
		];

		if (formats.includes(file.mimetype)) {
			callback(null, true);
		} else {
			//callback(new Error('Такой формат не поддерживается'));
			callback(null, true);
		}
	},
} as Options;
