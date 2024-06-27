import { ProfileQueuesSelectField } from "../ProfileQueuesSelectField";
import {
  Add,
  Delete
} from "@mui/icons-material";
import { Dropdown } from "components/Dropdown";
import { useSkillState } from "context/appContext";
import React from "react";
import MockAdapter from "axios-mock-adapter";
import { myAxios } from "utils/myAxios";
import {
  expectMockedComponent,
  render,
  setupMockedComponents,
  fireEvent,
  getMockedComponentProps,
  mockAggregateQueues,
  initialTestState,
  skillsList
} from "testUtils";
import { theme } from "globals/theme";
import { apiPaths } from "globals";
import { ThemeProvider } from "styled-components";
import { act } from "react-dom/test-utils";
import { getAggregateQueuesType } from "services/aggregateQueues";

jest.mock("@mui/icons-material", () => ({
  Add: jest.fn(),
  Delete: jest.fn()
}));

jest.mock("components/Dropdown", () => ({
  Dropdown: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context/appContext", () => ({
  useSkillState: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Tooltip: jest.fn()
}));

jest.mock("services/aggregateQueues", () => ({
  getAggregateQueuesType: jest.fn()
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

getAggregateQueuesType.mockImplementation(() => { return Promise.resolve(200, { response: "success" } ); });

const statusCode = 500;
const axiosMock = new MockAdapter(myAxios);
const aggregateQueueTypeEndpoint = apiPaths.GET_AGGREGATE_QUEUES_TYPE;

const getAddTransferQueuesButton = rendered => rendered.getByTestId("add-queue-button");
const getDeleteTransferQueuesButton = (rendered, instance) => rendered.getAllByTestId("delete-queue-button")[instance];

describe("<ProfileQueuesSelectField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSkillState.mockReturnValue(initialTestState);
    setupMockedComponents({
      Add,
      Delete,
      Dropdown
    });
    axiosMock.onGet(aggregateQueueTypeEndpoint).reply(200, mockAggregateQueues);
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

  describe(aggregateQueueTypeEndpoint, () => {
    describe("aggregateQueueTypeEndpoint service call returned an error", () => {
      beforeEach(() => {
        axiosMock.onGet(aggregateQueueTypeEndpoint).reply(statusCode, { fail: "oh the horror" });
      });
      test("should return 'An error occurred while logging in.'", async () => {
        try {
          renderComponent([]);
        } catch(err) {
          expect(err.msg).toBe("Failed to fetch callTags from service");
        }
      });
    });
  });

  describe("changes made to the add transfer queue drop down", () => {
    beforeEach(() => {
      const mockNewSkill = [{
        name: "lscOBDialer1",
        ctmSkillId: -1,
        ctmSkillDisplayName: "lsc OB Dialer 1",
        profiles: [{
          profileName: "Licensed Sales Center",
          profileId: 32
        }],
        flashMessage: "",
        closedMessage: "",
        levels: [ 1, 2, 3],
        timeOfDays: [],
        vhCallTarget: null,
        vhThreshold: null
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockAggregateQueues, jest.fn()])
        .mockReturnValueOnce([mockNewSkill, jest.fn()])
        .mockReturnValueOnce([skillsList, jest.fn()]);
    });

    test("should render transfer queue drop down with correct options", () => {
      const rendered = renderComponent([{
        name: "aisgL1",
        ctmSkillId: 2,
        ctmSkillDisplayName: "aisg L1",
        profiles: [{
          profileName: "AISG",
          profileId: 4
        }],
        flashMessage: "",
        closedMessage: "Sorry, we're closed.",
        levels: [],
        timeOfDays: [],
        vhCallTarget: null,
        vhThreshold: null
      }]);
      expect(rendered.container).not.toHaveTextContent("lsc OB Dialer 1");
      act(() => {
        const { updateValue } = getMockedComponentProps(Dropdown);
        updateValue("", [{ value: 1 }] );
      });
      act(() => {
        fireEvent.click(getAddTransferQueuesButton(rendered));
      });
      expect(mockSetQueueList).toHaveBeenCalledWith([
        {
          name: "aisgL1",
          ctmSkillId: 2,
          ctmSkillDisplayName: "aisg L1",
          profiles: [{
            profileName: "AISG",
            profileId: 4
          }],
          flashMessage: "",
          closedMessage: "Sorry, we're closed.",
          levels: [],
          timeOfDays: [],
          vhCallTarget: null,
          vhThreshold: null
        },
        {
          aggregate_queues_id: 4,
          aggregate_queues_nme: "Licensed Sales Center",
          aggregate_queues_type: "aggregate",
          owner_type: "profile",
          worker_sid: null,
          row_crtn_dtm: "",
          row_updt_dtm: null
        }
      ]);
    });
  });

  describe("remove button", () => {
    beforeEach(() => {
      const mockNewSkill = [{
        name: "lscOBDialer1",
        ctmSkillId: -1,
        ctmSkillDisplayName: "lsc OB Dialer 1",
        profiles: [{
          profileName: "Licensed Sales Center",
          profileId: 32
        }],
        flashMessage: "",
        closedMessage: "",
        levels: [ 1, 2, 3],
        timeOfDays: [],
        vhCallTarget: null,
        vhThreshold: null
      }];
      React.useState = jest.fn()
        .mockReturnValueOnce([mockAggregateQueues, jest.fn()])
        .mockReturnValueOnce([mockNewSkill, jest.fn()])
        .mockReturnValueOnce([skillsList, jest.fn()]);
    });

    test("should display once for each transfer queue; when clicked, queue should be removed", () => {
      const rendered = renderComponent([
        {
          name: "aisgL1",
          ctmSkillId: 2,
          ctmSkillDisplayName: "aisg L1",
          profiles: [{
            profileName: "AISG",
            profileId: 4
          }],
          flashMessage: "",
          closedMessage: "Sorry, we're closed.",
          levels: [],
          timeOfDays: [],
          vhCallTarget: null,
          vhThreshold: null
        },
        {
          name: "lscOBDialer1",
          ctmSkillId: -1,
          ctmSkillDisplayName: "lsc OB Dialer 1",
          profiles: [{
            profileName: "Licensed Sales Center",
            profileId: 32
          }],
          flashMessage: "",
          closedMessage: "",
          levels: [ 1, 2, 3],
          timeOfDays: [],
          vhCallTarget: null,
          vhThreshold: null
        }
      ]);
      expectMockedComponent(rendered, { Delete }, 2);
      act(() => {
        fireEvent.click(getDeleteTransferQueuesButton(rendered, 1));
      });
      expect(mockSetQueueList).toHaveBeenCalledWith([
        {
          name: "aisgL1",
          ctmSkillId: 2,
          ctmSkillDisplayName: "aisg L1",
          profiles: [{
            profileName: "AISG",
            profileId: 4
          }],
          flashMessage: "",
          closedMessage: "Sorry, we're closed.",
          levels: [],
          timeOfDays: [],
          vhCallTarget: null,
          vhThreshold: null
        }
      ]);
    });
  });
});
