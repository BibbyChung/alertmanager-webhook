import { UserInfo } from './userInfo';

export class OAuth20 {
	token_type = 'Bearer';
	refresh_token = '';
	access_token?: string;
	expires_in?: number;
	userInfo?: UserInfo;
}
