import ManagementTable from "../ManagementTable";
import { EditUserModal } from "components";
import { initialState } from "context";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  fireEvent,
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
      office_location_name: "Neptune"
    },
    id: "n1234567",
    sid: "WK054367358673954087634"
  },
  {
    attributes: {
      full_name: "Test 2",
      office_location_name: "Uranus"
    },
    id: "n0999999",
    sid: "WK054367358673954087634"
  },
  {
    attributes: {
      full_name: "Test 3",
      office_location_name: "Jupiter"
    },
    id: "n0498575",
    sid: "WK054367358673954087634"
  }
];

const initialTestState  = {
  ...initialState,
  isAddEditModalOpen: false
};

describe("<ManagementTable />", () => {
  beforeEach(() => setupMockedComponents({ EditUserModal }));
  test("with no workers, we should just render a header.", () => {
    const rendered = render(<ManagementTable workers={[]} />);
    expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("N NUMBER", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("OFFICE", { selector: "th" })).toBeInTheDocument();
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
  describe("user row is clicked", () => {
    test("should open the edit user modal for the selected worker; when handleClose is called, should close the modal", () => {
      const rendered = render(<ManagementTable workers={mockWorkerData} />, initialTestState);
      const tableRow = rendered.getAllByTestId("table-row");
      expectMockedComponent(rendered, { EditUserModal }, 0);
      act(() => fireEvent.click(tableRow[0]));
      expectMockedComponent(rendered, { EditUserModal });
      const handleClose = EditUserModal.mock.calls[0][0].handleClose;
      expectOnlyPassedProps(EditUserModal, {
        handleClose,
        worker: mockWorkerData[0]
      });
      act(() => handleClose());
      expectMockedComponent(rendered, { EditUserModal }, 0);
    });
  });
});