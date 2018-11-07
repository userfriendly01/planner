import { TOGGLE_DRAWER, TOGGLE_MOBILE_DRAWER } from "../actions/actionTypes";

const initialState = {
  drawerOpen: false,
  mobileDrawerOpen: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DRAWER: {
      return {
        ...state,
        drawerOpen: !state.drawerOpen
      };
    };
    case TOGGLE_MOBILE_DRAWER: {
      return {
        ...state,
        mobileDrawerOpen: !state.mobileDrawerOpen
      };
    };
    default:
      return state;
  }
}
