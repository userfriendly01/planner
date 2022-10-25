import ProfileActivitiesSelectField from "../ProfileActivitiesSelectField";
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
  mockActivities,
  waitFor
} from "testUtils";
import { apiPaths } from "globals";
import {
  useAdminState,
  useAdminDispatch
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
  useAdminState: jest.fn(),
  useAdminDispatch: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  Dropdown: jest.fn(),
  StyledButton: jest.fn()
}));

const statusCode = 500;
const axiosMock = new MockAdapter(myAxios);
const activitiesEndpoint = apiPaths.GET_ACTIVITIES;
const mockSetActivitiesList = jest.fn();
const mockAdminDispatch = jest.fn();
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
    useAdminDispatch.mockReturnValue(mockAdminDispatch);
    axiosMock.onGet(activitiesEndpoint).reply(200, mockActivities);
  });

  describe("initial state", () => {
    test("should render activities select component with no activities selected", async () => {
      const rendered = renderComponent([]);
      expectMockedComponent(rendered, { Dropdown });
      expectMockedComponent(rendered, { Add });
      expectMockedComponent(rendered, { Delete }, 0);
      await waitFor(() => {
        expect(mockAdminDispatch).toHaveBeenCalledTimes(1);
        expect(mockAdminDispatch).toHaveBeenCalledWith({
          type: "loadActivities",
          payload: mockActivities
        });
      });
    });
  });

  describe(activitiesEndpoint, () => {
    describe("activities service call returned an error", () => {
      beforeEach(() => {
        axiosMock.onGet(activitiesEndpoint).reply(statusCode, { fail: "oh the horror" });
      });
      test("should return 'An error occurred while logging in.'", async () => {
        try {
          renderComponent([]);
        } catch(err) {
          expect(err.msg).toBe("Failed to fetch activities from service");
        }
      });
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
