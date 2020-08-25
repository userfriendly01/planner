import DialListTable from "../DialListTable";
import MockAdapter from "axios-mock-adapter";
import {
  DialListEntryForm,
  ModalOverlay,
  StyledButton
} from "components";
import {
  apiPaths,
  formModes,
  modalOverlayStatuses,
  modalOverlayTimeout
} from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  expectOnlyPassedProps,
  fireEvent,
  getLastInstanceCalled,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  waitFor,
  within
} from "testUtils";
import { myAxios } from "utils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  DialListEntryForm: jest.fn(),
  ModalOverlay: jest.fn(),
  StyledButton: jest.fn()
}));

const axiosMock = new MockAdapter(myAxios);

const profileId = "89";
const refreshProfileData = jest.fn();

const renderComponent = ({
  dialList
}) => render(<DialListTable dialList={dialList} profileId={profileId} refreshProfileData={refreshProfileData} />);

describe("<DialListTable />", () => {

  let confirmSpy;
  beforeAll(() => {
    confirmSpy = jest.spyOn(window, "confirm");
    confirmSpy.mockImplementation(jest.fn(() => true)); // confirm popup always true
  });
  afterAll(() => confirmSpy.mockRestore());

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      DialListEntryForm,
      ModalOverlay,
      StyledButton
    });
  });

  describe("profile does not have entries in its dial list", () => {
    const dialList = [];

    test("should render 'no entries exist' message", () => {
      const rendered = renderComponent({
        dialList
      });
      expect(rendered.container).toHaveTextContent("No dial list entries exist for this profile");
    });

    test("should render add button", () => {
      const rendered = renderComponent({
        dialList
      });
      expectMockedComponent(rendered, { StyledButton });
    });

    test("add button clicked should render dialListEntryForm with correct props", () => {
      renderComponent({
        dialList
      });
      const addButtonOnClick = getMockedComponentProps(StyledButton, 0).onClick;
      act(() => {
        addButtonOnClick();
      });
      expectOnlyPassedProps(DialListEntryForm, {
        dialListTableState: {
          dialListEntryFormInitialValues: {
            contact_nme: "",
            contact_num: "",
            external_num: ""
          },
          dialListEntryFormMode: formModes.INSERT,
          isDialListEntryFormOpen: true,
          otherContactNums: []
        }
      }, getLastInstanceCalled(DialListEntryForm));
    });
  });

  describe("profile has entries in its dial list", () => {
    const dialList = [
      {
        diallist_id: 16,
        contact_nme: "Bo Jackson",
        contact_num: "800-123-4567"
      },
      {
        diallist_id: 18,
        contact_nme: "Daryl Strawberry",
        contact_num: "800-123-4568",
        external_num: "900-555-1212"
      },
      {
        diallist_id: 20,
        contact_nme: "Michael Jack Schmidt",
        contact_num: "800-123-4569"
      }
    ];

    test("should render add button", () => {
      const rendered = renderComponent({
        dialList
      });
      expectMockedComponent(rendered, { StyledButton });
    });

    test("should render add button, header and correct info for each dial list entry", () => {
      const rendered = renderComponent({
        dialList
      });
      expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
      expect(rendered.getByText("NUMBER", { selector: "th" })).toBeInTheDocument();
      const tableRows = rendered.getAllByTestId("table-row");
      expect(tableRows.length).toBe(3);
      dialList.forEach(entry => {
        expect(rendered.container).toHaveTextContent(entry.contact_nme);
        expect(rendered.container).toHaveTextContent(entry.contact_num);
        const row = rendered.getByText(entry.contact_nme).closest("tr");
        const utils = within(row);
        expect(utils.getByTestId("edit-button")).toBeInTheDocument();
        expect(utils.getByTestId("delete-button")).toBeInTheDocument();
      });
    });


    describe("dial list entry buttons for dialListId = 18", () => {
      const entry = dialList[1]; // second entry

      test("edit button clicked should render dialListEntryForm with correct props", () => {
        const rendered = renderComponent({
          dialList
        });
        expect(rendered.container).toHaveTextContent(entry.contact_nme);
        expect(rendered.container).toHaveTextContent(entry.contact_num);
        const row = rendered.getByText(entry.contact_nme).closest("tr");
        const utils = within(row);
        const editButtonElement = utils.getByTestId("edit-button");
        act(() => {
          fireEvent.click(editButtonElement);
        });
        expectOnlyPassedProps(DialListEntryForm, {
          dialListTableState: {
            dialListEntryFormInitialValues: {
              contact_nme: entry.contact_nme,
              contact_num: entry.contact_num,
              external_num: entry.external_num
            },
            dialListEntryFormMode: formModes.UPDATE,
            dialListId: entry.diallist_id,
            isDialListEntryFormOpen: true,
            otherContactNums: [dialList[0].contact_num, dialList[2].contact_num]
          }
        }, getLastInstanceCalled(DialListEntryForm));
      });

      describe("delete service call succeeds", () => {
        beforeEach(() => {
          axiosMock.onDelete(apiPaths.DIAL_LIST_ENTRY(entry.diallist_id)).reply(200, { whatever: "lol" });
        });

        test("delete button clicked should render dialListEntryForm with correct props", async () => {
          const rendered = renderComponent({
            dialList
          });
          expect(rendered.container).toHaveTextContent(entry.contact_nme);
          expect(rendered.container).toHaveTextContent(entry.contact_num);
          const row = rendered.getByText(entry.contact_nme).closest("tr");
          const utils = within(row);
          const deleteButtonElement = utils.getByTestId("delete-button");
          await act(() => {
            fireEvent.click(deleteButtonElement);
          });
          // advance timers so overlay times out
          // jest.advanceTimersByTime(modalOverlayTimeout);
          await waitFor(() => {
            expectOnlyPassedProps(ModalOverlay, {
              message: "Deleting dial list entry...",
              status: modalOverlayStatuses.SAVING
            }, getLastInstanceCalled(ModalOverlay) - 1);
            expect(refreshProfileData).toHaveBeenCalledTimes(1);
            expectOnlyPassedProps(ModalOverlay, {
              message: "Successfully deleted dial list entry",
              status: modalOverlayStatuses.SUCCESS
            }, getLastInstanceCalled(ModalOverlay) - 0);
            // TODO make sure timer works and overlay is de-rendered
            // expectOnlyPassedProps(ModalOverlay, {
            //   message: "",
            //   status: null
            // }, getLastInstanceCalled(ModalOverlay));
          });
        });
      });
    });
  });
});