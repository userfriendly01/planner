import ManagementTable from "../ManagementTable";
import MockAdapter from "axios-mock-adapter";
import {
  ConfirmationModal,
  EditUserModal,
  StatusOverlay
} from "components";
import {
  apiPaths,
  theme
} from "globals";
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
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.mock("components", () => ({
  __esModule: true,
  ConfirmationModal: jest.fn(),
  EditUserModal: jest.fn(),
  StatusOverlay: jest.fn()
}));

const mockWorkerData = [
  {
    attributes: {
      default_skills: {
        skills: [
          "466",
          "psuUm"
        ],
        levels: {
          "466": 3
        }
      },
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
    sid: "WK0",
    skillsDifferent: false
  },
  {
    attributes: {
      full_name: "Test 2",
      office_location_name: "Uranus"
    },
    id: "n0999999",
    sid: "WK1",
    skillsDifferent: false
  },
  {
    attributes: {
      default_skills: {
        skills: ["466"],
        levels: {}
      },
      full_name: "Test 3",
      office_location_name: "Jupiter",
      routing: {
        skills: [],
        levels: {}
      }
    },
    id: "n0498575",
    sid: "WK2",
    skillsDifferent: true
  }
];

const setDeltaToggle = jest.fn();

const renderComponent = (workers, toggle = false, state) => {
  return render(
    <ManagementTable
      deltaToggle={toggle}
      setDeltaToggle={setDeltaToggle}
      workers={workers}
    />, state);
};

describe("<ManagementTable />", () => {
  beforeEach(() => {
    setupMockedComponents({
      ConfirmationModal,
      EditUserModal,
      StatusOverlay
    });
    axiosMock.reset();
    mockStore.reset();
    setDeltaToggle.mockClear();
  });
  test("with no workers, we should just render a header.", () => {
    const rendered = renderComponent([]);
    expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("N NUMBER", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("OFFICE", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("SKILLS (Current)", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("SKILLS (Default)", { selector: "th" })).toBeInTheDocument();
  });
  test("with workers, we should display full name, id & office location for each", () => {
    const rendered = renderComponent(mockWorkerData);
    mockWorkerData.forEach(entry => {
      expect(rendered.container).toHaveTextContent(entry.attributes.full_name);
      expect(rendered.container).toHaveTextContent(entry.id);
      expect(rendered.container).toHaveTextContent(entry.attributes.office_location_name);
      expect(rendered.container).not.toHaveTextContent(entry.sid);
    });
  });
  test("for workers with skills and/or priorities, we should show the correct information and format", () => {
    const rendered = renderComponent(mockWorkerData);
    const mockWorkerOneRoutingSkills = mockWorkerData[0].attributes.routing.skills;
    const mockWorkerOneRoutingLevels = mockWorkerData[0].attributes.routing.levels;
    expect(rendered.container).toHaveTextContent(`${mockWorkerOneRoutingSkills[0]} - ${mockWorkerOneRoutingLevels[mockWorkerOneRoutingSkills[0]]}`);
    expect(rendered.container).toHaveTextContent(mockWorkerOneRoutingSkills[1]);
  });
  test("for workers with default skills and/or priorities, we should show the correct information and format", () => {
    const rendered = renderComponent(mockWorkerData);
    const mockWorkerOneDefaultSkills = mockWorkerData[0].attributes.default_skills.skills;
    const mockWorkerOneDefaultLevels = mockWorkerData[0].attributes.default_skills.levels;
    expect(rendered.container).toHaveTextContent(`${mockWorkerOneDefaultSkills[0]} - ${mockWorkerOneDefaultLevels[mockWorkerOneDefaultSkills[0]]}`);
    expect(rendered.container).toHaveTextContent(mockWorkerOneDefaultSkills[1]);
  });
  test("for workers with applied skills and/or priorities that differ from the default, we should show a delta icon", () => {
    const rendered = renderComponent(mockWorkerData);
    expect(rendered.getAllByTestId("delta-icon")).toHaveLength(1);
  });
  describe("user rows are clicked", () => {
    test("should dispatch toggleWorkerSelected actions and highlight rows of selected workers, reset button should enable", () => {
      const state = getTestState();
      const rendered = render(<ManagementTable deltaToggle={false} setDeltaToggle={setDeltaToggle} workers={mockWorkerData} />, state);
      const tableRows = rendered.getAllByTestId("table-row");
      expect(tableRows).toHaveLength(3);
      act(() => fireEvent.click(tableRows[0]));
      act(() => fireEvent.click(tableRows[2]));
      expect(mockStore.getActions()).toEqual([
        {
          type: "toggleWorkerSelected",
          payload: {
            name: mockWorkerData[0].attributes.full_name,
            sid: mockWorkerData[0].sid
          }
        },
        {
          type: "toggleWorkerSelected",
          payload: {
            name: mockWorkerData[2].attributes.full_name,
            sid: mockWorkerData[2].sid
          }
        }
      ]);
      expect(tableRows[0]).toHaveStyleRule("background-color", theme.tableRow.selectedColor);
      expect(tableRows[1]).toHaveStyleRule("background-color", "inherit");
      expect(tableRows[2]).toHaveStyleRule("background-color", theme.tableRow.selectedColor);
    });
  });

  describe("Delete icon is clicked in row", () => {
    test("should display ConfirmationModal", () => {
      const rendered = renderComponent(mockWorkerData);
    const deleteButtons = rendered.getAllByTestId("delete-button");
    expectMockedComponent(rendered, { ConfirmationModal }, 0);
    const indexClicked = 1;
      act(() => fireEvent.click(deleteButtons[indexClicked]));
      const confirmationText = ConfirmationModal.mock.calls[0][0].confirmationText;
      expectMockedComponent(rendered, { ConfirmationModal }, 1);
      expect(confirmationText).toBe("Are you sure you want to delete the following worker? Test 2");
    });
    test("when the ConfirmationModal is cancelled, handleClose is called", () => {
      const rendered = renderComponent(mockWorkerData);
      const deleteButtons = rendered.getAllByTestId("delete-button");
      expectMockedComponent(rendered, { ConfirmationModal }, 0);
      const indexClicked = 1;
      act(() => fireEvent.click(deleteButtons[indexClicked]));
      expectMockedComponent(rendered, { ConfirmationModal }, 1);
      const handleClose = ConfirmationModal.mock.calls[0][0].handleClose;
      act(() => handleClose());
      expectMockedComponent(rendered, { ConfirmationModal }, 0);
    });
    describe("When the confirmFunction is run, deleteUser is initiated", () => {
      test("DeleteUser is successful", done => {
        const workerSid = mockWorkerData[1].sid;
        axiosMock.onDelete(apiPaths.DELETE_WORKER(workerSid)).reply(200, { whatever: "lol" });
        const rendered = renderComponent(mockWorkerData);
        const deleteButtons = rendered.getAllByTestId("delete-button");
        expectMockedComponent(rendered, { ConfirmationModal }, 0);
        const indexClicked = 1;
        act(() => fireEvent.click(deleteButtons[indexClicked]));
        expectMockedComponent(rendered, { ConfirmationModal }, 1);
        const confirmFunction = ConfirmationModal.mock.calls[0][0].confirmFunction;
        act(() => {
          confirmFunction().then(() => {
            const actions = mockStore.getActions();
            expect(actions).toHaveLength(1);
            expect(actions[0]).toEqual({
              type: "deleteWorker",
              payload: workerSid
            });
            done();
          });
        });
      });
      test("DeleteUser is successful", done => {
        const workerSid = mockWorkerData[1].sid;
        axiosMock.onDelete(apiPaths.DELETE_WORKER(workerSid)).reply(500, { error: "meh" });
        const rendered = renderComponent(mockWorkerData);
        const deleteButtons = rendered.getAllByTestId("delete-button");
        expectMockedComponent(rendered, { ConfirmationModal }, 0);
        const indexClicked = 1;
        act(() => fireEvent.click(deleteButtons[indexClicked]));
        expectMockedComponent(rendered, { ConfirmationModal }, 1);
        const confirmFunction = ConfirmationModal.mock.calls[0][0].confirmFunction;
        act(() => {
          confirmFunction().catch(() => {
            const actions = mockStore.getActions();
            expect(actions).toHaveLength(0);
            done();
          });
        });
      });
    })
  });

  describe("Edit icon is clicked in row", () => {
    test("should show EditUserModal for corresponding worker, not highlight the row as selected, and close EditUserModal when handleClose is fired", () => {
      const rendered = renderComponent(mockWorkerData);
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
  describe("Change the Delta Switch icon is clicked in row", () => {
    test("should fire the method sent in to the component to update the filter upstream", () => {
      const rendered = renderComponent(mockWorkerData);
      act(() => fireEvent.click(rendered.getByLabelText("toggle skills modified")));
      expect(setDeltaToggle.mock.calls).toHaveLength(1);
    });
  });
  describe("resettingSkills is true", () => {
    const resettingSkills = true;
    test("should render StatusOverlay", () => {
      const state = getTestState();
      state.resettingSkills = resettingSkills;
      const rendered = renderComponent([], false, state);
      expectMockedComponent(rendered, { StatusOverlay });
    });
  });
  describe("resettingSkills is false", () => {
    const resettingSkills = false;
    test("should not render StatusOverlay", () => {
      const state = getTestState();
      state.resettingSkills = resettingSkills;
      const rendered = renderComponent([], false, state);
      expectMockedComponent(rendered, { StatusOverlay }, 0);
    });
  });
});