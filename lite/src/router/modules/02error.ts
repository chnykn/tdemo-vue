import { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

// 結果
const resultRouteList: Array<RouteRecordRaw> = [
	{
		path: '/error',
		name: 'error',
		component: Layout,
		redirect: '/error/403',
		meta: { title: '结果页', hidden: true },
		children: [
			{
				path: '403',
				name: 'Error403',
				component: () => import('@/pages/error/403.vue'),
				meta: { title: '无权限' },
			},
			{
				path: '404',
				name: 'Error404',
				component: () => import('@/pages/error/404.vue'),
				meta: { title: '页面不存在' },
			},
			{
				path: '500',
				name: 'Error500',
				component: () => import('@/pages/error/500.vue'),
				meta: { title: '服务器出错' },
			},
		],
	},
];

export default resultRouteList;
