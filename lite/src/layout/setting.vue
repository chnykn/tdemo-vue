<template>
	<t-drawer
		v-model:visible="showSettingPanel"
		size="408px"
		:footer="false"
		header="页面配置"
		:close-btn="true"
		class="setting-drawer-container"
		@close-btn-click="onCloseDrawer"
	>
		<div class="setting-container">
			<t-form ref="form" :data="formData" label-align="left">
				<div class="setting-group-title">主题模式</div>
				<t-radio-group v-model="formData.mode">
					<div v-for="(item, index) in MODE_OPTIONS" :key="index" class="setting-layout-drawer">
						<div>
							<t-radio-button :key="index" :value="item.type">
								<component :is="getModeIcon(item.type)" />
							</t-radio-button>
							<p :style="{ textAlign: 'center', marginTop: '8px' }">{{ item.text }}</p>
						</div>
					</div>
				</t-radio-group>

				<div class="setting-group-title">主题色</div>
				<t-radio-group v-model="formData.brandTheme">
					<div v-for="(item, index) in DEFAULT_COLOR_OPTIONS" :key="index" class="setting-layout-drawer">
						<t-radio-button :key="index" :value="item" class="setting-layout-color-group">
							<color-container :value="item" />
						</t-radio-button>
					</div>
				</t-radio-group>

				<div class="setting-group-title">导航布局</div>
				<t-radio-group v-model="formData.layout">
					<div v-for="(item, index) in LAYOUT_OPTION" :key="index" class="setting-layout-drawer">
						<t-radio-button :key="index" :value="item">
							<thumbnail :src="getThumbnailUrl(item)" />
						</t-radio-button>
					</div>
				</t-radio-group>
			</t-form>

			<div class="setting-info">版本号:&nbsp; {{ pgk.version }}</div>
		</div>
	</t-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue';

import STYLE_CONFIG from '@/config/style';
import { useSettingStore } from '@/store';
import Thumbnail from '@/components/thumbnail/index.vue';
import ColorContainer from '@/components/color/index.vue';
import { DEFAULT_COLOR_OPTIONS } from '@/config/color';

import SettingDarkIcon from '@/assets/setting-dark.svg';
import SettingLightIcon from '@/assets/setting-light.svg';
import SettingAutoIcon from '@/assets/setting-auto.svg';
import pgk from '../../package.json';

const settingStore = useSettingStore();

//----------------------

const LAYOUT_OPTION = ['side', 'top', 'mix'];

const MODE_OPTIONS = [
	{ type: 'light', text: '明亮' },
	{ type: 'dark', text: '暗黑' },
	{ type: 'auto', text: '跟随系统' },
];

const initStyleConfig = () => {
	const styleConfig = STYLE_CONFIG;
	for (const key in styleConfig) {
		if (Object.prototype.hasOwnProperty.call(styleConfig, key)) {
			styleConfig[key] = settingStore[key];
		}
	}
	return styleConfig;
};

const formData = ref({ ...initStyleConfig() });

//-------------------------

// const showSettingPanel = ref(true);
const showSettingPanel = computed({
	get() {
		return settingStore.showSettingPanel;
	},
	set(newVal: boolean) {
		settingStore.updateConfig({
			showSettingPanel: newVal,
		});
	},
});

const getModeIcon = (mode: string) => {
	if (mode === 'light') {
		return SettingLightIcon;
	}
	if (mode === 'dark') {
		return SettingDarkIcon;
	}
	return SettingAutoIcon;
};

const getThumbnailUrl = (name: string): string => {
	return `/imgs/${name}.png`;
};

//-------------------------

const onCloseDrawer = () => {
	settingStore.updateConfig({
		showSettingPanel: false,
	});
};

watchEffect(() => {
	if (formData.value.brandTheme) settingStore.updateConfig(formData.value);
});

onMounted(() => {
	// ...
});
</script>

<!-- teleport导致drawer 内 scoped样式问题无法生效 先规避下 -->
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="less">
@import url('./setting.less');
</style>
