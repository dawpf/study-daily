
import { NUM } from "../../actions/user";

// 初始化数据
const INITIAL_STATE = {
  NUM:0
};

// 数据处理函数
export default function userDataHandler(state = INITIAL_STATE, action) {
	const payload = action.payload;

	switch (action.type) {
		case NUM:
			return {
				...state,
				NUM: state.NUM + payload
			};

		default:
			return state;
	}
}
