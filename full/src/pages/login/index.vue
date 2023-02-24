<template>
	<div class="login-wrapper">
		<login-header />

		<div class="login-container">
			<div class="title-container">
				<h1 class="title">{{ TITLE }}</h1>
				<div class="sub-title">
					<p class="tip">{{ type === 'register' ? '已有账号?' : '没有账号吗?' }}</p>
					<p class="tip" @click="switchType(type === 'register' ? 'login' : 'register')">
						{{ type === 'register' ? '登录' : '注册新账号' }}
					</p>
				</div>
			</div>

			<login v-if="type === 'login'" />
			<register v-else @register-success="switchType('login')" />

			<setting />
		</div>

		<footer class="copyright">{{ COPYRIGHT }}</footer>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Setting from '@/layout/setting.vue';
import { HOME_PATH, TOKEN_NAME, TITLE, COPYRIGHT } from '@/config';

import Login from './components/Login.vue';
import Register from './components/Register.vue';
import LoginHeader from './components/Header.vue';

// 如果当前已经登陆，跳转到页首
if (localStorage.getItem(TOKEN_NAME)) {
	const router = useRouter();
	router.push(HOME_PATH);
}

const type = ref('login');
const switchType = (val: string) => {
	type.value = val;
};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
