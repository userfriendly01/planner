import ProfileFormFields from "../ProfileFormFields";
import {
  FormControlLabel,
  Switch
} from "@mui/material";
import {
  profileEntryFormDispatch,
  profileEntryFormState
} from "context";
import {
  ProfileNameTextField,
  ProfileActivitiesSelectField,
  OverflowSkillTextField,
  StyledButton
} from "components";
import {
  act,
  expectMockedComponent,
  render,
  setupMockedComponents,
  initialProfileEntryFormState,
  initialTestState
} from "testUtils";
import React from "react";

jest.mock("components", () => ({
  __esModule: true,
  ProfileNameTextField: jest.fn(),
  ProfileActivitiesSelectField: jest.fn(),
  OverflowSkillTextField: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  profileEntryFormState: jest.fn(),
  profileEntryFormDispatch: jest.fn()
}));

jest.mock("@mui/material", () => ({
  FormControlLabel: jest.fn(),
  Switch: jest.fn()
}));

const mockSetForm = jest.fn();

describe("<ProfileFormFields />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ProfileNameTextField,
      ProfileActivitiesSelectField,
      OverflowSkillTextField,
      FormControlLabel,
      Switch,
      StyledButton
    });
    profileEntryFormDispatch.mockReturnValue(mockSetForm);
    profileEntryFormState.mockReturnValue(initialProfileEntryFormState);
  });

  const renderComponent = () => {
    return render(
      <ProfileFormFields />, initialTestState
    );
  };

  describe("Initial State", () => {
    test("Should render the correct initial state", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { ProfileNameTextField });
      expectMockedComponent(rendered, { FormControlLabel }, 11);
      expect(rendered.container).toHaveTextContent(/^ProfileNameTextField/i);
      expectMockedComponent(rendered, { OverflowSkillTextField });
      expectMockedComponent(rendered, { ProfileActivitiesSelectField });
    });
    test("Few switch are on by default, like auto answered", () => {
      renderComponent();
      render(FormControlLabel.mock.calls[6][0].control);
      render(FormControlLabel.mock.calls[1][0].control);
      expect(Switch.mock.calls[0][0].checked).toBe(true);
      expect(Switch.mock.calls[1][0].checked).toBe(false);
    });
  });

  describe("child component interactions", () => {
    test("When switch is toggled, setForm is called", () => {
      renderComponent();
      render(FormControlLabel.mock.calls[0][0].control);  // left six switches
      render(FormControlLabel.mock.calls[6][0].control);  // right five switches
      act(() => {
        const onChange1 = Switch.mock.calls[0][0].onChange;
        onChange1();
        const onChange2 = Switch.mock.calls[1][0].onChange;
        onChange2();
      });
      expect(mockSetForm).toHaveBeenCalledTimes(2);
    });
    test("When activity dropdown value is selected, setForm is called", () => {
      renderComponent();
      act(() => {
        const setActivitiesList = ProfileActivitiesSelectField.mock.calls[0][0].setActivitiesList;
        setActivitiesList();
      });
      expect(mockSetForm).toHaveBeenCalledTimes(1);
    });
  });
});
