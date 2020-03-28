import { authGet, authPut, authPost } from "../../lib";
import { UIActions } from "../ui/actions";

const type = {
  TODO_ITEM_UPDATED: "TODO_ITEM_UPDATED",
  TODO_ITEMS_ADDED: "TODO_ITEMS_ADDED",
  TODO_ITEMS_LOADED: "TODO_ITEMS_LOADED",
};

export const TodoActions = {
  type,

  addItem(newItem) {
    return async (dispatch, getState) => {
      dispatch(UIActions.setUILoading(true));
      const response = await authPost("/todos", {
        title: newItem.title,
        done: newItem.done,
      });
      const {
        data: { item },
      } = response;
      // Put item returned from server into the TodoState.
      dispatch(TodoActions.addedItems([item]));
      dispatch(UIActions.setUILoading(false));
    };
  },

  addedItems(items) {
    return { type: type.TODO_ITEMS_ADDED, items };
  },

  getItemById(id) {
    return async dispatch => {
      dispatch(UIActions.setUILoading(true));

      const response = await authGet(`/todos/${id}`);
      // TODO: Error handling...
      const {
        data: { item },
      } = response;
      dispatch(UIActions.setUILoading(false));
      return {
        item,
      };
    };
  },

  loadedItems(items) {
    return { type: type.TODO_ITEMS_LOADED, items };
  },

  saveItem(item) {
    if (item.id === 0) {
      return TodoActions.addItem(item);
    }
    return TodoActions.updateItem(item);
  },

  searchItems({ title } = {}) {
    return async dispatch => {
      dispatch(UIActions.setUILoading(true));

      const response = await authGet([
        "/todos",
        {
          title,
        },
      ]);
      // TODO: Error handling...
      const {
        data: { items },
      } = response;
      dispatch(TodoActions.loadedItems(items));
      dispatch(UIActions.setUILoading(false));
    };
  },

  toggleItemDone(id) {
    return (dispatch, getState) => {
      const {
        todo: { items },
      } = getState();
      const item = items.find(it => it.id === id);
      console.log("FOUND: ", item);
      return dispatch(
        TodoActions.updateItem({
          ...item,
          done: !item.done,
        }),
      );
    };
  },

  updateItem({ id, title, done, concurrencyStamp }) {
    return async dispatch => {
      dispatch(UIActions.setUILoading(true));

      const response = await authPut(`/todos/${id}`, {
        title,
        done,
        concurrencyStamp,
      });
      const {
        data: { item },
      } = response;

      // Load new item from server into the TodoState.
      dispatch(TodoActions.updatedItem(item));
      dispatch(UIActions.setUILoading(false));
    };
  },

  updatedItem(item) {
    return { type: type.TODO_ITEM_UPDATED, item };
  },
};
