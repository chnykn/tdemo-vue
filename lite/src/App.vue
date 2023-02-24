<template>
	<router-view :class="[mode]" />
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import { useGlobalStore, useSettingStore } from '@/store';

const globalStore = useGlobalStore();
const settingStore = useSettingStore();

const mode = computed(() => {
	return settingStore.displayMode;
});

//----------------------------

const onResize = () => {
	globalStore.updateVaidHeight();
};
globalStore.updateVaidHeight();

window.addEventListener('resize', onResize, false);

onUnmounted(() => {
	window.removeEventListener('resize', onResize);
});
</script>

<style lang="less" scoped></style>
