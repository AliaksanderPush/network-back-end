import { UserService } from './service/user.service';
import { App } from './main';
import { UserController } from './controllers/user.controller';
import { Container } from 'inversify';
import { TYPES } from './types';
import { connection } from './configs/connect.config';
import { TokenServise } from './service/token.service';
import { PostServise } from './service/post.service';
import { AuthController } from './controllers/auth.controller';
import { PostController } from './controllers/post.controller';
import { CommitsServise } from './service/commits.service';
import { CommitsController } from './controllers/commits.controller';
import { FriendsController } from './controllers/friends.controller';
import { FriendsServise } from './service/friends.service';
import { MessagesServise } from './service/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { sockets } from './socket';

async function bootstrap() {
	const container = new Container();
	container.bind<App>(TYPES.App).to(App);
	container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
	container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
	container.bind<TokenServise>(TYPES.TokenServise).to(TokenServise).inSingletonScope();
	container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
	container.bind<PostController>(TYPES.PostController).to(PostController).inSingletonScope();
	container.bind<PostServise>(TYPES.PostServise).to(PostServise).inSingletonScope();
	container.bind<CommitsServise>(TYPES.CommitsServise).to(CommitsServise).inSingletonScope();
	container
		.bind<FriendsController>(TYPES.FriendsController)
		.to(FriendsController)
		.inSingletonScope();
	container.bind<FriendsServise>(TYPES.FriendsServise).to(FriendsServise).inSingletonScope();

	container
		.bind<CommitsController>(TYPES.CommitsController)
		.to(CommitsController)
		.inSingletonScope();
	container.bind<MessagesServise>(TYPES.MessagesServise).to(MessagesServise).inSingletonScope();
	container
		.bind<MessagesController>(TYPES.MessagesController)
		.to(MessagesController)
		.inSingletonScope();

	const app = container.get<App>(TYPES.App);
	await app.init();
	connection();
	sockets(app.io);
}
bootstrap();
