import { IsEmail, Length, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;
	@IsString({ message: 'Введите пароль' })
	@Length(2, 20)
	password: string;
}
