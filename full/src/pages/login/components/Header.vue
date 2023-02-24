<template>
	<header class="login-header">
		<logo-full-icon class="logo" />

		<div class="operations-container">
			<t-button theme="default" shape="square" variant="text">
				<help-circle-icon class="icon" />
			</t-button>
			<t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
				<setting-icon class="icon" />
			</t-button>
		</div>
	</header>
</template>

<script setup lang="ts">
import { HelpCircleIcon, SettingIcon } from 'tdesign-icons-vue-next';
import LogoFullIcon from '@/assets/logo-full.svg?component';
import { useSettingStore } from '@/store';

const settingStore = useSettingStore();
const toggleSettingPanel = () => {
	settingStore.updateConfig({
		showSettingPanel: true,
	});
};
</script>

<style lang="less" scoped>
.login-header {
	padding: 0 var(--td-comp-paddingLR-xl);
	display: flex;
	justify-content: space-between;
	align-items: center;
	backdrop-filter: blur(10px);
	color: var(--td-text-color-primary);

	.logo {
		width: 230px;
		height: var(--td-comp-size-s);
	}

	.operations-container {
		display: flex;
		align-items: center;

		.icon {
			height: 20px;
			width: 20px;
			padding: 6px;
			box-sizing: content-box;

			&:hover {
				cursor: pointer;
			}
		}
	}
}
</style>
