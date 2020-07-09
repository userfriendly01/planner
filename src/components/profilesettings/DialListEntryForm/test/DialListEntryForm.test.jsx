import DialListEntryForm from "../DialListEntryForm";
import { TextField } from "@material-ui/core";
import {
  PaperContainer,
  ModalPhoneNumber,
  StyledButton
} from "components";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@material-ui/core", () => ({
  __esModule: true,
  TextField: jest.fn()
}));

jest.mock("components", () => ({
  __esModule: true,
  PaperContainer: jest.fn(),
  ModalPhoneNumber: jest.fn(),
  StyledButton: jest.fn()
}));


const renderComponent = contactInfo => render(<DialListEntryForm contactInfo={contactInfo} handleClose={jest.fn()} />);

describe("<DialListEntryForm />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      ModalPhoneNumber,
      StyledButton,
      TextField
    });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("contactInfo contains transfer number, friendly name, and external number", () => {
    const contactInfo = {
      contact_id: 18,
      contact_nme: "Daryl Strawberry",
      contact_num: "800-123-4568",
      external_num: "900-555-1212"
    };
    describe("initial render", () => {
      test("should render 2 ModalPhoneNumber components, 1 Text Field, and 2 buttons", () => {
        const rendered = renderComponent(contactInfo);
        expectMockedComponent(rendered, { StyledButton }, 2);
        expectMockedComponent(rendered, { ModalPhoneNumber }, 2);
        expectMockedComponent(rendered, { TextField }, 1);
      });
    });

    describe("the Transfer Number field", () => {
      test("initial state", () => {
        renderComponent(contactInfo);
        const expectedOutgoingProps = {
          id: "transfer-number",
          number: contactInfo.contact_num,
          label: "Transfer Number"
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedOutgoingProps, 0);
      });

      test("changes made to the Transfer Number field", () => {
        renderComponent(contactInfo);
        act(() => {
          const updateValue = ModalPhoneNumber.mock.calls[0][0].updateValue;
          updateValue("12345678");
        });
        expect(ModalPhoneNumber.mock.calls.length).toBe(4);
        const newValue = ModalPhoneNumber.mock.calls[2][0].number;
        expect(newValue).toEqual("12345678");
      });
    });

    describe("the External Number field", () => {
      test("initial state", () => {
        renderComponent(contactInfo);
        const expectedOutgoingProps = {
          id: "external-number",
          number: contactInfo.external_num,
          label: "External Number"
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedOutgoingProps, 1);
      });

      test("changes made to the External Number field", () => {
        renderComponent(contactInfo);
        act(() => {
          const updateValue = ModalPhoneNumber.mock.calls[1][0].updateValue;
          updateValue("87654321");
        });
        expect(ModalPhoneNumber.mock.calls.length).toBe(4);
        const newValue = ModalPhoneNumber.mock.calls[3][0].number;
        expect(newValue).toEqual("87654321");
      });
    });

  });

  // describe("contactInfo does not include external number", () => {
  //   const contactInfo = {
  //     contact_id: 20,
  //     contact_nme: "Michael Jack Schmidt",
  //     contact_num: "800-123-4569"
  //   };
  // });
});