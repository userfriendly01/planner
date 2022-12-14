import ProfileQueuesSelectField from "../ProfileQueuesSelectField";
import {
  Add,
  Delete
} from "@mui/icons-material";
import { Dropdown } from "components";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  fireEvent,
  getMockedComponentProps,
  initialTestState,
  mockActivities
} from "testUtils";
import { act } from "react-dom/test-utils";

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  Add: jest.fn(),
  Delete: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

const mockSetQueueList = jest.fn();
const renderComponent = mockTransferQueues => render(<ProfileQueuesSelectField
  transferQueues={mockTransferQueues}
  setQueueList={mockSetQueueList}
/>, initialTestState);

const getAddTransferQueuesButton = rendered => rendered.getByTestId("add-queue-button");
const getDeleteTransferQueuesButton = (rendered, instance) => rendered.getAllByTestId("delete-queue-button")[instance];

describe("<ProfileQueuesSelectField />", () => {
  beforeEach(() => {
    setupMockedComponents({
      Add,
      Delete,
      Dropdown
    });
    mockSetQueueList.mockClear();
  });

  describe("initial state", () => {
    test("should render transfer queue select component with no queues selected", async () => {
      const rendered = renderComponent([]);
      expectMockedComponent(rendered, { Dropdown });
      expectMockedComponent(rendered, { Add });
      expectMockedComponent(rendered, { Delete }, 0);
    });
  });

  // describe("changes made to the add activities drop down", () => {
  //   beforeEach(() => {
  //     const mockNewActivity = [{
  //       activity_id: 1,
  //       activity_nme: "Offline",
  //       available_i: {
  //         "data": [
  //           0
  //         ],
  //         "type": "Buffer"
  //       }
  //     }];
  //     React.useState = jest.fn()
  //       .mockReturnValueOnce([mockNewActivity, jest.fn()])
  //       .mockReturnValueOnce([mockActivities, jest.fn()]);
  //   });

  //   test("should render activities drop down with correct options", () => {
  //     const rendered = renderComponent([{
  //       "activity_id": 2,
  //       "activity_nme": "Available",
  //       "available_i": {
  //         "type": "Buffer",
  //         "data": [
  //           1
  //         ]
  //       }
  //     }]);
  //     expect(rendered.container).not.toHaveTextContent("Offline");
  //     act(() => {
  //       const { updateValue } = getMockedComponentProps(Dropdown);
  //       updateValue("", [{ value: 1 }] );
  //     });
  //     act(() => {
  //       fireEvent.click(getAddTransferQueuesButton(rendered));
  //     });
  //     expect(mockSetActivitiesList).toHaveBeenCalledWith([
  //       {
  //         "activity_id": 2,
  //         "activity_nme": "Available",
  //         "available_i": {
  //           "data": [
  //             1
  //           ],
  //           "type": "Buffer"
  //         }
  //       },
  //       {
  //         "activity_id": 1,
  //         "activity_nme": "Offline",
  //         "available_i": {
  //           "data": [
  //             0
  //           ],
  //           "type": "Buffer"
  //         }
  //       }
  //     ]);
  //   });
  // });

  // describe("remove button", () => {
  //   beforeEach(() => {
  //     const mockNewActivity = [{
  //       activity_id: 1,
  //       activity_nme: "Offline",
  //       available_i: {
  //         "data": [
  //           0
  //         ],
  //         "type": "Buffer"
  //       }
  //     }];
  //     React.useState = jest.fn()
  //       .mockReturnValueOnce([mockNewActivity, jest.fn()])
  //       .mockReturnValueOnce([mockActivities, jest.fn()]);
  //   });

  //   test("should display once for each activity; when clicked, activity should be removed", () => {
  //     const rendered = renderComponent([
  //       {
  //         "activity_id": 2,
  //         "activity_nme": "Available",
  //         "available_i": {
  //           "data": [
  //             1
  //           ],
  //           "type": "Buffer"
  //         }
  //       },
  //       {
  //         "activity_id": 1,
  //         "activity_nme": "Offline",
  //         "available_i": {
  //           "data": [
  //             0
  //           ],
  //           "type": "Buffer"
  //         }
  //       }
  //     ]);
  //     expectMockedComponent(rendered, { Delete }, 2);
  //     act(() => {
  //       fireEvent.click(getDeleteTransferQueuesButton(rendered, 1));
  //     });
  //     expect(mockSetActivitiesList).toHaveBeenCalledWith([
  //       {
  //         "activity_id": 2,
  //         "activity_nme": "Available",
  //         "available_i": {
  //           "data": [
  //             1
  //           ],
  //           "type": "Buffer"
  //         }
  //       }
  //     ]);
  //   });
  // });
});
