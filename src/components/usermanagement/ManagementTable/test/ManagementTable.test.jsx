import ManagementTable from "../ManagementTable";
import { EditUserModal } from "components";
import { theme } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  fireEvent,
  getTestState,
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components", () => ({
  __esModule: true,
  EditUserModal: jest.fn()
}));

const mockWorkerData = [
  {
    attributes: {
      full_name: "Test 1",
      office_location_name: "Neptune",
      routing: {
        skills: [
          "466",
          "psuUm"
        ],
        levels: {
          "466": 3
        }
      }
    },
    id: "n1234567",
    sid: "WK0"
  },
  {
    attributes: {
      full_name: "Test 2",
      office_location_name: "Uranus"
    },
    id: "n0999999",
    sid: "WK1"
  },
  {
    attributes: {
      full_name: "Test 3",
      office_location_name: "Jupiter",
      routing: {
        skills: [],
        levels: {}
      }
    },
    id: "n0498575",
    sid: "WK2"
  }
];

describe("<ManagementTable />", () => {
  beforeEach(() => setupMockedComponents({ EditUserModal }));
  test("with no workers, we should just render a header.", () => {
    const rendered = render(<ManagementTable workers={[]} />);
    expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("N NUMBER", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("OFFICE", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("SKILLS (Current)", { selector: "th" })).toBeInTheDocument();
  });
  test("with workers, we should display full name, id & office location for each", () => {
    const rendered = render(<ManagementTable workers={mockWorkerData} />);
    mockWorkerData.forEach(entry => {
      expect(rendered.container).toHaveTextContent(entry.attributes.full_name);
      expect(rendered.container).toHaveTextContent(entry.id);
      expect(rendered.container).toHaveTextContent(entry.attributes.office_location_name);
      expect(rendered.container).not.toHaveTextContent(entry.sid);
    });
  });
  test("for workers with skills and/or priorities, we should show the correct information and format", () => {
    const rendered = render(<ManagementTable workers={mockWorkerData} />);
    const mockWorkerOneRoutingSkills = mockWorkerData[0].attributes.routing.skills;
    const mockWorkerOneRoutingLevels = mockWorkerData[0].attributes.routing.levels;
    expect(rendered.container).toHaveTextContent(`${mockWorkerOneRoutingSkills[0]} - ${mockWorkerOneRoutingLevels[mockWorkerOneRoutingSkills[0]]}`);
    expect(rendered.container).toHaveTextContent(mockWorkerOneRoutingSkills[1]);
  });
  describe("user rows are clicked", () => {
    test("should dispatch toggleWorkerSelected actions and highlight rows of selected workers", () => {
      const state = getTestState();
      const rendered = render(<ManagementTable workers={mockWorkerData} />, state);
      const tableRows = rendered.getAllByTestId("table-row");
      expect(tableRows).toHaveLength(3);
      act(() => fireEvent.click(tableRows[0]));
      act(() => fireEvent.click(tableRows[2]));
      expect(mockStore.getActions()).toEqual([
        {
          type: "toggleWorkerSelected",
          payload: mockWorkerData[0].sid
        },
        {
          type: "toggleWorkerSelected",
          payload: mockWorkerData[2].sid
        }
      ]);
      expect(tableRows[0]).toHaveStyleRule("background-color", theme.tableRow.selectedColor);
      expect(tableRows[1]).toHaveStyleRule("background-color", "inherit");
      expect(tableRows[2]).toHaveStyleRule("background-color", theme.tableRow.selectedColor);
    });
  });
  describe("Edit icon is clicked in row", () => {
    test("should show EditUserModal for corresponding worker, not highlight the row as selected, and close EditUserModal when handleClose is fired", () => {
      const rendered = render(<ManagementTable workers={mockWorkerData} />);
      const editButtons = rendered.getAllByTestId("edit-button");
      expectMockedComponent(rendered, { EditUserModal }, 0);
      const indexClicked = 1;
      act(() => fireEvent.click(editButtons[indexClicked]));
      expectMockedComponent(rendered, { EditUserModal }, 1);
      const handleClose = EditUserModal.mock.calls[0][0].handleClose;
      expectOnlyPassedProps(EditUserModal, {
        handleClose,
        worker: mockWorkerData[indexClicked]
      });
      act(() => handleClose());
      expectMockedComponent(rendered, { EditUserModal }, 0);
      const tableRows = rendered.getAllByTestId("table-row");
      expect(tableRows[indexClicked]).toHaveStyleRule("background-color", "inherit");
    });
  });
});