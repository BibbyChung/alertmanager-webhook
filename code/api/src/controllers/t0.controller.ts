import { addInputJsonSchema, addInputType, addInputValidate } from '@b/lib';
import { FastifyPluginAsync } from 'fastify';

const t0Controller: FastifyPluginAsync = async (server, options) => {
	server.post(
		`/add`,
		{
			schema: {
				body: addInputJsonSchema
			}
		},
		async (req, res) => {
			const body = req.body as addInputType;
			return { result: body.x + body.y };
		}
	);
};

export default t0Controller;
