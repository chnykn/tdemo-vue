// import { shallowRef } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

const routeList: Array<RouteRecordRaw> = [
	{
		path: '/test',
		name: 'test',
		redirect: '/test/aa',
		component: Layout,
		meta: { title: '测试', icon: 'tips', expanded: true }, // icon: shallowRef(ProjectIcon),
		children: [
			{
				path: 'a',
				name: 'TestA',
				component: () => import('@/pages/test/a.vue'),
				meta: { title: 'A' },
			},
			{
				path: 'b',
				name: 'TestB',
				redirect: '/test/b/c',
				meta: { title: 'B', auth: 1 },
				children: [
					{
						path: 'c',
						name: 'TestC',
						component: () => import('@/pages/test/c.vue'),
						meta: { title: 'C' },
					},
				],
			},
		],
	},

	// ... ...
];

export default routeList;
