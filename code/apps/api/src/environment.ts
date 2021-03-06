import { EnumEnvType } from '@b/lib';
import * as jsonObj from './_env.json';

interface IConfig {
	siteName: string;
	envType: EnumEnvType;
	api: {
		host: string;
		port: number;
	};
}

const env = process.env.NODE_ENV;
const config = { ...jsonObj } as IConfig;

if (env === 'prod') {
	config.envType = EnumEnvType.prod;
} else {
	config.envType = EnumEnvType.dev;
}
export const envConfig = config;
