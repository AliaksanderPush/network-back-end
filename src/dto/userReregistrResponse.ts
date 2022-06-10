import { IJwtTokens } from './token.dto';
import { IUsers } from './user.dto';

export interface IUserResponseToClient {
	user: IUsers & { _id: string };
}
