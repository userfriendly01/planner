import ProfileQueuesSelectField from "../ProfileQueuesSelectField";
import {
  Add,
  Delete
} from "@mui/icons-material";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  fireEvent,
  getMockedComponentProps,
  initialTestState,
  skillsList
} from "testUtils";
import { theme } from "globals";
import { ThemeProvider } from "styled-components";
import { act } from "react-dom/test-utils";
import { getAggregateQueuesType } from "services";

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

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const mockSetQueueList = jest.fn();
const renderComponent = mockTransferQueues => render(
  <ThemeProvider theme={theme}>
    <ProfileQueuesSelectField
      transferQueues={mockTransferQueues}
      setQueueList={mockSetQueueList}
    />
  </ThemeProvider>
);

getAggregateQueuesType.mockImplementation(() => {
  return Promise.resolve([{
    aggregate_queues_id: 1,
    aggregate_queues_nme: 'Licensed Sales Center',
    aggregate_queues_type: 'aggregate',
    owner_type: 'profile',
    worker_sid: null,
    row_crtn_dtm: '',
    row_updt_dtm: null
  }]);
});

const getAddTransferQueuesButton = rendered => rendered.getByTestId("add-queue-button");
const getDeleteTransferQueuesButton = (rendered, instance) => rendered.getAllByTestId("delete-queue-button")[instance];

describe("<ProfileQueuesSelectField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(initialTestState);
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

  // describe("changes made to the add transfer queue drop down", () => {
  //   beforeEach(() => {
  //     const mockNewSkill = [{
  //       name: "lscOBDialer1",
  //       ctmSkillId: 1,
  //       ctmSkillDisplayName: "lsc OB Dialer 1",
  //       profiles: [{
  //         profileName: "Licensed Sales Center",
  //         profileId: 32
  //       }],
  //       flashMessage: "",
  //       closedMessage: "",
  //       levels: [ 1, 2, 3],
  //       timeOfDays: [],
  //       vhCallTarget: null,
  //       vhCallerId: null,
  //       vhThreshold: null
  //     }];
  //     React.useState = jest.fn()
  //       .mockReturnValueOnce([mockNewSkill, jest.fn()])
  //       .mockReturnValueOnce([skillsList, jest.fn()]);
  //   });

  //   test("should render transfer queue drop down with correct options", () => {
  //     const rendered = renderComponent([{
  //       name: "aisgL1",
  //       ctmSkillId: 2,
  //       ctmSkillDisplayName: "aisg L1",
  //       profiles: [{
  //         profileName: "AISG",
  //         profileId: 4
  //       }],
  //       flashMessage: "",
  //       closedMessage: "Sorry, we're closed.",
  //       levels: [],
  //       timeOfDays: [],
  //       vhCallTarget: null,
  //       vhCallerId: null,
  //       vhThreshold: null
  //     }]);
  //     expect(rendered.container).not.toHaveTextContent("lsc OB Dialer 1");
  //     act(() => {
  //       const { updateValue } = getMockedComponentProps(Dropdown);
  //       updateValue("", [{ value: 1 }] );
  //     });
  //     act(() => {
  //       fireEvent.click(getAddTransferQueuesButton(rendered));
  //     });
  //     expect(mockSetQueueList).toHaveBeenCalledWith([
  //       {
  //         name: "aisgL1",
  //         ctmSkillId: 2,
  //         ctmSkillDisplayName: "aisg L1",
  //         profiles: [{
  //           profileName: "AISG",
  //           profileId: 4
  //         }],
  //         flashMessage: "",
  //         closedMessage: "Sorry, we're closed.",
  //         levels: [],
  //         timeOfDays: [],
  //         vhCallTarget: null,
  //         vhCallerId: null,
  //         vhThreshold: null
  //       },
  //       {
  //         name: "lscOBDialer1",
  //         ctmSkillId: 1,
  //         ctmSkillDisplayName: "lsc OB Dialer 1",
  //         profiles: [{
  //           profileName: "Licensed Sales Center",
  //           profileId: 32
  //         }],
  //         flashMessage: "",
  //         closedMessage: "",
  //         levels: [ 1, 2, 3],
  //         timeOfDays: [],
  //         vhCallTarget: null,
  //         vhCallerId: null,
  //         vhThreshold: null
  //       }
  //     ]);
  //   });
  // });

  // describe("remove button", () => {
  //   beforeEach(() => {
  //     const mockNewSkill = [{
  //       name: "lscOBDialer1",
  //       ctmSkillId: 1,
  //       ctmSkillDisplayName: "lsc OB Dialer 1",
  //       profiles: [{
  //         profileName: "Licensed Sales Center",
  //         profileId: 32
  //       }],
  //       flashMessage: "",
  //       closedMessage: "",
  //       levels: [ 1, 2, 3],
  //       timeOfDays: [],
  //       vhCallTarget: null,
  //       vhCallerId: null,
  //       vhThreshold: null
  //     }];
  //     React.useState = jest.fn()
  //       .mockReturnValueOnce([mockNewSkill, jest.fn()])
  //       .mockReturnValueOnce([skillsList, jest.fn()]);
  //   });

  //   test("should display once for each transfer queue; when clicked, queue should be removed", () => {
  //     const rendered = renderComponent([
  //       {
  //         name: "aisgL1",
  //         ctmSkillId: 2,
  //         ctmSkillDisplayName: "aisg L1",
  //         profiles: [{
  //           profileName: "AISG",
  //           profileId: 4
  //         }],
  //         flashMessage: "",
  //         closedMessage: "Sorry, we're closed.",
  //         levels: [],
  //         timeOfDays: [],
  //         vhCallTarget: null,
  //         vhCallerId: null,
  //         vhThreshold: null
  //       },
  //       {
  //         name: "lscOBDialer1",
  //         ctmSkillId: 1,
  //         ctmSkillDisplayName: "lsc OB Dialer 1",
  //         profiles: [{
  //           profileName: "Licensed Sales Center",
  //           profileId: 32
  //         }],
  //         flashMessage: "",
  //         closedMessage: "",
  //         levels: [ 1, 2, 3],
  //         timeOfDays: [],
  //         vhCallTarget: null,
  //         vhCallerId: null,
  //         vhThreshold: null
  //       }
  //     ]);
  //     expectMockedComponent(rendered, { Delete }, 2);
  //     act(() => {
  //       fireEvent.click(getDeleteTransferQueuesButton(rendered, 1));
  //     });
  //     expect(mockSetQueueList).toHaveBeenCalledWith([
  //       {
  //         name: "aisgL1",
  //         ctmSkillId: 2,
  //         ctmSkillDisplayName: "aisg L1",
  //         profiles: [{
  //           profileName: "AISG",
  //           profileId: 4
  //         }],
  //         flashMessage: "",
  //         closedMessage: "Sorry, we're closed.",
  //         levels: [],
  //         timeOfDays: [],
  //         vhCallTarget: null,
  //         vhCallerId: null,
  //         vhThreshold: null
  //       }
  //     ]);
  //   });
  // });
});
