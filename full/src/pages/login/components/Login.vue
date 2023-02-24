<template>
	<t-form
		ref="form"
		:class="['item-container', `login-${type}`]"
		:data="formData"
		:rules="FORM_RULES"
		label-width="0"
		@submit="onSubmit"
	>
		<template v-if="type === 'password'">
			<t-form-item name="name">
				<t-input v-model="formData.name" size="large" placeholder="请输入账号名">
					<template #prefix-icon>
						<user-icon />
					</template>
				</t-input>
			</t-form-item>

			<t-form-item name="password">
				<t-input
					v-model="formData.password"
					size="large"
					:type="showPsw ? 'text' : 'password'"
					placeholder="请输入登录密码"
				>
					<template #prefix-icon>
						<lock-on-icon />
					</template>
					<template #suffix-icon>
						<browse-icon v-if="showPsw" @click="showPsw = false" />
						<browse-off-icon v-else @click="showPsw = true" />
					</template>
				</t-input>
			</t-form-item>
		</template>

		<!-- 手机号登陆 -->
		<template v-else>
			<t-form-item name="phone">
				<t-input v-model="formData.phone" size="large" placeholder="请输入手机号">
					<template #prefix-icon>
						<mobile-icon />
					</template>
				</t-input>
			</t-form-item>

			<t-form-item class="verification-code" name="verCode">
				<t-input v-model="formData.verCode" size="large" placeholder="请输入短信验证码" />
				<t-button variant="outline" :disabled="countDown > 0" @click="onSendVCode">
					{{ countDown === 0 ? '发送验证码' : `${countDown}秒后可重发` }}
				</t-button>
			</t-form-item>
		</template>

		<t-form-item class="btn-container">
			<t-button block size="large" type="submit"> 登录 </t-button>
		</t-form-item>

		<div class="switch-container">
			<span v-if="type !== 'password'" class="tip" @click="switchType('password')">使用账号密码登录</span>
			<span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">使用短信验证登录</span>
		</div>
	</t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormRule } from 'tdesign-vue-next';
import { UserIcon, LockOnIcon, MobileIcon, BrowseIcon, BrowseOffIcon } from 'tdesign-icons-vue-next';

import { useCounter } from '@/hooks';
import { useAuthStore } from '@/store';
import { sendVerifyCode } from '@/pages/common';

const authStore = useAuthStore();

const INITIAL_DATA = {
	name: '',
	password: '',
	phone: '',
	verCode: '',
	checked: false,
};

const FORM_RULES: Record<string, FormRule[]> = {
	name: [
		{ required: true, message: '"账号"是必填项' },
		{ whitespace: true, message: '账号"不能为空' },
		// { min: 3, message: '"账号"需至少3个字符(1个汉字是2个字符)', type: 'error', trigger: 'blur' },
	],
	password: [{ required: true, message: '"密码"是必填项', type: 'error' }],
	phone: [{ required: true, message: '"手机号"是必填项', type: 'error' }],
	verCode: [{ required: true, message: '"验证码"是必填项', type: 'error' }],
};

const type = ref('password');

const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);

const [countDown, handleCounter] = useCounter(180);

// 对于密码为空的 必须短信登陆。服务器端检查 并返回消息
const switchType = (val: string) => {
	type.value = val;
};

const onSendVCode = () => {
	if (countDown.value <= 0) {
		sendVerifyCode(formData.value.phone, true, () => {
			handleCounter();
		});
	}
};

const onSubmit = async (ctx) => {
	const { validateResult } = ctx;

	if (validateResult === true) {
		if (type.value === 'password') formData.value.phone = '';
		else formData.value.name = '';

		await authStore.login(formData.value);
	}
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
