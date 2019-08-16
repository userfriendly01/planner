// https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
import PropTypes from "prop-types";
import React, {
  createContext,
  useContext,
  useReducer
} from "react";

export const StateContext = createContext();

export const StateProvider = ({
  reducer,
  initialState,
  children
}) =>(
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

StateProvider.propTypes = {
  children: PropTypes.object,
  initialState: PropTypes.object,
  reducer: PropTypes.func
};

export const useStateValue = () => useContext(StateContext);