import {ADD_TODO} from "./mutation-types";

export default{
    //  添加一个记录
    addTodo ({commit},row){
        commit(ADD_TODO,{row})
    }
}
