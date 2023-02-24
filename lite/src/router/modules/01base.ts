import { RouteRecordRaw } from 'vue-router';

// import Layout from '@/layout/index.vue';
import { HOME_PATH } from '@/config';

/*
<RouteRecordRaw>.meta相关属性的含义
	title: string //菜单的名称
	icon: string | svg //如果为string则使用TDesgin Icons中对于名称的图标，如果svg则是import的svg图标
	hidden: bolean  // 是否在菜单当中隐层
	removed: bolean // 是被移除，如果为true，则在vue-router当中无效（在router.beforeEach中处理的...)
	expanded: bolean //是否默认展开
	single: boolean //如果为true，则该节点的子节点在菜单中不显示，跳转到其redirect的所指的其他节点（一般是其子节点）
*/

// 存放基本的、固定的路由
const routeList: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: HOME_PATH,
	},

	{
		path: '/:w+',
		name: 'Go404',
		redirect: '/error/404',
	},

	// ...
];

export default routeList;
