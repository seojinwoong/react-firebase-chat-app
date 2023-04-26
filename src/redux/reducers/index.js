import { combineReducers } from "redux";
import user_reducer from './user_reducer';
import chatRoom_reducer from './chatRoom_reducer';

const rootReducer = combineReducers({
    user_reducer,
    chatRoom_reducer
});

export default rootReducer;
