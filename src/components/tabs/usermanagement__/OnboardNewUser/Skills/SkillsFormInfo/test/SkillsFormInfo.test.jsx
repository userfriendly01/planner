import { SkillsFormInfo } from "../SkillsFormInfo";
import { DefaultSkillSelector } from "usermanagement/DefaultSkillSelector";
import {
  useFormState, useFormDispatch
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import React from "react";
import {
  act,
  render,
  setupMockedComponents,
  initialFormState
} from "testUtils";

jest.useFakeTimers();

jest.mock("usermanagement/DefaultSkillSelector", () => ({
  DefaultSkillSelector: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useFormState: jest.fn(),
  useFormDispatch: jest.fn()
}));

const mockSetForm = jest.fn();
const defaultSkills = {
  levels: {
    "a": 1,
    "b": 3
  },
  skills: ["a", "b", "c"]
};

const formState = {
  ...initialFormState,
  triton: {
    defaultSkills
  }
};

describe("<SkillsFormInfo />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    useFormDispatch.mockReturnValue(mockSetForm);
    useFormState.mockReturnValue(formState);
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