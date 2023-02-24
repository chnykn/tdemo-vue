import path from 'path';
import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
	// 是否开启mock
	const { VITE_BASE_URL } = loadEnv(mode, CWD);

	return {
		base: VITE_BASE_URL,
		publicDir: 'public', // 要打包的静态资源，不配置的话，output打包出来的文件会没有图片

		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},

		css: {
			preprocessorOptions: {
				less: {
					modifyVars: {
						hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
					},
					math: 'strict',
					javascriptEnabled: true,
				},
			},
		},

		plugins: [vue(), vueJsx(), svgLoader()],

		server: {
			port: 3030,
			cors: true,
			host: '0.0.0.0',
		},
	};
};
