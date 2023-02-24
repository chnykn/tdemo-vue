import { RouteRecordRaw } from 'vue-router';

/*
增加 route.meta.removed属性，如果为true 则在菜单当中不显示
在 layout/components/Menus.vue的getMenuList函数中 用到
*/

const setChildenRouteRemoved = (routes: Array<RouteRecordRaw>, removedPaths: string[], basePath: string) => {
	if (!routes || routes.length <= 0) return;

	routes.forEach((route) => {
		if (route.meta) {
			route.meta.removed = true;

			const path = basePath ? `${basePath}/${route.path}` : route.path;
			removedPaths.push(path);

			setChildenRouteRemoved(route.children, removedPaths, path);
		}
	});
};

// 用于检查含有meta属性的route的children是不是都已经被removed了
// 如果是 则其自身也设置meta.removed=true，菜单当中将不显示
let levelRoutesList: Array<Array<RouteRecordRaw>> = [];

const applyFilterRoutes = (
	routes: Array<RouteRecordRaw>,
	auths: number,
	removedPaths: string[],
	basePath: string,
	routeLevel: number,
) => {
	if (!routes || routes.length <= 0) return;

	let levelRoutes: Array<RouteRecordRaw> = null;

	if (levelRoutesList.length < routeLevel + 1) {
		levelRoutes = [];
		levelRoutesList.push(levelRoutes);
	} else {
		levelRoutes = levelRoutesList[routeLevel];
	}

	routes.forEach((route) => {
		if (route.meta) {
			// 必须是有children的route才有意义
			if (route.children && routes.length > 0) levelRoutes.push(route);

			const path = basePath ? `${basePath}/${route.path}` : route.path;

			const auth = (route.meta.auth as number) || 0;
			// eslint-disable-next-line no-bitwise
			route.meta.removed = auth !== 0 && (auth & auths) <= 0;

			// 如果当前route需要被移除，则其children及其children的children都需要被移除
			if (route.meta.removed) {
				removedPaths.push(path);
				setChildenRouteRemoved(route.children, removedPaths, path);
			} else {
				applyFilterRoutes(route.children, auths, removedPaths, path, routeLevel + 1);
			}
		}
	});
};

export const filterRoutes = (routes: Array<RouteRecordRaw>, auths: number): Array<string> => {
	if (!routes || routes.length <= 0) return [];

	levelRoutesList = [];

	const removedPaths: Array<string> = [];
	applyFilterRoutes(routes, auths, removedPaths, '', 0);

	let levelRoutes: Array<RouteRecordRaw> = null;

	// 必须倒序循环，先从level最大的开始。
	// 因为level大route的meta.removed如果有变为true，有可能影响其上级的route的meta.removed
	for (let i = levelRoutesList.length - 1; i >= 0; i--) {
		levelRoutes = levelRoutesList[i];

		for (let j = 0; j < levelRoutes.length; j++) {
			const route = levelRoutes[j];

			let m = 0; // route的meta和children属性注定存在，applyFilterRoutes已经做了处理
			for (let k = 0; k < route.children.length; k++) {
				if (route.children[k].meta.removed) m += 1;
			}
			route.meta.removed = m === route.children.length;
		}
	}

	return removedPaths;
};

export default filterRoutes;
