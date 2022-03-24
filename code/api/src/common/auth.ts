import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { envConfig } from '../environment';

export class Auth {
	private algorithm = 'aes-256-cbc';
	private expiredSeconds: number;
	private secret: string;

	private get _hashSecret() {
		const key = '010' + this.secret;
		const newKey = key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
		return crypto.createHash('md5').update(newKey, 'utf8').digest('hex').toUpperCase();
	}

	constructor() {
		const auth = envConfig.auth;
		this.expiredSeconds = auth.expiredSeconds;
		this.secret = auth.secret;
	}

	encryptJWT(obj: object) {
		const objJson = JSON.stringify(obj);
		const encryptTxt = this.encryptAES256CBC(objJson);
		const token = jwt.sign({ data: encryptTxt }, this.secret, { expiresIn: this.expiredSeconds });
		return token;
	}

	decryptJWT<T>(token: string) {
		const jwtDecodedInfo = jwt.verify(token, this.secret) as { [key: string]: string };
		const encryptTxt = jwtDecodedInfo['data'];
		const objJson = this.decryptAES256CBC(encryptTxt);
		return JSON.parse(objJson) as T;
	}

	// DES 加密
	encryptAES256CBC(txt: string) {
		const keyHex = Buffer.alloc(16);
		const cipher = crypto.createCipheriv(this.algorithm, this._hashSecret, keyHex);
		return cipher.update(txt, 'utf8', 'base64') + cipher.final('base64');
	}

	// DES 解密
	decryptAES256CBC(txt: string) {
		const keyHex = Buffer.alloc(16);
		const cipher = crypto.createDecipheriv(this.algorithm, this._hashSecret, keyHex);
		return cipher.update(txt, 'base64', 'utf8') + cipher.final('utf8');
	}
}
