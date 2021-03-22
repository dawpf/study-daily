
export const NUM = 'NUM'

/**
 * 累加数据
 * @param {*} obj 
 */
export const addNum = obj => {
	return {
		type: NUM,
		payload: obj
	};
};
