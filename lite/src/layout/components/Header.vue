<template>
	<div class="tdesgin-starter-header-layout">
		<t-head-menu class="tdesign-starter-header-menu-fixed" expand-type="popup" :theme="theme" :value="activeRoute">
			<template #logo>
				<div class="header-logo" @click="toUrl('/')">
					<logo-full class="t-logo" />
				</div>
			</template>

			<l-menus v-if="layout === 'top'" ref="menus" class="header-menu" :active="activeRoute" />

			<template #operations>
				<div class="header-operations">
					<div class="buttons">
						<t-dropdown :min-column-width="150" :options="userOpts" trigger="click">
							<t-button variant="text">
								<user-icon style="margin-top: 4px; margin-right: 3px" />
								{{ user?.name }}
								<template #suffix><chevron-down-icon size="16" /></template>
							</t-button>
						</t-dropdown>

						<t-tooltip placement="bottom" content="系统设置">
							<t-button theme="default" shape="square" variant="text" @click="showSettingPanel">
								<setting-icon />
							</t-button>
						</t-tooltip>
					</div>
				</div>
			</template>
		</t-head-menu>
	</div>
</template>

<script setup lang="tsx">
import type { PropType } from 'vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { DialogPlugin } from 'tdesign-vue-next';
import { ChevronDownIcon, SettingIcon, UserCircleIcon, UserIcon, PoweroffIcon } from 'tdesign-icons-vue-next';

import { getActive } from '@/router';
import { useSettingStore } from '@/store';
import LMenus from './Menus.vue';

import LogoFull from '@/assets/logo-full.svg?component';

// const props =
defineProps({
	theme: {
		type: String as PropType<'light' | 'dark'>,
		default: 'light',
	},
	layout: {
		type: String,
		default: '',
	},
});

//------------------------------

const router = useRouter();

const user = ref({ id: 'userId', name: '用户名' });

const activeRoute = computed(() => getActive());

const userOpts = [
	{
		content: '个人信息',
		value: 1,
		prefixIcon: () => {
			return <UserCircleIcon />;
		},
		onClick: () => {
			toUrl('/user/profile');
		},
	},
	{
		content: '退出登录',
		value: 2,
		prefixIcon: () => {
			return <PoweroffIcon />;
		},
		onClick: () => {
			logout();
		},
	},
];

//-------------------------

const toUrl = (url: string) => {
	router.push(url);
};

const logout = () => {
	const confirmDlg = DialogPlugin({
		header: '提示',
		body: `确定要退出当前用户，重新进行登录吗？`,
		onConfirm: () => {
			// authStore.logout();

			// router.push({ path: '/login' });
			confirmDlg.hide();
		},
		onClose: () => {
			confirmDlg.hide();
		},
	});
};

const showSettingPanel = () => {
	const store = useSettingStore();
	store.updateConfig({
		showSettingPanel: true,
	});
};

onMounted(() => {
	// ..
});
</script>

<style lang="less" scoped>
.header-logo {
	float: left;
	height: 30px;
	display: flex;
	margin-left: 10px;

	color: var(--td-text-color-primary);

	.t-logo {
		width: 100%;
		height: 100%;

		&:hover {
			cursor: pointer;
		}
	}

	&:hover {
		cursor: pointer;
	}
}

.header-menu {
	display: inline-flex;
}

.header-operations {
	display: flex;
	align-items: center;

	.t-icon {
		margin: 2px 2px 0 4px;
		font-size: 18px;
	}

	.buttons {
		border-left: thin dashed var(--td-scrollbar-color);
	}
}
</style>
