import { AuthGuard } from './../middleWares/auth.guard';
import { UserService } from './../service/user.service';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { UserLoginDto } from '../dto/userLogin.dto';
import { UserRegisterDto } from '../dto/userRegister.dto';
import { ValidateMidleWare } from '../middleWares/validate.middleware';
import { IUsers } from '../dto/user.dto';
import 'reflect-metadata';
import { nanoid } from 'nanoid';

@injectable()
export class AuthController extends BaseController {
	constructor(@inject(TYPES.UserService) protected userService: UserService) {
		super();
		this.bindRouters([
			{
				path: '/login',
				methot: 'post',
				func: this.login,
				middlewares: [new ValidateMidleWare(UserLoginDto)],
			},

			{
				path: '/register',
				methot: 'post',
				func: this.register,
				middlewares: [new ValidateMidleWare(UserRegisterDto)],
			},

			{
				path: '/info',
				methot: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},

			{
				path: '/logout',
				methot: 'post',
				func: this.logout,
				middlewares: [],
			},
			{
				path: '/update-password',
				methot: 'post',
				func: this.updatePassword,
				middlewares: [],
			},
			{
				path: '/fogot-password',
				methot: 'post',
				func: this.fogotPassword,
				middlewares: [],
			},
		]);
	}

	test(req: Request<{}, {}, IUsers>, res: Response, next: NextFunction) {
		this.ok(res, 'Hello server');
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { email, password } = req.body;
		const searchUser = await this.userService.searchByEmail(email);

		if (searchUser) {
			const result = await this.userService.comparePassword(password, searchUser.password);

			if (!result) {
				this.send(res, 400, 'Email / password does not match!!');
				return;
			}

			const role = searchUser.roles;
			const id = searchUser._id;
			if (role) {
				const tokens = await this.userService.generateAndSaveTokens(id, email, role);
				this.ok(res, {
					token: { accesToken: tokens.accesToken, refreshToken: tokens.refreshToken },
					searchUser,
				});

				return;
			} else {
				this.send(res, 400, 'User does not role');
				return;
			}
		} else {
			this.send(res, 400, 'User not found, with the given email');
			return;
		}
	}

	async register(req: Request<{}, {}, IUsers>, res: Response, next: NextFunction): Promise<void> {
		const { email, password } = req.body;
		const result = await this.userService.searchByEmail(email);

		if (!result) {
			const getUser = await this.userService.addUsers(req.body, password);
			this.ok(res, {
				token: { accesToken: getUser.accesToken, refreshToken: getUser.refreshToken },
				searchUser: getUser.user,
			});
			return;
		} else {
			this.send(res, 401, 'This email is already in use, try sign-in!');
			return;
		}
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, { email: user.email, role: user.role });
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			if (req.headers.authorization) {
				const refreshToken = req.headers.authorization.split(' ')[1];

				if (!refreshToken) {
					return this.send(res, 401, 'Refresh token not found');
				}
				const token = await this.userService.logout(refreshToken);
				return this.ok(res, { token });
			}
		} catch (e) {
			next(e);
		}
	}

	async updatePassword(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			await this.userService.upDatePassword(req.body.pass, token);
			this.ok(res, 'Your password was update');
		}
	}

	async fogotPassword(req: Request, res: Response, next: NextFunction) {
		const { email } = req.body;
		console.log('email>>>', email);
		const searchUser = await this.userService.searchByEmail(email);
		if (!searchUser) {
			this.send(res, 401, 'User not found!');
			return;
		}
		const resetCode = nanoid(5).toUpperCase();
		// save to db
		/*
		user.resetCode = resetCode;
		user.save();
		// prepare email
		const emailData = {
			from: process.env.EMAIL_FROM,
			to: user.email,
			subject: 'Password reset code',
			html: `
    <h4>Enter this code in the app to reset password</h4>
    <h1 style="color:red;">${resetCode}</h1>
    `,
		};
		// send email
		try {
			const data = await sgMail.send(emailData);
			console.log(data);
			res.json({ ok: true });
		} catch (err) {
			console.log(err);
			res.json({ ok: false });
		}
        */
		this.ok(res, 'Your password ');
		console.log('user>>>', searchUser);
		return;
	}
}
