import { FastifyPluginAsync } from 'fastify';

const allController: FastifyPluginAsync = async (server, options) => {
	server.get(`/healthz`, async (req, res) => {
		return {
			up: true
		};
	});
};

export default allController;
