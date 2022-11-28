import ProfileCallTagsSelectField from "../ProfileCallTagsSelectField";
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
  mockCallTags
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
const callTagsEndpoint = apiPaths.GET_PROFILE_WORKER_TASK_INFO;
const mockSetCallTagsList = jest.fn();
const renderComponent = mockCallTagsList => render(<ProfileCallTagsSelectField
  callTagsList={mockCallTagsList}
  setCallTagsList={mockSetCallTagsList}
/>, initialTestState);

const getAddCallTagButton = rendered => rendered.getByTestId("add-profileCallTag-button");
const getDeleteCallTagButton = (rendered, instance) => rendered.getAllByTestId("delete-callTag-button")[instance];

describe("<ProfileCallTagsSelectField />", () => {

  beforeEach(() => {
    setupMockedComponents({
      Add,
      Delete,
      Dropdown,
      Tooltip
    });
    mockSetCallTagsList.mockClear();
    axiosMock.onGet(callTagsEndpoint).reply(200, mockCallTags);
  });

  describe("initial state", () => {
    test("should render callTags select component with no callTags selected", async () => {
      const rendered = renderComponent([]);
      expectMockedComponent(rendered, { Dropdown });
      expectMockedComponent(rendered, { Add });
      expectMockedComponent(rendered, { Delete }, 0);
    });
  });

  describe(callTagsEndpoint, () => {
    describe("callTags service call returned an error", () => {
      beforeEach(() => {
        axiosMock.onGet(callTagsEndpoint).reply(statusCode, { fail: "oh the horror" });
      });
      test("should return 'An error occurred while logging in.'", async () => {
        try {
          renderComponent([]);
        } catch(err) {
          expect(err.msg).toBe("Failed to fetch callTags from service");
        }
      });
    });
  });
  
  describe("changes made to the add callTags drop down", () => {
    beforeEach(() => {
      const mockNewCallTag = [   {
        display_nme: "Call Type",
        options_id: 1,
        profile_id: 15,
        row_crtn_dtm: "2019-10-24T12:58:48.000Z",
        row_updt_dtm: "2019-10-24T12:58:48.000Z",
        wrkr_tsk_info_id: 1
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockNewCallTag, jest.fn()])
        .mockReturnValueOnce([mockCallTags, jest.fn()]);
    });

    test("should render callTags drop down with correct options", () => {
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
        fireEvent.click(getAddCallTagButton(rendered));
      });
      expect(mockSetCallTagsList).toHaveBeenCalledWith([
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
      const mockNewCallTag = [  {
        display_nme: "Call Type",
        options_id: 1,
        profile_id: 15,
        row_crtn_dtm: "2019-10-24T12:58:48.000Z",
        row_updt_dtm: "2019-10-24T12:58:48.000Z",
        wrkr_tsk_info_id: 1
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockNewCallTag, jest.fn()])
        .mockReturnValueOnce([mockCallTags, jest.fn()]);
    });

    test("should display once for each callTag; when clicked, callTag should be removed", () => {
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
        fireEvent.click(getDeleteCallTagButton(rendered, 1));
      });
      expect(mockSetCallTagsList).toHaveBeenCalledWith([
        
      ]);
    });
  });
});
