export const PrefSelectors = {
  dialogEdit(state) {
    return !!state.prefs?.dialogEdit;
  },
  navOpen(state) {
    return !!state.prefs?.navOpen;
  },
};
