import { createStore} from "redux";
import reducers from "../reudcers";

const store = createStore(reducers);
export default store;
