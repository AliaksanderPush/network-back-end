declare namespace Express {
	export interface Request {
		user: {
			email: string;
			role: string[];
			_id: string;
		};
	}
}
