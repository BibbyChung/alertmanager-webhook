import { EnumMyErrorType, MyError } from '@b/lib';
import { FastifyPluginAsync } from 'fastify';
import { ApiHelper } from '../common/apiHelper';

const allController: FastifyPluginAsync = async (server, options) => {
	server.get(`/health-check`, async (req, res) => {
		const gitInfo = ApiHelper.getGitInfo();

		return {
			up: true,
			...gitInfo
		};
	});

	server.get(`/error-check`, async (req, res) => {
		// throw new Error('000111');
		throw new MyError(EnumMyErrorType.badRequest);
	});
};

export default allController;
