import { UserService } from './service/user.service';
import { App } from './main';
import { UserController } from './controllers/user.controller';
import { Container } from 'inversify';
import { TYPES } from './types';
import { connection } from './configs/connect.config';
import { TokenServise } from './service/token.service';
import { AuthController } from './controllers/auth.controller';

async function bootstrap() {
	const container = new Container();
	container.bind<App>(TYPES.App).to(App);
	container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
	container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
	container.bind<TokenServise>(TYPES.TokenServise).to(TokenServise).inSingletonScope();
	container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
	const app = container.get<App>(TYPES.App);
	await app.init();
	connection();
}
bootstrap();
