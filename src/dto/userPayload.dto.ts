export interface IUserPayload {
	_id: string;
	email: string;
	role: string[];
	iat?: number;
	exp?: number;
}
