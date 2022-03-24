import 'dotenv/config';
import { EnumEnvType } from '@b/lib';
import Fastify, { FastifyServerOptions } from 'fastify';
import { initControllers } from './controllers/_init';
import { envConfig } from './environment';

const createServer = (opts: FastifyServerOptions = {}) => {
	const server = Fastify(opts);

	server.register(async (server, options) => {
		process.on('SIGINT', () => server.close());
		process.on('SIGTERM', () => server.close());
	});

	initControllers(server);

	server.ready(() => {
		console.log(server.printRoutes({ commonPrefix: false }));
	});

	return server;
};

const startServer = async () => {
	const server = createServer({
		// logger: {
		// 	level: 'info'
		// },
		// disableRequestLogging: false
		logger: false,
		disableRequestLogging: envConfig.envType === EnumEnvType.prod
	});

	if (envConfig.envType === EnumEnvType.prod) {
		try {
			const host = process.env.API_HOST ?? 'localhost';
			const port = process.env.API_PORT ?? 3000;
			await server.listen(port, '0.0.0.0');
			console.log(`${host}:${port} => ${host} server start...`);
		} catch (err) {
			console.log(err);
			// server.log.error(err);
			process.exit(1);
		}
	}

	return server;
};

export const viteNodeApp = startServer();
