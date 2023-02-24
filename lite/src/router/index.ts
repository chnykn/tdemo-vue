import uniq from 'lodash/uniq';
import { useRoute, createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

//----------------------------

export const allRoutes: RouteRecordRaw[] = [];

// 导入 route modules
const routeModules = import.meta.globEager('./modules/**/!(homepage).ts');

Object.keys(routeModules).forEach((item) => {
	Object.keys(routeModules[item]).forEach((key: any) => {
		allRoutes.push(...routeModules[item][key]);
	});
});

//----------------------------

const router = createRouter({
	history: createWebHistory(),
	routes: allRoutes,
	scrollBehavior() {
		return {
			el: '#app',
			top: 0,
			behavior: 'smooth',
		};
	},
});

export const getActive = (maxLevel = 3): string => {
	const route = useRoute();
	if (!route.path) {
		return '';
	}
	return route.path
		.split('/')
		.filter((_item: string, index: number) => index <= maxLevel && index > 0)
		.map((item: string) => `/${item}`)
		.join('');
};

export const getRoutesExpanded = () => {
	const expandedRoutes = [];

	allRoutes.forEach((item) => {
		if (item.meta && item.meta.expanded) {
			expandedRoutes.push(item.path);
		}
		if (item.children && item.children.length > 0) {
			item.children
				.filter((child: RouteRecordRaw) => child.meta && child.meta.expanded)
				.forEach((child: RouteRecordRaw) => {
					expandedRoutes.push(item.path);
					expandedRoutes.push(`${item.path}/${child.path}`);
				});
		}
	});
	return uniq(expandedRoutes);
};

export default router;
