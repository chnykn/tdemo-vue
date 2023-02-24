import { defineStore } from 'pinia';

const state = {
	pageHeight: 0, // 页面总体高度
	validHeight: 0, // 页面有效高度（可用区域）

	pageParams: null, // 用于页面之间传递参数
};

export const useGlobalStore = defineStore('global', {
	state: () => state,
	getters: {},
	actions: {
		updateVaidHeight() {
			// header's height 56, t-layout's t-content's padding-top is 5px;
			this.pageHeight = document.documentElement.clientHeight - 62; // 56 + 5 + 1(需要多减至少1个像素)

			// t-layout's t-content 最外部应该使用 .container，减去上下的padding 8*2
			// 页面最上部位一般都有工具条，占据了32像素，所以应该减去 48 = 8*2 + 32
			this.validHeight = this.pageHeight - 48;
		},
	},
	persist: false,
});
