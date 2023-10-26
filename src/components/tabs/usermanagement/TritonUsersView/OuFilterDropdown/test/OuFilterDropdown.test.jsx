import OuFilterDropdown from "../OuFilterDropdown";
import { Dropdown } from "components";
import React from "react";
import { getOperatingUnits } from "services";
import {
  act,
  render,
  setupMockedComponents,
  mockOperatingUnits,
  waitFor,
  initialTestState
} from "testUtils";
import {
  theme
} from "globals";
import {
  useAdminState, useAdminDispatch
} from "context";
import { ThemeProvider } from "styled-components";
import { logger } from "utils";

jest.mock("components", () => ({
  Dropdown: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

const statusCode = 500;

jest.mock("../OuFilterDropdown.Styles", () => ({
  Label: jest.requireActual("../OuFilterDropdown.Styles").Label,
  Wrapper: jest.requireActual("../OuFilterDropdown.Styles").Wrapper
}));

const mockAdminDispatch = jest.fn();

const renderComponent = () => render(
  <ThemeProvider theme={theme}>
    <OuFilterDropdown />
  </ThemeProvider>
);


describe("<OuDropdown />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getOperatingUnits.mockResolvedValue(mockOperatingUnits);
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    useAdminState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Dropdown
    });
    jest.clearAllMocks();
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
        renderComponent();

        await waitFor(() => {
          expect(logger.error).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
  test("upon initial render, should display OU Filter and all Ou should be listed in the dropdown", async () => {
    renderComponent();
    await waitFor(() => {
      expect(Dropdown.mock.calls.length).toBe(2);
    });
    expect(Dropdown.mock.calls[1][0].label).toBe("OU Dropdown");
    expect(Dropdown.mock.calls[1][0].options).toStrictEqual([
      {
        label: "Show All",
        value: "show-all"
      },
      {
        label: "divider",
        value: "divider"
      },
      ...mockOperatingUnits.map(ou => ({
        label: ou.ou_name,
        value: ou.ou_sid
      }))
    ]);
    expect(Dropdown.mock.calls[1][0].value).toStrictEqual([]);
  });

  test("When an option is clicked in the filter, the dispatch is fired with the correct parameters", () => {
    const selection = [{
      label: "testname1",
      value: "OuSidTest1"
    }, {
      label: "testname1",
      value: "OuSidTest2"
    }];
    renderComponent();
    act(() => {
      Dropdown.mock.calls[0][0].updateValue(null, selection);
    });
    expect(mockAdminDispatch).toHaveBeenCalledWith({
      type: "updateOuFilter",
      payload: selection
    });
  });
  describe("Custom Render", () => {
    describe("Non OU Option is passed through", () => {
      test("show-all renders as expected", () => {
        const option = {
          label: "Show All",
          value: "show-all"
        };
        renderComponent();
        act(() => Dropdown.mock.calls[0][0].updateValue(null, [option]));
        expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "updateOuFilter",
          payload: []
        });
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({ option }));
        expect(rendered.container).toHaveTextContent("Show All");
      });
      test("divider renders as expected", () => {
        const option = {
          label: "divider",
          value: "divider"
        };
        renderComponent();
        const rendered = render(Dropdown.mock.calls[0][0].CustomRender({ option }));
        act(() => Dropdown.mock.calls[0][0].updateValue(null, [option]));
        expect(mockAdminDispatch).toHaveBeenCalledTimes(0);
        expect(rendered.container).toHaveTextContent("divider");
      });
    });
  });
});