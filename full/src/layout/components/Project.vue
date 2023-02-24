<template>
	<div class="curr-project">
		<span class="label">当前项目</span>
		<t-select
			auto-width
			filterable
			:keys="{ label: 'name', value: 'id' }"
			:options="projectOpts"
			:value="projectId"
			:class="selectCls()"
			placeholder="请选择当前项目"
			@change="onProjectChange"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { updateRoutes } from '@/router';
import { request } from '@/utils/request';
import { useAuthStore, useGlobalStore } from '@/store';

const props = defineProps({
	layout: {
		type: String,
		default: '',
	},
});

const selectCls = () => {
	return props.layout === 'top' ? 'operations' : '';
};

const projectOpts = ref([]);

const authStore = useAuthStore();
const { project } = storeToRefs(authStore);

const projectId = computed(() => {
	return project.value ? project.value.id : '';
});

const globalStore = useGlobalStore();

//----------------------------------

const onProjectChange = (_, ctx) => {
	if (!ctx || !ctx.selectedOptions || ctx.selectedOptions.length <= 0) return;

	const newProj = ctx.selectedOptions[0];
	authStore.setProject(newProj, async () => {
		const authVal = authStore.getAuthVal();

		// 如果是项目列表页面，需要重新刷新菜单；如果不是，重刷页面 注定会重新刷新菜单
		if (window.location.pathname === '/project/list') {
			if (authVal.changed) {
				updateRoutes(authVal.value);
				globalStore.updateMenus();
			}
		} else {
			window.location.reload();
		}
	});
};

onMounted(() => {
	request.get({ url: '/project/items?order=1' }).then((data) => {
		projectOpts.value = data;
	});
});
</script>

<style lang="less" scoped>
.curr-project {
	display: flex;
	align-items: center;

	.label {
		color: var(--td-gray-color-5);
		font-weight: bold;
		width: 96px;
		line-height: 36px;
	}
}

.operations {
	margin-left: 5px;
}
</style>
