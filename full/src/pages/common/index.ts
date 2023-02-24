import { MessagePlugin } from 'tdesign-vue-next';
import { request } from '@/utils/request';
import { useAuthStore } from '@/store';

const authStore = useAuthStore();

export const sendVerifyCode = (phone: string, log: boolean, success: Function) => {
	if (!/^1\d{10}$/.test(phone)) {
		MessagePlugin.warning(`手机号码格式不正确！`);
		return;
	}

	request
		.post({
			url: '/auth/send-vcode',
			data: { phone, log },
		})
		.then((data) => {
			MessagePlugin.info('验证码已发送到您手机，请查收后填写到"验证码"');
			if (success) success(data);
		});
};

export const isValidPwd = (value: string, showErr = true) => {
	if (/^[\S]{5,12}$/.test(value)) {
		return true;
	}

	if (showErr) MessagePlugin.warning(`密码必须5到12位，且不能包含空格！`);
	return false;
};

// data为数组类型，并且每个元素必须包含 id、name 两个属性, name->label, id->value
export const genOptions = (data) => {
	const opts = [];
	if (data && data.length > 0) {
		for (let i = 0; i < data.length; i++) {
			opts.push({ label: data[i].name, value: data[i].id });
		}
	}
	return opts;
};

// 下载指定uri的文件，uri不是全url、同时不带api前缀
export const downloadUri = (uri: string) => {
	const { user, token, project } = authStore;
	const qry = `userId=${user ? user.id : ''}&projectId=${project ? project.id : ''}&token=${token || ''}`;

	let isNew = false;
	let aElem = document.getElementById('download-file') as HTMLAnchorElement | null;
	if (!aElem) {
		aElem = document.createElement('a');
		isNew = true;
	}

	if (aElem !== null) {
		const n = uri.indexOf('?');

		aElem.href = `/api${uri}${n > 0 ? '&' : '?'}${qry}`;
		aElem.click();
		if (isNew) aElem.remove();
	}
};
