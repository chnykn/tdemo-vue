<template>
	<div class="container">
		<div class="tool-bar">
			<div class="caption">AA</div>
		</div>
		<div :style="`height:${vheight}px`">TODO...</div>
	</div>
</template>

//=========================

<script setup lang="ts">
// import { ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useGlobalStore } from '@/store';

const globalStore = useGlobalStore();
const { validHeight: vheight } = storeToRefs(globalStore);

// const s = 'xdx';
</script>

//=========================

<!-- <style lang="less" scoped></style> -->
