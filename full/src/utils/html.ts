// dom元素是否包含某个class
export const elemHasClass = (elem, className) => {
	const reg = new RegExp(`(^|\\s)${className}(\\s|$)`);
	return reg.test(elem.className);
};

// dom元素增加某个class
export const elemAddClass = (elem, className) => {
	if (elemHasClass(elem, className)) {
		return;
	}
	const newClass = elem.className.split(' ');
	newClass.push(className);
	elem.className = newClass.join(' ');
};

// dom元素删除某个class
export const elemRemoveClass = (elem, className) => {
	let classes = elem.getAttribute('class');
	classes = classes.replace(className, '');
	elem.setAttribute('class', classes);
};

export const convertBase64UrlToBlob = (urlData, type) => {
	const bytes = window.atob(urlData.split(',')[1]); // 去掉url的头，并转换为byte

	// 处理异常,将ascii码小于0的转换为大于0
	const ab = new ArrayBuffer(bytes.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}

	return new Blob([ab], { type });
};
