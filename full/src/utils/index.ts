// 文件大小从字节数，转为更具可读性字符串
export const fileSizeDesc = (fileByte) => {
	const fileSizeByte = fileByte;
	let fileSizeMsg = '';
	if (fileSizeByte < 1048576) fileSizeMsg = `${(fileSizeByte / 1024).toFixed(2)}KB`;
	else if (fileSizeByte === 1048576) fileSizeMsg = '1MB';
	else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824)
		fileSizeMsg = `${(fileSizeByte / (1024 * 1024)).toFixed(2)}MB`;
	else if (fileSizeByte > 1048576 && fileSizeByte === 1073741824) fileSizeMsg = '1GB';
	else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776)
		fileSizeMsg = `${(fileSizeByte / (1024 * 1024 * 1024)).toFixed(2)}GB`;
	else fileSizeMsg = '文件超过1TB';
	return fileSizeMsg;
};

// 删除enhanced-table中的节点，并且检查父节点如果已经没有子节点的话，
// 为了让父节点显示目录的图标， 把父节点children设置为true
export const deleteNodeEx = (table, row) => {
	const rowId = row.id;
	const { parentId } = row;

	setTimeout(() => {
		table.value.remove(rowId);

		const parentData = table.value.getData(parentId);
		const parentRow = parentData.row;

		if (parentRow.children instanceof Array && parentRow.children.length <= 0) {
			parentRow.children = true;
			table.value.setData(parentId, parentRow);
		}
	}, 100);
};

/*
export const genUUID = () => {
	// const arr = [];
	// const hexDigits = '0123456789abcdef';
	// for (let i = 0; i < 36; i++) {
	// 	const n = Math.floor(Math.random() * 0x10);
	// 	arr[i] = hexDigits.slice(n, n + 1);
	// }

	// arr[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010

	// // eslint-disable-next-line no-bitwise
	// const n = (arr[19] & 0x3) | 0x8;
	// arr[19] = hexDigits.slice(n, n + 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

	// // eslint-disable-next-line no-multi-assign
	// arr[8] = arr[13] = arr[18] = arr[23] = '-';

	// return arr.join('');

	return crypto.randomUUID();
};
*/

export const indexOfArray = (arr, val) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === val) return i;
	}
	return -1;
};
