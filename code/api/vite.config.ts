import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
	plugins: [
		...VitePluginNode({
			adapter: 'fastify',
			appPath: './src/server.ts'
		})
	],
	optimizeDeps: {
		include: ['fastify-plugin']
	}
});
