import React from "react";
import BulkCreateForm from "../BulkCreateForm";
import { useAdminState } from "context";
import {
  Row,
  StepWrapper,
  SelectionWrapper
} from "../../BulkChanges.Styles";
// import { updateSelectedTemplates } from "../BulkUtils/utils";
// import { getCreateTemplates } from "../BulkUtils/templates";
import Checkbox from "@mui/material";
import {
  initialTestState,
  render,
  fireEvent,
  act,
  setupMockedComponents,
  expectMockedComponent,
  expectOnlyPassedProps,
  initialFormState,
  managerList,
  mockSkills,
  mockWorkers,
  profileList
} from "testUtils";

// jest.mock("../BulkChanges.Styles", () => ({
//   Row: jest.fn(),
//   StepWrapper: jest.fn(),
//   SelectionWrapper: jest.fn()
// }));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Checkbox: jest.fn(),
  TextField: jest.fn(),
  Button: jest.fn(),
  Paper: jest.fn(),
  Tabs: jest.fn(),
  Tab: jest.fn(),
  Tooltip: jest.fn(),
  Divider: jest.fn()
}));

const emptyState = {
  profileContext: {
    profiles: []
  },
  managerContext: {
    managers: []
  },
  skillContext: {
    skills: []
  },
  calabrioContext: {
    groups: [],
    teams: []
  }
};

const mockSetSelectedTemplates = jest.fn();

describe("<BulkCreateForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
    // setupMockedComponents({ // This breaks, not sure why
    //   Checkbox
    // });
    mockSetSelectedTemplates.mockClear();
  });

  const renderComponent = selectedTemplates => {
    return render(
      <BulkCreateForm
        selectedTemplates = {selectedTemplates}
        setSelectedTemplates={mockSetSelectedTemplates}
      />,
      emptyState
    );
  };

  describe("Triton User Tests", () => {
    test("test", () => {
      useAdminState.mockReturnValue(emptyState);
      const rendered = renderComponent([{}]);
      expect(useAdminState).toHaveBeenCalledTimes(1);
      expect(rendered.container).toHaveTextContent("Step 1: Choose the applicable systemsTwilioCalabrio QM");
      // How to get a reference to the checkboxes so we can click them?
    });
  });
});