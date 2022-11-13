// Our Boy Kent C https://kentcdodds.com/blog/how-to-use-react-context-effectively
import {
  initialState,
  reducer,
  initialUserFormState,
  userFormReducer,
  initialProfileEntryFormState,
  profileEntryFormReducer
} from "context";
import {
  Action,
  AppState
} from "globals";
import { UserFormState } from "components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper.Interfaces";
import React, { ReactElement } from "react";
import { ProfileEntryFormState } from "components/tabs/profilesettings/ProfileEntryForm/ProfileEntryForm.Interfaces";

export const StateContext = React.createContext(undefined);
export const DispatchContext = React.createContext(undefined);
export const FormStateContext = React.createContext(undefined);
export const FormDispatchContext = React.createContext(undefined);
export const ProfileEntryStateContext = React.createContext(undefined);
export const ProfileEntryDispatchContext = React.createContext(undefined);

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

interface ProfileEntryFormStateProviderProps {
  children: ReactElement
}
const ProfileEntryFormStateProvider = (props: ProfileEntryFormStateProviderProps) => {
  const [state, dispatch] = React.useReducer(profileEntryFormReducer, initialProfileEntryFormState);
  return (
    <ProfileEntryStateContext.Provider value={state}>
      <ProfileEntryDispatchContext.Provider value={dispatch}>
        {props.children}
      </ProfileEntryDispatchContext.Provider>
    </ProfileEntryStateContext.Provider>
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

const profileEntryFormState = (): ProfileEntryFormState => {
  const context: ProfileEntryFormState = React.useContext(ProfileEntryStateContext);
  if (context === undefined) {
    throw new Error("ProfileEntryStateContext must be used within a Context Provider");
  }
  return context;
};

const profileEntryFormDispatch = (): (action: Action) => VoidFunction => {
  const context: (action: Action) => VoidFunction = React.useContext(ProfileEntryDispatchContext);
  if (context === undefined) {
    throw new Error("ProfileEntryDispatchContext must be used within a Context Provider");
  }
  return context;
};

export {
  StateProvider,
  FormStateProvider,
  useAdminDispatch,
  useAdminState,
  useFormState,
  useFormDispatch,
  profileEntryFormState,
  profileEntryFormDispatch,
  ProfileEntryFormStateProvider
};