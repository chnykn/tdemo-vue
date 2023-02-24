<template>
	<div class="container">
		<div class="tool-bar">
			<div class="caption">介绍</div>
		</div>
		<div :style="`height:${vheight}px`">
			<t-button>TODO...</t-button>
		</div>
	</div>
</template>

//=========================

<script setup lang="ts">
// import { ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useGlobalStore } from '@/store';

const globalStore = useGlobalStore();
const { validHeight: vheight } = storeToRefs(globalStore);
</script>

//=========================

<style scoped></style>
