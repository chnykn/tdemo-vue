import { defineStore } from 'pinia';
import { MessagePlugin } from 'tdesign-vue-next';

import { PROJECT_ID, TOKEN_NAME } from '@/config';
import router from '@/router';
import { request } from '@/utils/request';

const rankSuper = 3; // 系统管理员： 拥有所有权限
const rankAdmin = 2; // 管理员： 拥有所有权限，除了其他管理员用户的管理
const rankVIP = 1; // 高级用户：可以创建项目
// const rankNorm = 0; // 普通用户： 根据角色设置其权限

const state = {
	// login 之后同时获取token和user
	token: localStorage.getItem(TOKEN_NAME), // main_token 默认token
	user: null, // 用户本身的信息

	// setProject 之后，从服务器获取project针对user对应的member，以member的所有权限code（perms）
	project: null,
	member: null, // 针对某个项目的成员信息
	perms: [],

	// getAuthVal 之后，用于记录执行后的结果。用于下一次执行是否变化的对比
	auths: -1,
};

export const useAuthStore = defineStore('auth', {
	state: () => state,

	getters: {
		jwtToken: (state) => {
			return state.token;
		},
		projectId: (state) => {
			return state.project ? state.project.id : '';
		},
	},

	actions: {
		async login(userInfo: Record<string, unknown>) {
			request
				.post({
					url: '/auth/login',
					data: userInfo,
				})
				.then((data) => {
					this.user = data.user;
					this.token = data.token;
					localStorage.setItem(TOKEN_NAME, this.token);

					MessagePlugin.success('登陆成功');
					router.push({ path: '/' });
				});
		},

		setProject(value, sucess) {
			this.project = value;
			if (this.project) {
				localStorage.setItem(PROJECT_ID, this.project.id);
				this.update(sucess);
			} else {
				localStorage.removeItem(PROJECT_ID);
				this.member = null;
				this.project = null;
				this.perms = [];
				if (sucess) sucess();
			}
		},

		getAuthVal() {
			if (this.user == null) {
				return null;
			}

			let value = 0;

			// 如果有选中项目
			if (this.member != null) {
				// eslint-disable-next-line no-bitwise
				value |= 1;

				// 如果是项目管理员 或 VIP用户 || this.user.rank >= rankVIP
				if (this.member.isAdmin) {
					// eslint-disable-next-line no-bitwise
					value |= 2;
				}
			}

			// 如果是VIP
			if (this.user.rank === rankVIP) {
				// eslint-disable-next-line no-bitwise
				value |= 4; // +4
			}

			// 如果是系统管理员
			if (this.user.rank === rankAdmin) {
				// eslint-disable-next-line no-bitwise
				value |= 12; // +8  (8 | 4) = 12
			}

			// 如果是超级管理员
			if (this.user.rank === rankSuper) {
				// eslint-disable-next-line no-bitwise
				value |= 28; // +16  (16 | 8 | 4) = 28
			}

			let changed = false;
			if (this.auths !== value) {
				changed = true;
				this.auths = value;
			}

			return { changed, value };
		},

		logout() {
			localStorage.removeItem(TOKEN_NAME);
			localStorage.removeItem(PROJECT_ID);
			this.clear();
		},

		clear() {
			this.token = null;
			this.user = null;
			this.member = null;
			this.project = null;
			this.perms = [];
			this.auths = -1;
		},

		// 从服务器更新user、member 等信息
		async update(sucess) {
			if (!this.token) {
				this.clear();
				return;
			}

			const projectId = localStorage.getItem(PROJECT_ID);

			await request
				.get({
					url: `/auth/info?projectId=${projectId || 'null'}`,
				})
				.then((data) => {
					this.user = data.user;
					this.member = data.member;
					this.project = data.project;
					this.perms = data.perms;

					if (!this.project) localStorage.removeItem(PROJECT_ID);
					if (sucess) sucess();
				});
		},
	},
	persist: false,
});
