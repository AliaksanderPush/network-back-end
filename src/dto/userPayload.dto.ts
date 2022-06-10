export interface IUserPayload {
	email: string;
	role: string[];
	iat?: number;
	exp?: number;
}
