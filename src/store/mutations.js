import {ADD_TODO} from "./mutation-types";

export default {
    [ADD_TODO](state,{row}){
        state.list=row
    }
}
