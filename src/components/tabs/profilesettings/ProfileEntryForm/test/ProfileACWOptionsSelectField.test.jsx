import ProfileACWOptionsSelectField from "../ProfileACWOptionsSelectField";
import {
  Add,
  Delete
} from "@mui/icons-material";
import MockAdapter from "axios-mock-adapter";
import { Dropdown } from "components";
import React from "react";
import { myAxios } from "utils";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  fireEvent,
  getMockedComponentProps,
  initialTestState,
  mockACWOptions
} from "testUtils";
import { apiPaths } from "globals";
import { Tooltip } from "@mui/material";
import { act } from "react-dom/test-utils";

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  Add: jest.fn(),
  Delete: jest.fn()
}));

jest.mock("@mui/material", () => ({
  __esModule: true,
  Tooltip: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

const statusCode = 500;
const axiosMock = new MockAdapter(myAxios);
const acwOptionsEndpoint = apiPaths.GET_PROFILE_WORKER_TASK_INFO;
const mockSetACWOptionsList = jest.fn();
const renderComponent = mockACWOptionsList => render(<ProfileACWOptionsSelectField
  acwOptionsList={mockACWOptionsList}
  setACWOptionsList={mockSetACWOptionsList}
/>, initialTestState);

const getAddACWOptionButton = rendered => rendered.getByTestId("add-profileACWOption-button");
const getDeleteACWOptionButton = (rendered, instance) => rendered.getAllByTestId("delete-acwOption-button")[instance];

describe("<ProfileACWOptionsSelectField />", () => {

  beforeEach(() => {
    setupMockedComponents({
      Add,
      Delete,
      Dropdown,
      Tooltip
    });
    mockSetACWOptionsList.mockClear();
    axiosMock.onGet(acwOptionsEndpoint).reply(200, mockACWOptions);
  });

  describe("initial state", () => {
    test("should render acwOptions select component with no acwOptions selected", async () => {
      const rendered = renderComponent([]);
      expectMockedComponent(rendered, { Dropdown });
      expectMockedComponent(rendered, { Add });
      expectMockedComponent(rendered, { Delete }, 0);
    });
  });

  describe(acwOptionsEndpoint, () => {
    describe("acwOptions service call returned an error", () => {
      beforeEach(() => {
        axiosMock.onGet(acwOptionsEndpoint).reply(statusCode, { fail: "oh the horror" });
      });
      test("should return 'An error occurred while logging in.'", async () => {
        try {
          renderComponent([]);
        } catch(err) {
          expect(err.msg).toBe("Failed to fetch acwOptions from service");
        }
      });
    });
  });

  describe("changes made to the add acwOptions drop down", () => {
    beforeEach(() => {
      const mockNewACWOption = [   {
        display_nme: "Call Type",
        options_id: 1,
        profile_id: 15,
        row_crtn_dtm: "2019-10-24T12:58:48.000Z",
        row_updt_dtm: "2019-10-24T12:58:48.000Z",
        wrkr_tsk_info_id: 1
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockNewACWOption, jest.fn()])
        .mockReturnValueOnce([mockACWOptions, jest.fn()]);
    });

    test("should render acwOptions drop down with correct options", () => {
      const rendered = renderComponent([  {
        display_nme: "Call Type",
        options_id: 1,
        profile_id: 15,
        row_crtn_dtm: "2019-10-24T12:58:48.000Z",
        row_updt_dtm: "2019-10-24T12:58:48.000Z",
        wrkr_tsk_info_id: 1
      }]);
      expect(rendered.container).not.toHaveTextContent("Offline");
      act(() => {
        const { updateValue } = getMockedComponentProps(Dropdown);
        updateValue("", [{ value: 1 }] );
      });
      act(() => {
        fireEvent.click(getAddACWOptionButton(rendered));
      });
      expect(mockSetACWOptionsList).toHaveBeenCalledWith([
        {
          display_nme: "Call Type",
          options_id: 1,
          profile_id: 15,
          row_crtn_dtm: "2019-10-24T12:58:48.000Z",
          row_updt_dtm: "2019-10-24T12:58:48.000Z",
          wrkr_tsk_info_id: 1
        },
        {
          display_nme: "Call Type",
          options_id: 1,
          profile_id: 15,
          row_crtn_dtm: "2019-10-24T12:58:48.000Z",
          row_updt_dtm: "2019-10-24T12:58:48.000Z",
          wrkr_tsk_info_id: 1
        }
      ]);
    });
  });

  describe("remove button", () => {
    beforeEach(() => {
      const mockNewACWOption = [  {
        display_nme: "Call Type",
        options_id: 1,
        profile_id: 15,
        row_crtn_dtm: "2019-10-24T12:58:48.000Z",
        row_updt_dtm: "2019-10-24T12:58:48.000Z",
        wrkr_tsk_info_id: 1
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockNewACWOption, jest.fn()])
        .mockReturnValueOnce([mockACWOptions, jest.fn()]);
    });

    test("should display once for each acwOption; when clicked, acwOption should be removed", () => {
      const rendered = renderComponent([
        {
          display_nme: "Call Type",
          options_id: 1,
          profile_id: 15,
          row_crtn_dtm: "2019-10-24T12:58:48.000Z",
          row_updt_dtm: "2019-10-24T12:58:48.000Z",
          wrkr_tsk_info_id: 1
        },
        {
          display_nme: "Call Type",
          options_id: 1,
          profile_id: 15,
          row_crtn_dtm: "2019-10-24T12:58:48.000Z",
          row_updt_dtm: "2019-10-24T12:58:48.000Z",
          wrkr_tsk_info_id: 1
        }
      ]);
      expectMockedComponent(rendered, { Delete }, 2);
      act(() => {
        fireEvent.click(getDeleteACWOptionButton(rendered, 1));
      });
      expect(mockSetACWOptionsList).toHaveBeenCalledWith([
        
      ]);
    });
  });
});
