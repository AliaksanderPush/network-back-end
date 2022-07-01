import { IMiddleware } from './middleWare.interfase';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../model/user.model';

export class LastSeenUpdate implements IMiddleware {
	async execute(req: Request, res: Response, next: NextFunction) {
		if (req.user) {
			const id = req.user._id;
			await UserModel.findOneAndUpdate(
				{ _id: id },
				{
					last_seen: new Date(),
				},
				{ new: true },
			);
		}
		next();
	}
}
