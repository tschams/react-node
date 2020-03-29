import { AuthActions } from "../auth/actions";
import { PrefActions } from "./actions";
/**
 * Preferences state (**persisted**).
 * @example
 * {
 *    dialogEdit: true,
 * }
 */
export const PrefState = {
  name: "prefs",
  persist: true,
  defaults: {
    dialogEdit: true,
    navOpen: window.innerWidth >= 960 ? true : false,
  },
  handlers: {
    [AuthActions.type.LOGOUT_SUCCESS](state, action) {
      return PrefState.defaults;
    },
    [PrefActions.type.PREFS_DIALOGEDIT_TOGGLE](state, { type, ...prefs }) {
      return {
        ...state,
        dialogEdit: !state.dialogEdit,
      };
    },
    [PrefActions.type.PREFS_OPENNAV_TOGGLE](state, { type, ...prefs }) {
      return {
        ...state,
        navOpen: !state.navOpen,
      };
    },
    [PrefActions.type.PREFS_UPDATE](state, { type, ...prefs }) {
      return {
        ...state,
        ...prefs,
      };
    },
  },
};
