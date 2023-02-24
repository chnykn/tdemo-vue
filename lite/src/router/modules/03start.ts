import { shallowRef } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

import HomeIcon from '@/assets/menu-home.svg';

// 存放页面的、动态的路由
const routeList: Array<RouteRecordRaw> = [
	{
		path: '/start',
		name: 'start',
		redirect: '/start/intro',
		component: Layout,
		meta: { title: '介绍', icon: shallowRef(HomeIcon), single: true },
		children: [
			{
				path: 'intro',
				name: 'Intro',
				component: () => import('@/pages/start/index.vue'),
				meta: { title: '介绍' },
			},
		],
	},

	// ... ...
];

export default routeList;
