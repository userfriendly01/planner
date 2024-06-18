// Our Boy Kent C https://kentcdodds.com/blog/how-to-use-react-context-effectively
import {
  initialProfileEntryFormState,
  profileEntryFormReducer
} from "context/profileEntryFormReducer";
import {
  initialState,
  reducer
} from "context/reducer";
import {
  initialUserFormState,
  userFormReducer
} from "context/userFormReducer";
import {
  initialSkillState,
  skillReducer
} from "context/reducers/skillReducer";
import {
  Action,
  AppState
} from "globals/interfaces";
import { UserFormState } from "components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import React, { ReactElement } from "react";
import { ProfileEntryFormState } from "components/tabs/orgmanagement/triton/ProfileEntryForm/ProfileEntryForm.Interfaces";
import { SkillState } from "callflowmanagement/Skills.Interfaces";

const StateContext = React.createContext(undefined);
const DispatchContext = React.createContext(undefined);
const FormStateContext = React.createContext(undefined);
const FormDispatchContext = React.createContext(undefined);
const ProfileEntryStateContext = React.createContext(undefined);
const ProfileEntryDispatchContext = React.createContext(undefined);
const SkillStateContext = React.createContext(undefined);
const SkillDispatchContext = React.createContext(undefined);

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

interface SkillStateProviderProps {
  children: ReactElement
}
const SkillStateProvider = (props: SkillStateProviderProps) => {
  const [state, dispatch] = React.useReducer(skillReducer, initialSkillState);
  return (
    <SkillStateContext.Provider value={state}>
      <SkillDispatchContext.Provider value={dispatch}>
        {props.children}
      </SkillDispatchContext.Provider>
    </SkillStateContext.Provider>
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

const useSkillState = (): SkillState => {
  const context: any = React.useContext(SkillStateContext);
  if (context === undefined) {
    throw new Error("SkillStateContext must be used within a Context Provider");
  }
  return context;
};

const useSkillDispatch = (): (action: Action) => VoidFunction => {
  const context: (action: Action) => VoidFunction = React.useContext(SkillDispatchContext);
  if (context === undefined) {
    throw new Error("SkillDispatchContext must be used within a Context Provider");
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
  ProfileEntryFormStateProvider,
  SkillStateProvider,
  useSkillState,
  useSkillDispatch
};