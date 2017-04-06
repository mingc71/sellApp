/*
 *存储
 *id: 序号
 *key: 关键字
 *value: 内容
*/
export function saveToLocal(id, key, value) {
	/* 设置一个默认字段 */
	let seller = window.localStorage.__seller__;
	if (!seller) {
		/* 没有seller时 */
		seller = {};
		seller[id] = {};
	} else {
		seller = JSON.parse(seller);
		if (!seller[id]) {
			seller[id] = {};
		}
	}
	/* 赋值 */
	seller[id][key] = value;
	window.localStorage.__seller__ = JSON.stringify(seller);
};
/*
 *读取
 *id: 序号
 *key: 关键字
 *value: 没有读取到时，默认值
*/

export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__seller__;
	if (!seller) {
		return def;
	}
	seller = JSON.parse(seller)[id];
	if (!seller) {
		return def;
	}
	let ret = seller[key];
	return ret || def;
};
