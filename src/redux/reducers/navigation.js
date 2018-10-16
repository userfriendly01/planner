import { TOGGLE_DRAWER } from "../actionTypes";

const initialState = {
  drawerOpen: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DRAWER: {
      const { drawerState } = action.payload;
      return {
        ...state,
        drawerOpen: drawerState
      };
    }
    default:
      return state;
  }
}
