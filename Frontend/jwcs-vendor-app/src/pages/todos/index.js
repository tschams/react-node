import { TodoListPage } from "./TodoListPage";
import { TodoEditPage } from "./TodoEditPage";

const roles = ["manager"];

export const TodoPages = {
  edit: {
    anon: false,
    roles,
    path: "/todos/:id",
    title: "Todo",
    type: "PAGE_TODO_EDIT",
    view: TodoEditPage,
  },
  list: {
    anon: false,
    roles,
    path: "/todos",
    title: "Todos",
    type: "PAGE_TODO_LIST",
    view: TodoListPage,
  },
};
export default TodoPages;

export const TodoArea = {
  pages: TodoPages,
};
