// 通用请求头
export enum ContentTypeEnum {
	Json = 'application/json;charset=UTF-8',
	FormURLEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
	FormData = 'multipart/form-data;charset=UTF-8',
}

// 通知的优先级对应的TAG类型
export const NOTIFICATION_TYPES = {
	low: 'primary',
	middle: 'warning',
	high: 'danger',
};
