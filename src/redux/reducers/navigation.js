import { TOGGLE_DRAWER } from "../actionTypes";

const initialState = {
  drawerOpen: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DRAWER: {
      return {
        ...state,
        drawerOpen: !state.drawerOpen
      };
    }
    default:
      return state;
  }
}
