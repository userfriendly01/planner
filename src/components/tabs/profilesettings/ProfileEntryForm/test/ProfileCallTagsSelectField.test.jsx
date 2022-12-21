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
  mockCallTags,
  mockWorkerTaskInfoOptions
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
const callTagsEndpoint = apiPaths.GET_CALL_TAGS;
const workerTaskInfoOptionsEndpoint = apiPaths.GET_CALL_TAGS_OPTIONS;
const mockSetCallTagsList = jest.fn();
const mockWorkerTaskInfoOptionsList = jest.fn();
const renderComponent = mockCallTagsList => render(<ProfileCallTagsSelectField
  callTagsList={mockCallTagsList}
  workerTaskInfoOptionsList={mockWorkerTaskInfoOptionsList}
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
    mockWorkerTaskInfoOptionsList.mockClear();
    axiosMock.onGet(callTagsEndpoint).reply(200, mockCallTags);
    axiosMock.onGet(workerTaskInfoOptionsEndpoint).reply(200, mockWorkerTaskInfoOptionsList);
  });

  describe("initial state", () => {
    test("should render callTags select component with no callTags selected", async () => {
      const rendered = renderComponent([]);
      expectMockedComponent(rendered, { Dropdown });
      expectMockedComponent(rendered, { Add });
      expectMockedComponent(rendered, { Delete }, 0);
    });
  });

//   describe(callTagsEndpoint, () => {
//     describe("callTags service call returned an error", () => {
//       beforeEach(() => {
//         axiosMock.onGet(callTagsEndpoint).reply(statusCode, { fail: "oh the horror" });
//       });
//       test("should return 'An error occurred while logging in.'", async () => {
//         try {
//           renderComponent([]);
//         } catch(err) {
//           expect(err.msg).toBe("Failed to fetch callTags from service");
//         }
//       });
//     });
//   });
  
//   describe("changes made to the add callTags drop down", () => {
//     beforeEach(() => {
//       const mockNewCallTag = [   {
//         display_nme: "Call Type",
//         options_id: 1,
//         profile_id: 15,
//         row_crtn_dtm: "2019-10-24T12:58:48.000Z",
//         row_updt_dtm: "2019-10-24T12:58:48.000Z",
//         wrkr_tsk_info_id: 1
//       }];
//       const mockNewWorkerTaskInfo = [    {
//         wrkr_tsk_info_id: 2, 
//         wrkr_tsk_info_nme: 'claim_number'
//       }];
//       React.useState = jest.fn()
//         .mockReturnValueOnce([mockNewCallTag, jest.fn()])
//         .mockReturnValueOnce([mockCallTags, jest.fn()])
//         .mockReturnValueOnce([mockNewWorkerTaskInfo, jest.fn()])
//         .mockReturnValueOnce([mockWorkerTaskInfoOptions, jest.fn()]);
//     });

//     test("should render callTags drop down with correct options", () => {
//       const rendered = renderComponent([  {
//         display_nme: "Call Type",
//         options_id: 1,
//         profile_id: 15,
//         row_crtn_dtm: "2019-10-24T12:58:48.000Z",
//         row_updt_dtm: "2019-10-24T12:58:48.000Z",
//         wrkr_tsk_info_id: 1
//       }]);
//       expect(rendered.container).not.toHaveTextContent("Offline");
//       act(() => {
//         const { updateValue } = getMockedComponentProps(Dropdown);
//         updateValue("", [{ value: 1 }] );
//       });
//       act(() => {
//         fireEvent.click(getAddCallTagButton(rendered));
//       });
//       expect(mockSetCallTagsList).toHaveBeenCalledWith([
//         {
//           display_nme: "Call Type",
//           options_id: 1,
//           profile_id: 15,
//           row_crtn_dtm: "2019-10-24T12:58:48.000Z",
//           row_updt_dtm: "2019-10-24T12:58:48.000Z",
//           wrkr_tsk_info_id: 1
//         },
//         {
//           display_nme: "Call Type",
//           options_id: 1,
//           profile_id: 15,
//           row_crtn_dtm: "2019-10-24T12:58:48.000Z",
//           row_updt_dtm: "2019-10-24T12:58:48.000Z",
//           wrkr_tsk_info_id: 1
//         }
//       ]);
//     });
//   });

//   describe("remove button", () => {
//     beforeEach(() => {
//       const mockNewCallTag = [  {
//         display_nme: "Call Type",
//         options_id: 1,
//         profile_id: 15,
//         row_crtn_dtm: "2019-10-24T12:58:48.000Z",
//         row_updt_dtm: "2019-10-24T12:58:48.000Z",
//         wrkr_tsk_info_id: 1
//       }];
//       const mockNewWorkerTaskInfo = [    {
//         wrkr_tsk_info_id: 2, 
//         wrkr_tsk_info_nme: 'claim_number'
//       }];
//       React.useState = jest.fn()
//         .mockReturnValueOnce([mockNewCallTag, jest.fn()])
//         .mockReturnValueOnce([mockCallTags, jest.fn()])
//         .mockReturnValueOnce([mockNewWorkerTaskInfo, jest.fn()])
//         .mockReturnValueOnce([mockWorkerTaskInfoOptions, jest.fn()]);
//     });

//     test("should display once for each callTag; when clicked, callTag should be removed", () => {
//       const rendered = renderComponent([
//         {
//           display_nme: "Call Type",
//           options_id: 1,
//           profile_id: 15,
//           row_crtn_dtm: "2019-10-24T12:58:48.000Z",
//           row_updt_dtm: "2019-10-24T12:58:48.000Z",
//           wrkr_tsk_info_id: 1
//         },
//         {
//           display_nme: "Call Type",
//           options_id: 1,
//           profile_id: 15,
//           row_crtn_dtm: "2019-10-24T12:58:48.000Z",
//           row_updt_dtm: "2019-10-24T12:58:48.000Z",
//           wrkr_tsk_info_id: 1
//         }
//       ]);
//       expectMockedComponent(rendered, { Delete }, 2);
//       act(() => {
//         fireEvent.click(getDeleteCallTagButton(rendered, 1));
//       });
//       expect(mockSetCallTagsList).toHaveBeenCalledWith([
        
//       ]);
//     });
//   });
});
