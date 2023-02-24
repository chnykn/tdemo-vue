export default {
	isRequestProxy: false, // 不启用直连代理

	development: {
		// 开发环境接口请求
		api: 'http://localhost:8088',
		// 开发环境 cdn 路径
		cdn: '',
	},

	release: {
		// 正式环境接口地址
		api: 'https://api.xxx.top',
		// 正式环境 cdn 路径
		cdn: '',
	},
};
