<template>
	<t-form
		ref="form"
		:class="['item-container']"
		:data="formData"
		:rules="FORM_RULES"
		label-width="0"
		@submit="onSubmit"
	>
		<t-form-item name="name">
			<t-input
				v-model="formData.name"
				:maxlength="11"
				size="large"
				placeholder="请输入账号名，可以汉字、英文、数字"
			>
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

		<t-form-item name="phone">
			<t-input v-model="formData.phone" :maxlength="11" size="large" placeholder="请输入手机号">
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

		<t-form-item>
			<t-button block size="large" type="submit"> 注册 </t-button>
		</t-form-item>
	</t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessagePlugin, FormRule } from 'tdesign-vue-next';
import { UserIcon, LockOnIcon, MobileIcon } from 'tdesign-icons-vue-next';

import { useCounter } from '@/hooks';
import { request } from '@/utils/request';
import { isValidPwd, sendVerifyCode } from '@/pages/common';

const INITIAL_DATA = {
	name: '',
	password: '',
	phone: '',
	verCode: '',
	// email: '',
};

const FORM_RULES: Record<string, FormRule[]> = {
	name: [
		{ required: true, message: '"账号"是必填项' },
		{ whitespace: true, message: '账号"不能为空' },
		{ min: 3, message: '"账号"需至少3个字符(1个汉字是2个字符)', type: 'error', trigger: 'blur' },
	],
	password: [{ required: true, message: '"密码"是必填项', type: 'error' }],
	phone: [{ required: true, message: '"手机号"是必填项', type: 'error' }],
	verCode: [{ required: true, message: '"验证码"是必填项', type: 'error' }],
	// email: [
	// 	{ required: true, message: '邮箱必填', type: 'error' },
	// 	{ email: true, message: '请输入正确的邮箱', type: 'warning' },
	// ],
};

const form = ref();
const formData = ref({ ...INITIAL_DATA });

const showPsw = ref(false);
const [countDown, handleCounter] = useCounter(180);

const emit = defineEmits(['register-success']);

const registerUser = (userInfo: Record<string, unknown>, success: Function) => {
	request
		.post({
			url: '/user/register',
			data: userInfo,
		})
		.then(() => {
			MessagePlugin.info('用户注册成功');
			if (success) success();
		});
};

let realVerCode = null;
const onSendVCode = () => {
	if (countDown.value <= 0) {
		sendVerifyCode(formData.value.phone, false, (data) => {
			realVerCode = data;
			handleCounter();
		});
	}
};

const onSubmit = (ctx) => {
	const { validateResult, firstError } = ctx;

	if (validateResult === true) {
		if (!isValidPwd(formData.value.password)) return;

		if (formData.value.verCode !== realVerCode) {
			MessagePlugin.warning('"短信验证码"不正确，请重新输入！');
			return;
		}

		registerUser(formData.value, () => {
			emit('register-success');
		});
	} else {
		MessagePlugin.warning(firstError);
	}
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
