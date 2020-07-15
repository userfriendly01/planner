import DialListTable from "../DialListTable";
import { within } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import {
  AddContact,
  DialListEntryForm
} from "components";
import { apiPaths } from "globals";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

const mockSetProfileSettingsState = jest.fn();

jest.mock("components", () => ({
  __esModule: true,
  AddContact: jest.fn(),
  DialListEntryForm: jest.fn()
}));

const renderComponent = profile => render(<DialListTable profile={profile} setProfileSettingsState={mockSetProfileSettingsState} />);

describe("<DialListTable />", () => {

  beforeEach(() => {
    axiosMock.reset();
    jest.clearAllMocks();
    setupMockedComponents({
      AddContact,
      DialListEntryForm
    });
  });

  describe("profile does not have entries in its dial list", () => {
    const profile = {
      profileId: 2,
      dialList: []
    };
    test("should render 'no entries exist' message", () => {
      const rendered = renderComponent(profile);
      expect(rendered.container).toHaveTextContent("No dial list entries exist for this profile");
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
    const profile = {
      profileId: 7,
      dialList
    };
    test("should render add button, header and correct info for each dial list entry", () => {
      const rendered = renderComponent(profile);
      expectMockedComponent(rendered, { AddContact });
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

    describe("edit button clicked", () => {
      test("should open add/edit modal; when handleClose is called, modal should close", () => {
        const rendered = renderComponent(profile);
        const editButtons = rendered.getAllByTestId("edit-button");
        act(() => fireEvent.click(editButtons[1]));
        expectMockedComponent(rendered, { DialListEntryForm });
        const handleClose = DialListEntryForm.mock.calls[0][0].handleClose;
        act(() => handleClose());
        expectMockedComponent(rendered, { DialListEntryForm }, 0);
      });
    });

    describe("delete button clicked", () => {
      describe("delete is confirmed", () => {
        beforeEach(() => window.confirm = () => true);
        describe("call to delete dial list entry succeeds", () => {
          const indexToDelete = 2;
          const deleteResponse = { hooray: "it worked" };
          beforeEach(() => {
            axiosMock.onDelete(apiPaths.DELETE_DIAL_LIST_ENTRY(dialList[indexToDelete].diallist_id))
              .reply(200, deleteResponse);
          });
          test("should call setProfileSettingsState with updated dial list", done => {
            const rendered = renderComponent(profile);
            const deleteButtons = rendered.getAllByTestId("delete-button");
            act(() => {
              fireEvent.click(deleteButtons[indexToDelete]);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetProfileSettingsState).toHaveBeenCalledTimes(1);
                expect(mockSetProfileSettingsState).toHaveBeenCalledWith({
                  profile: {
                    ...profile,
                    dialList: dialList.slice(0, indexToDelete)
                  }
                });
                done();
              });
          });
        });
        describe("call to delete dial list entry fails", () => {
          const indexToDelete = 0;
          const errorMessage = { ohNo: "waaaaaah" };
          beforeEach(() => {
            axiosMock.onDelete(apiPaths.DELETE_DIAL_LIST_ENTRY(dialList[indexToDelete].diallist_id))
              .reply(500, errorMessage);
          });
          test("should not call setProfileSettingsState", done => {
            const rendered = renderComponent(profile);
            const deleteButtons = rendered.getAllByTestId("delete-button");
            act(() => {
              fireEvent.click(deleteButtons[indexToDelete]);
              return Promise.resolve();
            })
              .then(() => {
                expect(mockSetProfileSettingsState).not.toHaveBeenCalled();
                done();
              });
          });
        });
      });
      describe("delete is not confirmed", () => {
        beforeEach(() => window.confirm = () => false);
        test("should not call delete endpoint or remove dial list entry from table", done => {
          const rendered = renderComponent(profile);
          const deleteButtons = rendered.getAllByTestId("delete-button");
          act(() => {
            fireEvent.click(deleteButtons[1]);
            return Promise.resolve();
          })
            .then(() => {
              expect(axiosMock.history.delete.length).toBe(0);
              expect(mockSetProfileSettingsState).not.toHaveBeenCalled();
              done();
            });
        });
      });
    });
  });
});
