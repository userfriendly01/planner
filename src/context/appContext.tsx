// Our Boy Kent C https://kentcdodds.com/blog/how-to-use-react-context-effectively
import {
  Action,
  AppState,
  initialState,
  reducer
} from "context";
import PropTypes from "prop-types";
import React, { ReactElement } from "react";

export const DispatchContext = React.createContext(undefined);
export const StateContext = React.createContext(undefined);

interface StateProviderProps {
  children: ReactElement
}
const StateProvider = (props: StateProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {props.children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

StateProvider.propTypes = {
  children: PropTypes.any
};

const useAdminDispatch = (): (action: Action) => VoidFunction => {
  const context: (action: Action) => VoidFunction = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("DispatchContext must be used within a Context Provider");
  }
  return context;
};

const useAdminState = (): AppState => {
  const context: AppState = React.useContext(StateContext);
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