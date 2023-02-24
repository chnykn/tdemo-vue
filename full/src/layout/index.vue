<template>
	<t-layout>
		<t-header>
			<l-header :layout="layout" :theme="displayMode" />
		</t-header>

		<t-layout>
			<t-aside v-if="layout !== 'top'">
				<l-side-nav :theme="displayMode" />
			</t-aside>

			<t-content :style="getContentStyle()">
				<!-- eslint-disable-next-line vue/no-unused-vars -->
				<router-view v-slot="{ Component }" />
				<!--
				<router-view v-slot="{ Component }">
					<transition name="fade" mode="out-in">
						<component :is="Component" />
					</transition>
				</router-view>
				-->
			</t-content>
		</t-layout>

		<l-setting />
	</t-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingStore } from '@/store';

import LSetting from './setting.vue';
import LHeader from './components/Header.vue';
import LSideNav from './components/SideNav.vue';

import '@/style/layout.less';

const settingStore = useSettingStore();
const { layout, displayMode } = storeToRefs(settingStore);

//-------------------

const getContentStyle = () => {
	let res = 'padding-top: 5px;';
	if (settingStore.layout !== 'top') res += 'padding-left: 5px;';
	return res;
};

onMounted(() => {
	// ..
});
</script>
