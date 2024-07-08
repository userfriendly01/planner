import { PhoneNumberTable } from "../PhoneNumberTable";
import { ModalOverlay } from "components/ModalOverlay";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";
import {
  Delete,
  Edit
} from "@mui/icons-material";
import { theme } from "globals/theme";
import { ThemeProvider } from "styled-components";
import { IconWrapper } from "../../PhoneNumber.Styles";

jest.mock("components/ModalOverlay", () => ({
  ModalOverlay: jest.fn()
}));

jest.mock("@mui/icons-material", () => ({
  Delete: jest.fn(),
  Edit: jest.fn(),
  InfoOutlined: jest.fn()
}));

jest.mock("../../PhoneNumber.Styles", () => ({
  CustomTable: jest.requireActual("../../PhoneNumber.Styles").CustomTable,
  CustomTableData: jest.requireActual("../../PhoneNumber.Styles").CustomTableData,
  CustomTableHeader: jest.requireActual("../../PhoneNumber.Styles").CustomTableHeader,
  CustomTableRow: jest.requireActual("../../PhoneNumber.Styles").CustomTableRow,
  IconWrapper: jest.fn(),
  NoListDiv: jest.requireActual("../../PhoneNumber.Styles").NoListDiv,
  StyledPaper: jest.requireActual("../../PhoneNumber.Styles").StyledPaper,
  TableText: jest.requireActual("../../PhoneNumber.Styles").TableText
}));

const mockEditFunction = jest.fn();
const mockDeleteFunction = jest.fn();



describe("<PhoneNumberTable />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ModalOverlay,
      IconWrapper,
      Edit,
      Delete
    });
  });

  describe("type === Directory", () => {
    const renderComponent = (entries, saveState = "whatever") => render(
      <ThemeProvider theme={theme}>
        <PhoneNumberTable
          editFunction={mockEditFunction}
          deleteFunction={mockDeleteFunction}
          type={"Directory"}
          filteredList={entries}
          saveState={saveState}
        />
      </ThemeProvider>
    );
    describe("profile does not have entries in its directory", () => {
      test("should render emptyListMsg", () => {
        const rendered = renderComponent([]);
        expect(rendered.container).toHaveTextContent("No Directory entries exist for this profile");
      });
    });
    describe("profile has entries in its directory list", () => {
      const directoryList = [
        {
          id: 168,
          first_name: "Mack",
          last_name: "Truck",
          directory_num: "800-123-4567"
        },
        {
          id: 11,
          first_name: "Ford",
          last_name: "Ranger",
          directory_num: "900-555-1212"
        },
        {
          id: 2,
          first_name: "Dodge",
          last_name: "Ram",
          directory_num: "800-123-4569"
        }
      ];
      test("should render header and correct info & buttons for each entry", () => {
        const rendered = renderComponent(directoryList);
        expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
        expect(rendered.getByText("NUMBER", { selector: "th" })).toBeInTheDocument();
        const tableRows = rendered.getAllByTestId("table-row");
        expect(tableRows.length).toBe(3);
        directoryList.forEach(entry => {
          expect(rendered.container).toHaveTextContent(entry.first_name);
          expect(rendered.container).toHaveTextContent(entry.last_name);
          expect(rendered.container).toHaveTextContent(entry.directory_num);
        });
        IconWrapper.mock.calls.forEach(call => render(call[0].children));
        expect(Edit).toHaveBeenCalledTimes(3);
        expect(Delete).toHaveBeenCalledTimes(3);
      });
      describe("edit button is clicked", () => {
        test("should call mockEditFunction", () => {
          renderComponent(directoryList);
          expect(IconWrapper).toHaveBeenCalledTimes(6);
          const editFunction = IconWrapper.mock.calls[0][0].onClick;
          editFunction();
          expect(mockEditFunction).toHaveBeenCalledTimes(1);
        });
      });
      describe("delete button is clicked", () => {
        test("should call mockEditFunction", () => {
          renderComponent(directoryList);
          expect(IconWrapper).toHaveBeenCalledTimes(6);
          const deleteFunction = IconWrapper.mock.calls[1][0].onClick;
          deleteFunction();
          expect(mockDeleteFunction).toHaveBeenCalledTimes(1);
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
  describe("type === DialList", () => {
    const renderComponent = (entries, saveState = "whatever") => render(
      <ThemeProvider theme={theme}>
        <PhoneNumberTable
          editFunction={mockEditFunction}
          deleteFunction={mockDeleteFunction}
          type={"DialList"}
          filteredList={entries}
          saveState={saveState}
        />
      </ThemeProvider>
    );
    describe("profile does not have entries in its DialList", () => {
      test("should render emptyListMsg", () => {
        const rendered = renderComponent([]);
        expect(rendered.container).toHaveTextContent("No DialList entries exist for this profile");
      });
    });
    describe("profile has entries in its DialList", () => {
      const dialList = [
        {
          id: 168,
          contact_name: "Mack Truck",
          contact_num: "800-123-4567"
        },
        {
          id: 11,
          contact_name: "Ford Ranger",
          contact_num: "900-555-1212"
        },
        {
          id: 2,
          contact_name: "Dodge Ram",
          contact_num: "800-123-4569"
        }
      ];
      test("should render header and correct info & buttons for each entry", () => {
        const rendered = renderComponent(dialList);
        expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
        expect(rendered.getByText("NUMBER", { selector: "th" })).toBeInTheDocument();
        const tableRows = rendered.getAllByTestId("table-row");
        expect(tableRows.length).toBe(3);
        dialList.forEach(entry => {
          expect(rendered.container).toHaveTextContent(entry.contact_name);
          expect(rendered.container).toHaveTextContent(entry.contact_num);
        });
        IconWrapper.mock.calls.forEach(call => render(call[0].children));
        expect(Edit).toHaveBeenCalledTimes(3);
        expect(Delete).toHaveBeenCalledTimes(3);
      });
      describe("edit button is clicked", () => {
        test("should call mockEditFunction", () => {
          renderComponent(dialList);
          expect(IconWrapper).toHaveBeenCalledTimes(6);
          const editFunction = IconWrapper.mock.calls[0][0].onClick;
          editFunction();
          expect(mockEditFunction).toHaveBeenCalledTimes(1);
        });
      });
      describe("delete button is clicked", () => {
        test("should call mockEditFunction", () => {
          renderComponent(dialList);
          expect(IconWrapper).toHaveBeenCalledTimes(6);
          const deleteFunction = IconWrapper.mock.calls[1][0].onClick;
          deleteFunction();
          expect(mockDeleteFunction).toHaveBeenCalledTimes(1);
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
          const rendered = renderComponent(dialList, saveState);
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
