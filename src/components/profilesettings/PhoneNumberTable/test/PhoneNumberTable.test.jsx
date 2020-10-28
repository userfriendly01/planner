import PhoneNumberTable from "../PhoneNumberTable";
import {
  DirectoryEntryForm,
  ModalOverlay
} from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents,
  within
} from "testUtils";

jest.mock("components", () => ({
  DirectoryEntryForm: jest.fn(),
  ModalOverlay: jest.fn()
}));

const mockEditButtonOnClick = jest.fn();
const mockGetDeleteButtonOnClick = jest.fn();
const emptyListMsg = "yes, we have no directory blah blah blah";

const renderComponent = (directory, saveState = "whatever") => render(<PhoneNumberTable
  editFunction={mockEditButtonOnClick}
  deleteFunction={mockGetDeleteButtonOnClick}
  emptyListMsg={emptyListMsg}
  phoneNumberList={directory}
  saveState={saveState}
/>);

describe("<PhoneNumberTable />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      DirectoryEntryForm,
      ModalOverlay
    });
  });

  describe("save status does not exist", () => {
    describe("profile does not have entries in its directory", () => {
      test("should render emptyListMsg", () => {
        const rendered = renderComponent([]);
        expect(rendered.container).toHaveTextContent(emptyListMsg);
      });
    });
    describe("profile has entries in its directory list", () => {
      const directoryList = [
        {
          directory_id: 168,
          first_nme: "Mack",
          last_nme: "Truck",
          phone_num: "800-123-4567"
        },
        {
          directory_id: 11,
          first_nme: "Ford",
          last_nme: "Ranger",
          phone_num: "900-555-1212"
        },
        {
          directory_id: 2,
          first_nme: "Dodge",
          last_nme: "Ram",
          phone_num: "800-123-4569"
        }
      ];
      test("should render header and correct info & buttons for each entry", () => {
        const rendered = renderComponent(directoryList);
        expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
        expect(rendered.getByText("NUMBER", { selector: "th" })).toBeInTheDocument();
        const tableRows = rendered.getAllByTestId("table-row");
        expect(tableRows.length).toBe(3);
        directoryList.forEach(entry => {
          expect(rendered.container).toHaveTextContent(entry.first_nme);
          expect(rendered.container).toHaveTextContent(entry.last_nme);
          expect(rendered.container).toHaveTextContent(entry.phone_num);
          const row = rendered.getByText(entry.phone_num).closest("tr");
          const utils = within(row);
          expect(utils.getByTestId("edit-button")).toBeInTheDocument();
          expect(utils.getByTestId("delete-button")).toBeInTheDocument();
        });
      });
      describe("save status exists", () => {
        test("should render ModalOverlay with correct props", () => {
          const message = "don't eat the yellow snow";
          const status = "peanut butter";
          const saveState = {
            overlayMessage: message,
            status
          };
          const rendered = renderComponent(directoryList, saveState);
          expectMockedComponent(rendered, { ModalOverlay });
          expectOnlyPassedProps(ModalOverlay, {
            message,
            status
          });
        });
      });
    });
  });
});
