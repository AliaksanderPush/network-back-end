import { UserService } from './service/user.service';
import { App } from './main';
import { UserController } from './controllers/user.controller';
import { Container } from 'inversify';
import { TYPES } from './types';
import { connection } from './configs/connect.config';
import { TokenServise } from './service/token.service';
import { ChatServise } from './service/chat.service';
import { AuthController } from './controllers/auth.controller';
import { ChatController } from './controllers/chat.controller';
import { CommitsServise } from './service/commits.service';
import { CommitsController } from './controllers/commits.controller';

async function bootstrap() {
	const container = new Container();
	container.bind<App>(TYPES.App).to(App);
	container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
	container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
	container.bind<TokenServise>(TYPES.TokenServise).to(TokenServise).inSingletonScope();
	container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
	container.bind<ChatController>(TYPES.ChatController).to(ChatController).inSingletonScope();
	container.bind<ChatServise>(TYPES.ChatServise).to(ChatServise).inSingletonScope();
	container.bind<CommitsServise>(TYPES.CommitsServise).to(CommitsServise).inSingletonScope();
	container
		.bind<CommitsController>(TYPES.CommitsController)
		.to(CommitsController)
		.inSingletonScope();

	const app = container.get<App>(TYPES.App);
	await app.init();
	connection();
}
bootstrap();
