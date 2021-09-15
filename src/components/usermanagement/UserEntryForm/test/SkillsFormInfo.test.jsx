import SkillsFormInfo from "../SkillsFormInfo";
import { DefaultSkillSelector } from "components";
import {
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import { formModes } from "globals";
import React from "react";
import {
  act,
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  DefaultSkillSelector: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useFormState: jest.fn(),
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions
}));

const mockSetForm = jest.fn();
const defaultSkills = {
  levels: {
    "a": 1,
    "b": 3
  },
  skills: ["a", "b", "c"]
};

const initialFormState = {
  formMode: formModes.INSERT,
  defaultSkills,
  defaultSkillsUpdated: false,
  didUser: false,
  extension: {
    value: "",
    blurred: false,
    updated: false,
    valid: false
  },
  inactiveForwardTo: {
    value: null,
    updated: false
  },
  manager: {
    value: "",
    blurred: false,
    updated: false
  },
  nNumber: {
    value: "n",
    blurred: false,
    updated: false
  },
  nNumberFetchedUser: null,
  outgoing: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  profileId: {
    value: "",
    blurred: false,
    updated: false
  },
  alternateDid: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  directDialNum: {
    value: "",
    blurred: false,
    e164: undefined,
    updated: false,
    valid: false
  },
  zeroOutEnabled: false,
  zeroOutEnabledUpdated: false,
  editDisabled: false
};

describe("<SkillsFormInfo />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue(initialFormState);
    setupMockedComponents({
      DefaultSkillSelector
    });
  });

  const renderComponent = () => {
    return render(
      <SkillsFormInfo/>
    );
  };

  test("Should render the correct initial state", () => {
    renderComponent();
    expect(DefaultSkillSelector.mock.calls.length).toBe(1);
    expect(DefaultSkillSelector.mock.calls[0][0].defaultSkills).toBe(defaultSkills);
  });
  test("When setDefaultSkills is clicked, setForm is called", () => {
    renderComponent();
    const updatedDefaultSkills = {
      levels: {
        ...defaultSkills.levels,
        "newSkill": 2
      },
      skills: [...defaultSkills.skills, "newSkill"]
    };
    act(() => {
      const setDefaultSkills = DefaultSkillSelector.mock.calls[0][0].setDefaultSkills;
      setDefaultSkills(updatedDefaultSkills);
    });

    expect(mockSetForm).toBeCalledTimes(1);
    expect(mockSetForm).toBeCalledWith({
      type: userFormActions.UPDATE_DEFAULT_SKILLS,
      payload: updatedDefaultSkills
    });
  });
});