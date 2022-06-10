import { IMiddleware } from './middleWare.interfase';
import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMidleWare implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const instance = plainToClass(this.classToValidate, body);
		const errors = await validate(instance);
		if (errors.length) {
			res.status(422).send(errors);
		} else {
			next();
		}
	}
}
