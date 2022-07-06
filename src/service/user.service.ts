import { IRole } from './../dto/role.dto';
import { Role } from './../model/role.model';
import { IUsers } from './../dto/user.dto';
import { UserModel } from '../model/user.model';
import { inject, injectable } from 'inversify';
import { hash, compare } from 'bcryptjs';
import { TokenServise } from './token.service';
import 'reflect-metadata';
import { nanoid } from 'nanoid';
import { TYPES } from '../types';
import { IUserResponseToClient } from '../dto/userReregistrResponse';
import { IJwtTokens, IRefreshToken } from '../dto/token.dto';
import { verify } from 'jsonwebtoken';
import { IUserPayload } from '../dto/userPayload.dto';
import fs from 'fs';

@injectable()
export class UserService {
	constructor(@inject(TYPES.TokenServise) protected tokenServise: TokenServise) {}
	async getAll() {
		try {
			return await UserModel.find();
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async addUsers(param: IUsers, password: string): Promise<IUserResponseToClient & IJwtTokens> {
		const { name, city, age, gender, email } = param;

		const hashPass = await hash(password, 7);
		try {
			let userRole = await this.findRole('user');
			if (!userRole) {
				userRole = await Role.create({ value: 'user' });
			}

			const user = await UserModel.create({
				name,
				city,
				age,
				gender,
				email,
				roles: [userRole?.value],
				password: hashPass,
			});

			const tokens = await this.generateAndSaveTokens(
				user._id,
				email,
				user.roles as string[],
			);

			const result = { ...tokens, user };
			return result;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async findRole(val: string): Promise<IRole | null> {
		try {
			return await Role.findOne({ value: val });
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async putUser(userId: string, data: IUsers): Promise<IUsers | null> {
		try {
			return await UserModel.findByIdAndUpdate(userId, data, { returnDocument: 'after' });
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async deleteUser(id: string) {
		try {
			await UserModel.findByIdAndDelete(id);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async getUser(id: string) {
		try {
			return await UserModel.findById(id);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async searchByEmail(email: string): Promise<IUsers | null> {
		return await UserModel.findOne({ email });
	}

	async searchByRole(id: number): Promise<string> {
		const role = await Role.findById(id);
		return role?.value as string;
	}

	async comparePassword(pass: string, hash: string): Promise<boolean> {
		return await compare(pass, hash);
	}

	async resetPassword() {
		const resetCode = nanoid(5).toUpperCase();
	}

	async generateAndSaveTokens(id: string, email: string, role: string[]): Promise<IJwtTokens> {
		try {
			const tokens = this.tokenServise.generateTokens(email, role as string[], id);
			await this.tokenServise.saveToken(id, tokens.refreshToken);
			return tokens;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async logout(refreshToken: string) {
		const token = await this.tokenServise.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken: string): Promise<IRefreshToken | undefined> {
		const userData = this.tokenServise.validateRefreshToken(refreshToken);
		const tokenFromDb = await this.tokenServise.findToken(refreshToken);
		if (userData && tokenFromDb) {
			const { email } = userData;
			const user = await this.searchByEmail(email);
			if (user) {
				const tokens = await this.generateAndSaveTokens(user._id, user.email, user?.roles!);
				const result = { ...tokens, user };
				return result;
			}
		}
	}

	getEmailByToken(token: string): string {
		const decData = verify(token, process.env.SECRET as string) as IUserPayload;
		return decData.email;
	}

	async upDatePassword(pass: string, token: string) {
		const email = this.getEmailByToken(token);
		const hashPass = await hash(pass, 7);
		return await UserModel.updateOne({ email: email }, { password: hashPass });
	}

	async removeOldAvatar(id: string) {
		const oldPath = await UserModel.findById(id);
		if (oldPath?.avatar) {
			const fullPath = `${__dirname}/../../build/assets/${oldPath?.avatar}`;
			fs.unlinkSync(fullPath);
			return oldPath;
		}
		return;
	}

	async upDateAvatar(id: string, path: string) {
		const result = await UserModel.findByIdAndUpdate(
			id,
			{ avatar: path },
			{ returnDocument: 'after' },
		);

		return result?.avatar;
	}
}
