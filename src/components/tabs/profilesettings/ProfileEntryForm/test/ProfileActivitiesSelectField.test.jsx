import ProfileActivitiesSelectField from "../ProfileActivitiesSelectField";
// import PriorityDropDown from "../../../usermanagement/PriorityDropDown/PriorityDropDown";
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
  initialTestState
} from "testUtils";
import {
  useAdminState
} from "context";
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

jest.mock("context", () => ({
  __esModule: true,
  useAdminState: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

const mockSetActivitiesList = jest.fn();
const renderComponent = mockActivitiesList => render(<ProfileActivitiesSelectField
  activitiesList={mockActivitiesList}
  setActivitiesList={mockSetActivitiesList}
/>, initialTestState);

const getAddActivityButton = rendered => rendered.getByTestId("add-profileActivity-button");
const getDeleteActivityButton = (rendered, instance) => rendered.getAllByTestId("delete-activity-button")[instance];

describe("<ProfileActivitiesSelectField />", () => {

  beforeEach(() => {
    setupMockedComponents({
      Add,
      Delete,
      Dropdown,
      Tooltip
    });
    mockSetActivitiesList.mockClear();
    useAdminState.mockReturnValue(initialTestState);
  });

  describe("initial state", () => {
    test("should render activities select component with no activities selected", () => {
      const rendered = renderComponent([]);
      expectMockedComponent(rendered, { Dropdown });
      expectMockedComponent(rendered, { Add });
      expectMockedComponent(rendered, { Delete }, 0);
    });
  });

  describe("changes made to the add activities drop down", () => {
    test("should render activities drop down with correct options", () => {
      const rendered = renderComponent([{
        "activity_id": 2,
        "activity_nme": "Available",
        "available_i": {
          "type": "Buffer",
          "data": [
            1
          ]
        }
      }]);
      expect(rendered.container).not.toHaveTextContent("Offline");
      act(() => {
        const { updateValue } = getMockedComponentProps(Dropdown);
        updateValue("", { value: 1 } );
      });
      act(() => {
        fireEvent.click(getAddActivityButton(rendered));
      });
      expect(mockSetActivitiesList).toHaveBeenCalledWith([
        {
          "activity_id": 2,
          "activity_nme": "Available",
          "available_i": {
            "data": [
              1
            ],
            "type": "Buffer"
          }
        },
        {
          "activity_cde": "OFFLINE",
          "activity_id": 1,
          "activity_nme": "Offline",
          "activity_sid": "WA98fb57313627153d707a17f549566046",
          "available_i": {
            "data": [
              0
            ],
            "type": "Buffer"
          },
          "row_crtn_dtm": "2019-10-24T12:58:48.000Z",
          "row_updt_dtm": "2019-10-24T12:58:48.000Z",
          "wfm_cde": "10",
          "workspace_sid": "WSde21cfcdde7bcb69cd82f1c060e5dba0"
        }
      ]);
    });
  });

  describe("remove button", () => {
    test("should display once for each activity; when clicked, activity should be removed", () => {
      const rendered = renderComponent([
        {
          "activity_id": 2,
          "activity_nme": "Available",
          "available_i": {
            "data": [
              1
            ],
            "type": "Buffer"
          }
        },
        {
          "activity_id": 1,
          "activity_nme": "Offline",
          "available_i": {
            "data": [
              0
            ],
            "type": "Buffer"
          }
        }
      ]);
      expectMockedComponent(rendered, { Delete }, 2);
      act(() => {
        fireEvent.click(getDeleteActivityButton(rendered, 1));
      });
      expect(mockSetActivitiesList).toHaveBeenCalledWith([
        {
          "activity_id": 2,
          "activity_nme": "Available",
          "available_i": {
            "data": [
              1
            ],
            "type": "Buffer"
          }
        }
      ]);
    });
  });
});