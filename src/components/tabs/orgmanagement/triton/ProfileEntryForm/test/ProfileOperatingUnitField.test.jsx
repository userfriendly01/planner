import ProfileOperatingUnitField from "../ProfileOperatingUnitField";
import React from "react";
import { Dropdown } from "components";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  getMockedComponentProps,
  initialTestState,
  mockOperatingUnits
} from "testUtils";
import { getOperatingUnits } from "services";
import { act } from "react-dom/test-utils";

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn()
}));

getOperatingUnits.mockImplementation(() => { return Promise.resolve(mockOperatingUnits); });

const statusCode = 500;
const mockSetOperatingUnit = jest.fn();

const renderComponent = () => render(
  <ProfileOperatingUnitField setOperatingUnit={mockSetOperatingUnit}
  />, initialTestState
);

describe("<ProfileOperatingUnitField />", () => {

  beforeEach(() => {
    setupMockedComponents({
      Dropdown
    });
    mockSetOperatingUnit.mockClear();
  });

  describe("initial state", () => {
    test("should render OU select component with no OU selected", async () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { Dropdown });
    });
  });

  describe("Operating unit get endpoint", () => {
    describe("Operating unit get service call returned an error", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        getOperatingUnits.mockImplementation(() => {
          return Promise.reject({
            status: statusCode,
            msg: "ou service failed"
          });
        });
      });
      test("should return 'An error occurred while logging in.'", async () => {
        try {
          renderComponent();
          expect(console.error).toHaveBeenCalledTimes(1);
        } catch (err) {
          expect(err.msg).toBe("Failed to fetch ou from service");
        }
      });
    });
  });

  describe("changes made to the add ou drop down", () => {
    beforeEach(() => {
      React.useState = jest.fn()
        .mockReturnValueOnce([[], jest.fn()])
        .mockReturnValueOnce([{}, jest.fn()])
        .mockReturnValueOnce([mockOperatingUnits, jest.fn()]);
    });
    test("should render ou drop down with correct options", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { Dropdown });
      act(() => {
        const { updateValue } = getMockedComponentProps(Dropdown);
        updateValue("", {
          label: "testname",
          value: "testsid"
        });
        expect(mockSetOperatingUnit).toHaveBeenLastCalledWith({
          "ou_name": "testname",
          "ou_sid": "testsid"
        });
      });
    });
  });

});