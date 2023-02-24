import uniq from 'lodash/uniq';
import {
	useRoute,
	createRouter,
	createWebHistory,
	RouteRecordRaw,
	RouteLocationNormalized,
	NavigationGuardNext,
} from 'vue-router';

import NProgress from 'nprogress'; // progress bar
import 'nprogress/css/nprogress.css'; // progress bar style

import { useAuthStore } from '@/store';
import whiteList from './whiteList';
import filterRoutes from './filter';

NProgress.configure({ showSpinner: false });

//----------------------------

export const allRoutes: Array<RouteRecordRaw> = [];

// 导入 route modules
const routeModules = import.meta.globEager('./modules/**.ts');

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

//------------------------------------------------

let removedPaths: Array<string> = [];

export const updateRoutes = (auths: number) => {
	removedPaths = filterRoutes(allRoutes, auths);
	// const activePath = getActive();
	// if (removedPaths.indexOf(activePath) >= 0) router.push('/error/403');
};

const onBeforeRoute = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	NProgress.start();

	const authStore = useAuthStore();
	const { token, user } = authStore;

	if (!token) {
		if (whiteList.indexOf(to.path) >= 0) {
			next();
		} else {
			next({ path: '/login' });
		}

		NProgress.done();
		return;
	}

	if (!user) {
		await authStore.update(null);
	}

	const authVal = authStore.getAuthVal();
	if (authVal == null) {
		next('/error/403');
		return;
	}

	if (authVal.changed) {
		removedPaths = filterRoutes(allRoutes, authVal.value);
		if (removedPaths.indexOf(to.fullPath) >= 0) {
			next('/error/403');
		} else {
			next();
		}
	} else if (removedPaths.indexOf(to.fullPath) >= 0) {
		next('/error/403');
	} else {
		next();
	}

	NProgress.done();
};
router.beforeEach(onBeforeRoute);

router.afterEach(() => {
	NProgress.done();
});

//------------------------------------------------

export default router;
