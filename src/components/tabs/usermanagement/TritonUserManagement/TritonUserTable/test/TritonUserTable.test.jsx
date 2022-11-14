import ManagementTable from "../TritonUserTable";
import { ModalOverlay } from "components";
import { theme } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  getTestState,
  initialTestState,
  mockStore,
  render,
  setupMockedComponents
} from "testUtils";
import {
  useAdminState,
  useFormDispatch
} from "context";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  ModalOverlay: jest.fn()
}));

jest.mock("context", () => ({
  __esModule: true,
  useAdminState: jest.fn(),
  useAdminDispatch: jest.requireActual("context").useAdminDispatch,
  useFormDispatch: jest.fn(),
  userFormActions: jest.requireActual("context").userFormActions,
  initialState: jest.requireActual("context").initialState
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
      n_number: "n123",
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
    sid: "WK0",
    skillsDifferent: false
  },
  {
    attributes: {
      full_name: "Test 2",
      n_number: "n456",
      office_location_name: "Uranus"
    },
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
      n_number: "n6789",
      office_location_name: "Jupiter",
      routing: {
        skills: [],
        levels: {}
      }
    },
    sid: "WK2",
    skillsDifferent: true
  }
];
const skills = [
  {
    skill: "aisgl1"
  }
];

const testState = {
  ...initialTestState,
  workerContext: {
    ...initialTestState.workerContext,
    selectedWorkers: mockWorkerData
  },
  skillContext: {
    skills: skills
  }
};
const setDeltaToggle = jest.fn();
const mockSetForm = jest.fn();
const workerOpts = {};
const setWorkerOpts = jest.fn();

const renderComponent = (workers, toggle = false, state) => {
  return render(
    <ManagementTable
      deltaToggle={toggle}
      workerOpts={workerOpts}
      setWorkerOpts={setWorkerOpts}
      setDeltaToggle={setDeltaToggle}
      paginatedWorkers={workers}
    />, state);
};

describe("<TritonUserTable />", () => {
  beforeEach(() => {
    setupMockedComponents({
      ModalOverlay
    });
    jest.clearAllMocks();
    mockStore.reset();
    setDeltaToggle.mockClear();
    useAdminState.mockReturnValue(testState);
    useFormDispatch.mockReturnValue(mockSetForm);
  });
  test("with no workers, we should just render a header.", () => {
    const rendered = renderComponent([]);
    expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("N NUMBER", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("OFFICE", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("SKILLS (Current)", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("SKILLS (Default)", { selector: "th" })).toBeInTheDocument();
  });
  test("with workers, we should display full name, n number & office location for each", () => {
    const rendered = renderComponent(mockWorkerData);
    mockWorkerData.forEach(entry => {
      expect(rendered.container).toHaveTextContent(entry.attributes.full_name);
      expect(rendered.container).toHaveTextContent(entry.attributes.office_location_name);
      expect(rendered.container).toHaveTextContent(entry.attributes.n_number);
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
      const rendered = render(<ManagementTable deltaToggle={false} setDeltaToggle={setDeltaToggle} paginatedWorkers={mockWorkerData} />, state);
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
      expect(tableRows[1]).toHaveStyleRule("background-color", "#AAEDED");
      expect(tableRows[2]).toHaveStyleRule("background-color", theme.tableRow.selectedColor);
    });
  });
  describe("Delete icon is clicked in row", () => {
    test("should display ConfirmationModal", () => {
      const rendered = renderComponent(mockWorkerData);
      const deleteButtons = rendered.getAllByTestId("delete-button");
      //Faith - Update asserts here for new edit and delete validations
      const indexClicked = 1;
      act(() => fireEvent.click(deleteButtons[indexClicked]));
    });
  });
  describe("Edit icon is clicked in row", () => {
    test("should show UserEntryForm for corresponding worker, not highlight the row as selected, and close UserEntryForm when handleClose is fired", () => {
      const rendered = renderComponent(mockWorkerData);
      const editButtons = rendered.getAllByTestId("edit-button");
      //Faith - Update asserts here for new edit and delete validations
      const indexClicked = 1;
      act(() => fireEvent.click(editButtons[indexClicked]));
      const tableRows = rendered.getAllByTestId("table-row");
      expect(tableRows[indexClicked]).toHaveStyleRule("background-color", "#AAEDED");
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
    test("should render ModalOverlay", () => {
      const state = {
        ...testState
      };
      state.resettingSkills = resettingSkills;
      const rendered = renderComponent([], false, state);
      // expectMockedComponent(rendered, { ModalOverlay });
      //Faith fix these
    });
  });
  describe("resettingSkills is false", () => {
    const resettingSkills = false;
    test("should not render ModalOverlay", () => {
      const state = getTestState();
      state.resettingSkills = resettingSkills;
      const rendered = renderComponent([], false, state);
      expectMockedComponent(rendered, { ModalOverlay }, 0);
    });
  });
});