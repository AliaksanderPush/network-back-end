import { IsEmail, Min, Max, IsInt, Length, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'Введите имя' })
	name: string;
	@IsString({ message: 'Введите пароль' })
	@Length(2, 20)
	password: string;
	@IsString({ message: 'Введите город' })
	city: string;
	@Max(99)
	@Min(0)
	@IsInt()
	age: number;
	@IsString({ message: 'Введите пол' })
	gender: string;
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;
	roles?: string[];
}
