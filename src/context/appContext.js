// Our Boy Kent C https://kentcdodds.com/blog/how-to-use-react-context-effectively
import {
  initialState,
  reducer
} from "context";
import PropTypes from "prop-types";
import React from "react";

export const DispatchContext = React.createContext();
export const StateContext = React.createContext();

const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

StateProvider.propTypes = {
  children: PropTypes.any
};

const useAdminDispatch = () => {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("DispatchContext must be used within a Context Provider");
  }
  return context;
};

const useAdminState = () => {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error("StateContext must be used within a Context Provider");
  }
  return context;
};

export {
  StateProvider,
  useAdminDispatch,
  useAdminState
};