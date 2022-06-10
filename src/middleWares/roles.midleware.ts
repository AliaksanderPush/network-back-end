import { IUserPayload } from './../dto/userPayload.dto';
import { IMiddleware } from './middleWare.interfase';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export class RoleMidleware implements IMiddleware {
	constructor(private readonly roles: string[]) {
		this.roles = roles;
	}
	execute(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			try {
				const token = req.headers.authorization.split(' ')[1];
				const decData = verify(token, process.env.SECRET as string) as IUserPayload;
				const { role } = decData;

				let hasRole = false;
				role.forEach((rol) => {
					if (this.roles.includes(rol)) {
						hasRole = true;
					}
				});

				if (!hasRole) {
					return res.status(403).json('У вас нет доступа');
				}

				next();
			} catch (err) {
				res.status(403).json('Пользователь не авторизован');
			}
		} else {
			next();
		}
	}
}
