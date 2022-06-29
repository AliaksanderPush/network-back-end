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
			let extArray = file.mimetype.split('/');
			let extension = extArray[extArray.length - 1];
			if (extension === 'quicktime') {
				cb(null, hash + '.' + 'mov');
			}
			if (extension === 'x-mp4v') {
				cb(null, hash + '.' + 'mp4');
			}

			cb(null, hash + '.' + extension);
		},
	}),

	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
	fileFilter: (req, file, cb) => {
		// allow images only
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mov|mp4)$/)) {
			return cb(null, false);
		}
		cb(null, true);
	},
} as Options;
