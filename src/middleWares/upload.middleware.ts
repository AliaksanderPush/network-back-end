import { IMiddleware } from './middleWare.interfase';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { storageConfig } from '../configs/multer.config';

export class UploadMiddleWare implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		const upload = multer(storageConfig).single('filedata');
		upload(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				console.log(err);
				res.status(400).send('Ошибка Multer при загрузке');
			} else if (err) {
				console.log(err);
				res.status(400).send(' При загрузке произошла неизвестная ошибка.');
			} else {
				return req.file?.filename;
			}
		});

		next();
	}
}
