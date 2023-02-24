<template>
	<!-- 最多支持三级菜单 -->
	<div class="top-border nav-panel" :style="`height:${vheight}px`">
		<div>
			<!-- :collapsed="collapsed" -->
			<t-menu :value="activeRoute" :theme="theme" :default-expanded="defaultExpanded">
				<l-menus ref="menus" :active="activeRoute" />
			</t-menu>
		</div>
	</div>
</template>

<script setup lang="tsx">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import { storeToRefs } from 'pinia';
import union from 'lodash/union';

import { useGlobalStore } from '@/store';
import { getActive, getRoutesExpanded } from '@/router';

import LMenus from './Menus.vue';

// const props =
defineProps({
	theme: {
		type: String as PropType<'light' | 'dark'>,
		default: 'light',
	},
	isCompact: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
});

//-------------------

const menus = ref(null);

const globalStore = useGlobalStore();
const { pageHeight: vheight } = storeToRefs(globalStore);

// const collapsed = ref(false);
const activeRoute = computed(() => getActive());

const defaultExpanded = computed(() => {
	const path = getActive();
	const parentPath = path.substring(0, path.lastIndexOf('/'));
	const expanded = getRoutesExpanded();
	return union(expanded, parentPath === '' ? [] : [parentPath]);
});

//-------------------

const refreshMenus = () => {
	menus.value.refresh();
};

defineExpose({
	refreshMenus,
});
</script>

<style lang="less" scoped>
.nav-panel {
	margin-top: 0;
	overflow: auto;
	width: 100%;
	overflow-x: hidden;

	height: 100%;
}

// .nav-panel:host {
// 	--collapse-display: none;
// 	// --content-margin-left: var(--aside-width);
// }

.nav-panel::-webkit-scrollbar {
	width: 8px;
	// background: transparent;
}

.nav-panel::-webkit-scrollbar-button {
	width: 32px; //for horizontal scrollbar
	height: 32px; //for vertical scrollbar
}

.nav-panel::-webkit-scrollbar-thumb {
	border-radius: 4px;
	border: 2px solid transparent;
	background-clip: content-box;
	background-color: #ccc;
}
</style>
