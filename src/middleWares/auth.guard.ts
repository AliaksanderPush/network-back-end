import { IMiddleware } from './middleWare.interfase';
import { Request, Response, NextFunction } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction) {
		if (req.user) {
			return next();
		} else {
			res.status(401).send('Вы не авторизованы!');
		}
	}
}
