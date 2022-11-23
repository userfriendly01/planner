import ProfileACWWorkerTaskInfosSelectField from "../ProfileACWWorkerTaskInfosSelectField";
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
  mockACWWorkerTaskInfos
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
const acwWorkerTaskInfosEndpoint = apiPaths.GET_PROFILE_WORKER_TASK_INFO;
const mockSetACWWorkerTaskInfosList = jest.fn();
const renderComponent = mockACWWorkerTaskInfosList => render(<ProfileACWWorkerTaskInfosSelectField
  acwWorkerTaskInfosList={mockACWWorkerTaskInfosList}
  setACWWorkerTaskInfosList={mockSetACWWorkerTaskInfosList}
/>, initialTestState);

const getAddACWWorkerTaskInfoButton = rendered => rendered.getByTestId("add-profileACWWorkerTaskInfo-button");
const getDeleteACWWorkerTaskInfoButton = (rendered, instance) => rendered.getAllByTestId("delete-acwWorkerTaskInfo-button")[instance];

describe("<ProfileACWWorkerTaskInfosSelectField />", () => {

  beforeEach(() => {
    setupMockedComponents({
      Add,
      Delete,
      Dropdown,
      Tooltip
    });
    mockSetACWWorkerTaskInfosList.mockClear();
    axiosMock.onGet(acwWorkerTaskInfosEndpoint).reply(200, mockACWWorkerTaskInfos);
  });

  describe("initial state", () => {
    test("should render acwWorkerTaskInfos select component with no acwWorkerTaskInfos selected", async () => {
      const rendered = renderComponent([]);
      expectMockedComponent(rendered, { Dropdown });
      expectMockedComponent(rendered, { Add });
      expectMockedComponent(rendered, { Delete }, 0);
    });
  });

  describe(acwWorkerTaskInfosEndpoint, () => {
    describe("acwWorkerTaskInfos service call returned an error", () => {
      beforeEach(() => {
        axiosMock.onGet(acwWorkerTaskInfosEndpoint).reply(statusCode, { fail: "oh the horror" });
      });
      test("should return 'An error occurred while logging in.'", async () => {
        try {
          renderComponent([]);
        } catch(err) {
          expect(err.msg).toBe("Failed to fetch acwWorkerTaskInfos from service");
        }
      });
    });
  });

  describe("changes made to the add acwWorkerTaskInfos drop down", () => {
    beforeEach(() => {
      const mockNewACWWorkerTaskInfo = [   {
        display_nme: "Call Type",
        options_id: 1,
        profile_id: 15,
        row_crtn_dtm: "2019-10-24T12:58:48.000Z",
        row_updt_dtm: "2019-10-24T12:58:48.000Z",
        wrkr_tsk_info_id: 1
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockNewACWWorkerTaskInfo, jest.fn()])
        .mockReturnValueOnce([mockACWWorkerTaskInfos, jest.fn()]);
    });

    test("should render acwWorkerTaskInfos drop down with correct options", () => {
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
        fireEvent.click(getAddACWWorkerTaskInfoButton(rendered));
      });
      expect(mockSetACWWorkerTaskInfosList).toHaveBeenCalledWith([
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
      const mockNewACWWorkerTaskInfo = [  {
        display_nme: "Call Type",
        options_id: 1,
        profile_id: 15,
        row_crtn_dtm: "2019-10-24T12:58:48.000Z",
        row_updt_dtm: "2019-10-24T12:58:48.000Z",
        wrkr_tsk_info_id: 1
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockNewACWWorkerTaskInfo, jest.fn()])
        .mockReturnValueOnce([mockACWWorkerTaskInfos, jest.fn()]);
    });

    test("should display once for each acwWorkerTaskInfo; when clicked, acwWorkerTaskInfo should be removed", () => {
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
        fireEvent.click(getDeleteACWWorkerTaskInfoButton(rendered, 1));
      });
      expect(mockSetACWWorkerTaskInfosList).toHaveBeenCalledWith([
        
      ]);
    });
  });
});
