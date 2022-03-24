import { FastifyInstance } from 'fastify';
import allController from './all.controller';
import t0Controller from './t0.controller';

export const initControllers = (server: FastifyInstance) => {
	const baseApiUrl = '/api';
	server.register(allController, { prefix: `${baseApiUrl}/all` });
	server.register(t0Controller, { prefix: `${baseApiUrl}/t0` });
};
