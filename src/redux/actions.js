import { TOGGLE_DRAWER } from "./actionTypes";

export const toggleDrawer = state => ({
  type: TOGGLE_DRAWER,
  payload: {
    drawerState: state
  }
});
