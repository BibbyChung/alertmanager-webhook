import { UserInfo } from '@b/lib';
import { IncomingMessage } from 'http';
// import { getOperators } from '../../web/repositories/myUnitOfWork';

export const getGitInfo = () => {
	const env = process.env;
	return {
		gitVer: env.VITE_GIT_SHORT_VER, // 67fe003
		gitTime: env.VITE_GIT_TIME // 2022-01-29-11-56-08
	};
};

export class ApiHelper {
	static userInfo: UserInfo;

	static getGitInfo() {
		const env = process.env;
		return {
			gitVer: env.VITE_GIT_SHORT_VER, // 67fe003
			gitTime: env.VITE_GIT_TIME // 2022-01-29-11-56-08
		};
	}

	static getRealIP(req: IncomingMessage) {
		return (
			req.headers['cf-connecting-ip'] ??
			req.headers['x-forwarded-for'] ??
			req.socket.remoteAddress ??
			''
		)
			.toString()
			.split(',')[0]
			.trim();
	}

	static base64Encode(str: string) {
		return Buffer.from(str).toString('base64');
	}
}
