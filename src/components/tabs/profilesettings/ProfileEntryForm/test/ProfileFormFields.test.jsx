import ProfileFormFields from "../ProfileFormFields";
import {
  FormControlLabel,
  Switch,
  Tooltip
} from "@mui/material";
import {
  profileEntryFormDispatch,
  profileEntryFormState
} from "context";
import {
  OverflowSkillTextField,
  ProfileActivitiesSelectField,
  ProfileCallTagsSelectField,
  ProfileNameTextField,
  ProfileOperatingUnitField,
  ProfileQueuesSelectField,
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
import { ToggleContainer } from "../ProfileEntryForm.Styles";

jest.mock("components", () => ({
  __esModule: true,
  ProfileNameTextField: jest.fn(),
  ProfileActivitiesSelectField: jest.fn(),
  ProfileOperatingUnitField: jest.fn(),
  ProfileQueuesSelectField: jest.fn(),
  ProfileCallTagsSelectField: jest.fn(),
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
  Switch: jest.fn(),
  Tooltip: jest.fn()
}));

const mockSetForm = jest.fn();

describe("<ProfileFormFields />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ProfileNameTextField,
      ProfileActivitiesSelectField,
      ProfileCallTagsSelectField,
      ProfileOperatingUnitField,
      ProfileQueuesSelectField,
      OverflowSkillTextField,
      FormControlLabel,
      Switch,
      Tooltip,
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
      expectMockedComponent(rendered, { FormControlLabel }, 12);
      expect(rendered.container).toHaveTextContent(/^ProfileNameTextField/i);
      expectMockedComponent(rendered, { OverflowSkillTextField });
      expectMockedComponent(rendered, { ProfileActivitiesSelectField });
      expectMockedComponent(rendered, { ProfileOperatingUnitField });
      expectMockedComponent(rendered, { ProfileQueuesSelectField });
      expectMockedComponent(rendered, { ProfileCallTagsSelectField });
      expectMockedComponent(rendered, { Tooltip }, 1);
    });
    test("Few switch are on by default, like auto answered", () => {
      renderComponent();
      render(FormControlLabel.mock.calls[6][0].control);
      render(FormControlLabel.mock.calls[1][0].control);
      expect(Switch.mock.calls[0][0].checked).toBe(true);
      expect(Switch.mock.calls[1][0].checked).toBe(false);
    });
    test.only("Disabled self serevice indicator switch with correct tooltip", () => {
      renderComponent();
      render(Tooltip.mock.calls[0][0].children);
      render(FormControlLabel.mock.calls[7][0].control);
      expect(Tooltip.mock.calls[0][0].title).toBe("Self service indicator is applicable to profiles with an id of 39 and above, but is actually set at the worker attribute level");
      // how to get this to work
      //expect(renderedTooltip.container).toBe("true");
      // expect(Switch.mock.calls[0][0].disabled).toBe(true);
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
    test("When callTag dropdown value is selected, setForm is called", () => {
      renderComponent();
      act(() => {
        const setCallTagsList = ProfileCallTagsSelectField.mock.calls[0][0].setCallTagsList;
        setCallTagsList();
      });
      expect(mockSetForm).toHaveBeenCalledTimes(1);
    });
    test("When ou dropdown value is selected, setForm is called", () => {
      renderComponent();
      act(() => {
        const setOperatingUnit = ProfileOperatingUnitField.mock.calls[0][0].setOperatingUnit;
        setOperatingUnit();
      });
      expect(mockSetForm).toHaveBeenCalledTimes(1);
    });
  });
});
