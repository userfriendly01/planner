import React from "react";
import { CallflowSkillForm }from "../CallflowSkillForm";
import {
  initialSkillState,
  render,
  setupMockedComponents
} from "testUtils";
import { Dropdown } from "components/Dropdown";
import { CustomInput } from "components/CustomInput";
import {
  useSkillState,
  useSkillDispatch
} from "context/appContext";
import { skillActions } from "context/reducers/skillReducer";

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/CustomInput", () => ({
  CustomInput: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useSkillState: jest.fn(),
  useSkillDispatch: jest.fn()
}));

const mockSkillDispatch = jest.fn();
const timeOfDayOptions = initialSkillState.timeOfDays.map(tod => {
  const label = tod.openTime === "00:00:00" && tod.closeTime === "00:00:00" ? "Closed" : `${tod.openTime} - ${tod.closeTime}`;
  return {
    value: tod.timeOfDayId,
    label: label
  };
});

const applicationOptions = initialSkillState.applications.map(a => ({
  value: a.applicationId,
  label: a.applicationName
}));

const renderComponent = missingFields => {
  return render(<CallflowSkillForm missingFields={missingFields} />);
};

describe("<CallflowSkillForm/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSkillState.mockReturnValue(initialSkillState);
    useSkillDispatch.mockReturnValue(mockSkillDispatch);
    setupMockedComponents({
      Dropdown,
      CustomInput
    });
  });
  describe("initial render", () => {
    test("should render expected components", () => {
      renderComponent([]);
      expect(Dropdown).toHaveBeenCalledTimes(30);
      expect(CustomInput).toHaveBeenCalledTimes(4);
      expect(Dropdown.mock.calls[15][0].label).toBe("Application *");
      expect(Dropdown.mock.calls[15][0].options).toStrictEqual(applicationOptions);
      expect(Dropdown.mock.calls[15][0].value).toBe(null);
      expect(CustomInput.mock.calls[2][0].label).toBe("VH Threshold (Optional)");
      expect(CustomInput.mock.calls[2][0].value).toBe("");
      expect(CustomInput.mock.calls[3][0].label).toBe("VH Call Target (Optional)");
      expect(CustomInput.mock.calls[3][0].value).toBe("");
      const timeOfDayDropdowns = [16, 18, 20, 22, 24, 26, 28];
      const vhTimeOfDayDropdowns = [17, 19, 21, 23, 25, 27, 29];
      timeOfDayDropdowns.forEach(i => {
        expect(Dropdown.mock.calls[i][0].label).toBe("Time Of Day *");
        expect(Dropdown.mock.calls[i][0].options).toStrictEqual(timeOfDayOptions);
        expect(Dropdown.mock.calls[i][0].value).toBe(null);
      });
      vhTimeOfDayDropdowns.forEach(i => {
        expect(Dropdown.mock.calls[i][0].label).toBe("Virtual Hold Time Of Day (Optional)");
        expect(Dropdown.mock.calls[i][0].options).toStrictEqual(timeOfDayOptions);
        expect(Dropdown.mock.calls[i][0].value).toBe(null);
      });
    });
  });
  describe("timeOfDay field is updated", () => {
    test("should call skillDispatch", async () => {
      renderComponent([]);
      const updateValue = Dropdown.mock.calls[16][0].updateValue;
      updateValue(null, { value: 3 });
      expect(mockSkillDispatch).toHaveBeenCalledWith({
        type: skillActions.SET_TIME_OF_DAYS,
        payload: {
          dayOfWeekId: 1,
          timeOfDayId: 3
        }
      });
    });
  });
  describe("vhTimeOfDay field is updated", () => {
    test("should call skillDispatch", async () => {
      renderComponent([]);
      const updateValue = Dropdown.mock.calls[17][0].updateValue;
      updateValue(null, { value: 3 });
      expect(mockSkillDispatch).toHaveBeenCalledWith({
        type: skillActions.SET_TIME_OF_DAYS,
        payload: {
          dayOfWeekId: 1,
          vhTimeOfDayId: 3
        }
      });
    });
  });
  describe("application field is updated", () => {
    test("should call skillDispatch", async () => {
      renderComponent([]);
      const updateValue = Dropdown.mock.calls[15][0].updateValue;
      updateValue(null, { value: 1 });
      expect(mockSkillDispatch).toHaveBeenCalledWith({
        type: skillActions.SET_FORM_FIELD,
        payload: {
          key: "applicationId",
          value: 1
        }
      });
    });
  });
  describe("vhThreshold field", () => {
    test("should call skillDispatch", async () => {
      renderComponent([]);
      const value = "vthld";
      const updateValue = CustomInput.mock.calls[2][0].updateValue;
      updateValue(value);
      expect(CustomInput.mock.calls[4][0].value).toBe(value);
      const onBlur = CustomInput.mock.calls[4][0].onBlur;
      expect(mockSkillDispatch).not.toHaveBeenCalled();
      onBlur();
      expect(mockSkillDispatch).toHaveBeenCalledWith({
        type: skillActions.SET_FORM_FIELD,
        payload: {
          key: "vhThreshold",
          value
        }
      });
    });
  });
  describe("vhCallTarget field", () => {
    test("should call skillDispatch", async () => {
      renderComponent([]);
      const value = "clltrgt";
      const updateValue = CustomInput.mock.calls[3][0].updateValue;
      updateValue(value);
      expect(CustomInput.mock.calls[5][0].value).toBe(value);
      const onBlur = CustomInput.mock.calls[5][0].onBlur;
      expect(mockSkillDispatch).not.toHaveBeenCalled();
      onBlur();
      expect(mockSkillDispatch).toHaveBeenCalledWith({
        type: skillActions.SET_FORM_FIELD,
        payload: {
          key: "vhCallTarget",
          value
        }
      });
    });
  });
  describe("missing fields array is populated", () => {
    test("error fields are true", () => {
      renderComponent([
        "vhCallTarget",
        "vhThreshold",
        "vhTimeOfDay.1",
        "vhTimeOfDay.2",
        "vhTimeOfDay.3",
        "vhTimeOfDay.4",
        "vhTimeOfDay.5",
        "vhTimeOfDay.6",
        "vhTimeOfDay.7"
      ]);
      expect(Dropdown).toHaveBeenCalledTimes(30);
      expect(CustomInput).toHaveBeenCalledTimes(4);
      expect(CustomInput.mock.calls[2][0].label).toBe("VH Threshold (Optional)");
      expect(CustomInput.mock.calls[2][0].error).toBe(true);
      expect(CustomInput.mock.calls[3][0].label).toBe("VH Call Target (Optional)");
      expect(CustomInput.mock.calls[3][0].error).toBe(true);
      const vhTimeOfDayDropdowns = [17, 19, 21, 23, 25, 27, 29];
      vhTimeOfDayDropdowns.forEach(i => {
        expect(Dropdown.mock.calls[i][0].error).toBe(true);
      });
    });
  });
  describe("fields are cleared", () => {
    test("values are set to null", async () => {
      renderComponent([]);
      const updateValue = Dropdown.mock.calls[16][0].updateValue;
      updateValue(null, null);
      expect(mockSkillDispatch).toHaveBeenCalledWith({
        type: skillActions.SET_TIME_OF_DAYS,
        payload: {
          dayOfWeekId: 1,
          timeOfDayId: null
        }
      });
    });
    test("values are set to null", () => {
      renderComponent([]);
      const updateValue = Dropdown.mock.calls[17][0].updateValue;
      updateValue(null, null);
      expect(mockSkillDispatch).toHaveBeenCalledWith({
        type: skillActions.SET_TIME_OF_DAYS,
        payload: {
          dayOfWeekId: 1,
          vhTimeOfDayId: null
        }
      });
    });
  });
});