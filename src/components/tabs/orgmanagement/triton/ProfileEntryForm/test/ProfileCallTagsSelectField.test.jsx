import { ProfileCallTagsSelectField } from "../ProfileCallTagsSelectField";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  getCallTags,
  getCallTagOptions
} from "services/callTags";
import MockAdapter from "axios-mock-adapter";
import { Dropdown } from "components/Dropdown";
import React from "react";
import { myAxios } from "utils/myAxios";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  fireEvent,
  getMockedComponentProps,
  initialTestState,
  mockCallTags,
  mockCallTagOptions
} from "testUtils";
import { ThemeProvider } from "styled-components";
import { apiPaths } from "globals";
import { theme } from "globals/theme";
import { Tooltip } from "@mui/material";
import { act } from "react-dom/test-utils";

jest.mock("@mui/icons-material", () => ({
  Add: jest.fn(),
  Delete: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Tooltip: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("services/callTags", () => ({
  getCallTags: jest.fn(),
  getCallTagOptions: jest.fn()
}));

getCallTags.mockImplementation(() => { return Promise.resolve(200, { response: "success" } ); });
getCallTagOptions.mockImplementation(() => { return Promise.resolve(200, { response: "success" } ); });

const statusCode = 500;
const axiosMock = new MockAdapter(myAxios);
const callTagsEndpoint = apiPaths.GET_CALL_TAGS;
const callTagOptionsEndpoint = apiPaths.GET_CALL_TAGS_OPTIONS;
const mockSetCallTagsList = jest.fn();
const mockCallTagOptionsList = jest.fn();
const renderComponent = (mockCallTagsList, mockCallTagOptionsList, mockSetCallTagsList) => render(
  <ThemeProvider theme={theme}>
    <ProfileCallTagsSelectField
      callTagsList={mockCallTagsList}
      callTagOptionsList={mockCallTagOptionsList}
      setCallTagsList={mockSetCallTagsList}
    />
  </ThemeProvider>
  , initialTestState);

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
    mockCallTagOptionsList.mockClear();
    axiosMock.onGet(callTagsEndpoint).reply(200, mockCallTags);
    axiosMock.onGet(callTagOptionsEndpoint).reply(200, mockCallTagOptions);
  });

  describe("initial state", () => {
    test("should render callTags select component with no callTags selected", async () => {
      expect(1).toEqual(1);
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
      const mockNewCallTagOptions = [{
        options_id: 1,
        options: "[\"Info Exchange\", \"Bargaining\", \"Closing\", \"N/A\", \"Offer\"]"
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockNewCallTag, jest.fn()])
        .mockReturnValueOnce([mockCallTags, jest.fn()])
        .mockReturnValueOnce([mockNewCallTagOptions, jest.fn()])
        .mockReturnValueOnce([mockCallTagOptions, jest.fn()]);
    });

    test("should render callTags drop down with correct options", () => {
      const rendered = renderComponent(
        [
          {
            display_nme: "Call Type",
            options_id: 1,
            profile_id: 15,
            row_crtn_dtm: "2019-10-24T12:58:48.000Z",
            row_updt_dtm: "2019-10-24T12:58:48.000Z",
            wrkr_tsk_info_id: 1
          }
        ],
        [
          {
            options_id: 1,
            options: "[\"Info Exchange\", \"Bargaining\", \"Closing\", \"N/A\", \"Offer\"]"
          }
        ],
        jest.fn()
      );
      expect(rendered.container).not.toHaveTextContent("Offline");
      act(() => {
        const { updateValue } = getMockedComponentProps(Dropdown);
        updateValue("", [{ value: 1 }] );
      });
      act(() => {
        fireEvent.click(getAddCallTagButton(rendered));
      });
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
        .mockReturnValueOnce([mockCallTags, jest.fn()])
        .mockReturnValueOnce([mockNewCallTag, jest.fn()])
        .mockReturnValueOnce([mockCallTagOptions, jest.fn()]);
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
      ],
      [
        {
          options_id: 1,
          options: "[\"Info Exchange\", \"Bargaining\", \"Closing\", \"N/A\", \"Offer\"]"
        }
      ],
      jest.fn());
      expectMockedComponent(rendered, { Delete }, 2);
      act(() => {
        fireEvent.click(getDeleteCallTagButton(rendered, 1));
      });
    });
  });
});
