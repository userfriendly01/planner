import OuFilterDropdown from "../OuFilterDropdown";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";
import { getOperatingUnits } from "services";
import {
  act,
  render,
  setupMockedComponents,
  mockOperatingUnits,
  initialTestState as initialState
} from "testUtils";
import {
  theme, OperatingUnit
} from "globals";
import { ThemeProvider } from "styled-components";

jest.mock("components", () => ({
  Dropdown: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

getOperatingUnits.mockImplementation(() => { return Promise.resolve(mockOperatingUnits); });
const statusCode = 500;

const mockSetOperatingUnit = jest.fn();

jest.mock("../OuFilterDropdown.Styles", () => ({
  Label: jest.requireActual("../OuFilterDropdown.Styles").Label,
  Wrapper: jest.requireActual("../OuFilterDropdown.Styles").Wrapper
}));


const filterBy = "show-all";
const setFilter = jest.fn();

const renderComponent = () => render(
  <ThemeProvider theme={theme}>
    <OuFilterDropdown filterBy={filterBy} setFilter={setFilter} />
  </ThemeProvider>
);


describe("<OuDropdown />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    //useAdminState.mockReturnValue(initialTestState);
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
        try {
          renderComponent();
          expect(console.error).toHaveBeenCalledTimes(1);
        } catch (err) {
          expect(err.msg).toBe("Failed to fetch ou from service");
        }
      });
    });
    describe("Operating unit endpoint returns list of OU", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        getOperatingUnits.mockImplementation(() => {
          return Promise.resolve({
            ou_name: "testname",
            ou_sid: "testsid"
          });
        });
      });
      test("should call setOperatingUnit function", async () => {
        renderComponent();
        //expect(mockSetOperatingUnit).toHaveBeenCalledTimes(1);
        //expect(mockSetOperatingUnit).toHaveBeenLastCalledWith(""); // TODO fix this 
      });
    });
  });
  test("upon initial render, should display OU Filter and all Ou should be listed in the dropdown", () => {
    renderComponent();
    expect(Dropdown.mock.calls[0][0].label).toBe("OU Dropdown");
    //expect(Dropdown.mock.calls[0][0].options).toStrictEqual([   // TODO fix this 
    //   {
    //     label: "Show All",
    //     value: "show-all"
    //   },
    //   {
    //     label: "divider",
    //     value: "divider"
    //   },
    //   ...mockOperatingUnits.map(ou => ({
    //     label: ou.ou_name,
    //     value: ou.ou_name
    //   }))
    // ]);
    expect(Dropdown.mock.calls[0][0].value).toStrictEqual({
      value: "show-all",
      label: "Show All"
    });
  });

  test("When an option is clicked in the filter, the setFilter method is fired with the correct parameters", () => {
    const selection = {
      label: "testname1",
      value: "testname1"
    };
    renderComponent();
    act(() => {
      Dropdown.mock.calls[0][0].updateValue(null, selection);
    });
    expect(setFilter).toHaveBeenCalledWith(selection.value);
  });
  describe("Custom Render", () => {
    describe("Non OU Option is passed through", () => {
      test("show-all renders as expected", () => {
        const option = {
          label: "Show All",
          value: "show-all"
        };
        renderComponent();
        act(() => Dropdown.mock.calls[0][0].updateValue(null, option));
        expect(setFilter).toHaveBeenCalledTimes(1);
        expect(setFilter).toHaveBeenCalledWith(null);
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
        act(() => Dropdown.mock.calls[0][0].updateValue(null, option));
        expect(setFilter).toHaveBeenCalledTimes(0);
        expect(rendered.container).toHaveTextContent("divider");
      });
    });
  });
});