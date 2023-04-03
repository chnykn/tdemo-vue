<template>
	<!-- 最多支持三级菜单 -->
	<div>
		<template v-for="item in menuItems" :key="item.path">
			<template v-if="!item.children || item.meta?.single">
				<t-menu-item :name="item.path" :value="getPath(item)" :to="item.path">
					<template #icon>
						<component :is="menuIcon(item)" class="t-icon"></component>
					</template>
					{{ item.title }}
				</t-menu-item>
			</template>

			<t-submenu v-else :name="item.path" :value="item.path" :title="item.title">
				<template #icon>
					<component :is="menuIcon(item)" class="t-icon"></component>
				</template>

				<template v-for="item2 in item.children" :key="item2.path">
					<template v-if="!item2.children || item2.meta?.single">
						<t-menu-item :name="item2.path" :value="getPath(item2)" :to="item2.path">
							<template #icon>
								<component :is="menuIcon(item2)" class="t-icon"></component>
							</template>
							{{ item2.title }}
						</t-menu-item>
					</template>

					<t-submenu v-else :name="item2.path" :value="item2.path" :title="item2.title">
						<template #icon>
							<component :is="menuIcon(item2)" class="t-icon"></component>
						</template>

						<template v-for="item3 in item2.children" :key="item3.path">
							<t-menu-item :name="item3.path" :value="getPath(item3)" :to="item3.path">
								<template #icon>
									<component :is="menuIcon(item3)" class="t-icon"></component>
								</template>
								{{ item3.title }}
							</t-menu-item>
						</template>
					</t-submenu>
				</template>
			</t-submenu>
		</template>
	</div>
</template>

<script setup lang="tsx">
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { RouteRecordRaw } from 'vue-router';
import { allRoutes } from '@/router';
import { useGlobalStore } from '@/store';

const props = defineProps({
	active: {
		type: String,
		default: '',
	},
});

interface MenuItem {
	path: string;
	title?: string | any;
	name?: string;
	icon?:
		| string
		| any
		| {
				render: () => void;
		  };
	redirect?: string | any;
	children: MenuItem[];
	meta: any;
}

//-------------------

const menuItems = ref([]);

const refresh = () => {
	menuItems.value = getMenuList(allRoutes);
};

const globalStore = useGlobalStore();
const { routesChanged } = storeToRefs(globalStore);

watch(routesChanged, () => {
	refresh();
});

const getMenuList = (routes: Array<RouteRecordRaw>, basePath?: string): MenuItem[] => {
	if (!routes || routes.length === 0) {
		return null;
	}

	const result: MenuItem[] = [];

	routes.forEach((route) => {
		if (route.meta && !route.meta.removed && route.meta.hidden !== true) {
			const path = basePath ? `${basePath}/${route.path}` : route.path;
			result.push({
				path,
				title: route.meta?.title,
				icon: route.meta?.icon,
				children: getMenuList(route.children, path),
				meta: route.meta,
				redirect: route.redirect,
			});
		}
	});

	return result;
};

//-------------------

const getPath = (item: MenuItem) => {
	const pathLevel = item.path.split('/').length;
	const activeLevel = props.active.split('/').length;
	if (activeLevel > pathLevel && props.active.startsWith(item.path)) {
		return props.active;
	}

	if (props.active === item.path) {
		return props.active;
	}
	return item.meta?.single ? item.redirect : item.path;
};

const menuIcon = (item: MenuItem) => {
	if (typeof item.icon === 'string') return <t-icon name={item.icon} />;
	const RenderIcon = item.icon;
	return RenderIcon;
};

//-------------------

onMounted(() => {
	refresh();
});

defineExpose({
	refresh,
});
</script>

<style lang="less" scoped></style>
