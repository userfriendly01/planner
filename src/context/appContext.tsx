// Our Boy Kent C https://kentcdodds.com/blog/how-to-use-react-context-effectively
import {
  initialState,
  reducer,
  initialUserFormState,
  userFormReducer
} from "context";
import {
  Action,
  AppState
} from "globals";
import {
  UserFormState
} from "components/usermanagement/UserEntryForm/UserEntryForm.Interfaces";
import React, { ReactElement } from "react";

export const StateContext = React.createContext(undefined);
export const DispatchContext = React.createContext(undefined);
export const FormStateContext = React.createContext(undefined);
export const FormDispatchContext = React.createContext(undefined);

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

interface FormStateProviderProps {
  children: ReactElement
}
const FormStateProvider = (props: FormStateProviderProps) => {
  const [state, dispatch] = React.useReducer(userFormReducer, initialUserFormState);
  return (
    <FormStateContext.Provider value={state}>
      <FormDispatchContext.Provider value={dispatch}>
        {props.children}
      </FormDispatchContext.Provider>
    </FormStateContext.Provider>
  );
};

const useFormState = (): UserFormState => {
  const context: UserFormState = React.useContext(FormStateContext);
  if (context === undefined) {
    throw new Error("FormStateContext must be used within a Context Provider");
  }
  return context;
};

const useFormDispatch = (): (action: Action) => VoidFunction => {
  const context: (action: Action) => VoidFunction = React.useContext(FormDispatchContext);
  if (context === undefined) {
    throw new Error("FormDispatchContext must be used within a Context Provider");
  }
  return context;
};

export {
  StateProvider,
  FormStateProvider,
  useAdminDispatch,
  useAdminState,
  useFormState,
  useFormDispatch
};