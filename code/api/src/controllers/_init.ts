import { FastifyInstance } from 'fastify';
import allController from './all.controller';
import t0Controller from './t0.controller';
import lineNotifyController from './line-notify.controller';

export const initControllers = (server: FastifyInstance) => {
	const baseApiUrl = '/api';
	server.register(allController, { prefix: `${baseApiUrl}/all` });
	server.register(lineNotifyController, { prefix: `${baseApiUrl}/line-notify` });
	server.register(t0Controller, { prefix: `${baseApiUrl}/t0` });
};
