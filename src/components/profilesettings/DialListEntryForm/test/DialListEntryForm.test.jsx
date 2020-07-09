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
      test("should render 1 ModalPhoneNumber component, 2 Text Field components, and 2 buttons", () => {
        const rendered = renderComponent(contactInfo);
        expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
        expectMockedComponent(rendered, { TextField }, 2);
        expectMockedComponent(rendered, { StyledButton }, 2);
      });
    });

    describe("the Transfer Number field", () => {
      test("initial state", () => {
        renderComponent(contactInfo);
        const expectedOutgoingProps = {
          id: "transfer-number-input",
          number: contactInfo.contact_num,
          label: "Transfer Number"
        };
        expectOnlyPassedProps(ModalPhoneNumber, expectedOutgoingProps);
      });

      test("changes made to the Transfer Number field", () => {
        const newValue = "12345678";
        renderComponent(contactInfo);
        act(() => {
          const updateValue = ModalPhoneNumber.mock.calls[0][0].updateValue;
          updateValue(newValue);
        });
        expect(ModalPhoneNumber.mock.calls.length).toBe(2);
        const updatedTransferNumber = ModalPhoneNumber.mock.calls[1][0].number;
        expect(updatedTransferNumber).toEqual(newValue);
      });
    });

    describe("the Friendly Name field", () => {
      test("initial state", () => {
        renderComponent(contactInfo);
        const expectedOutgoingProps = {
          id: "friendly-name-input",
          value: contactInfo.contact_nme,
          label: "Friendly Name"
        };
        expect(TextField.mock.calls.length).toBe(2);
        expectOnlyPassedProps(TextField, expectedOutgoingProps, 0);
      });
      test("changes made to the Friendly Name field", () => {
        const newValue = "Hubie Brooks";
        renderComponent(contactInfo);
        act(() => {
          const event = {
            preventDefault() {},
            target: { value: newValue }
          };
          const onChange = TextField.mock.calls[0][0].onChange;
          onChange(event);
        });
        expect(TextField.mock.calls.length).toBe(4);
        const updatedFriendlyName = TextField.mock.calls[2][0].value;
        expect(updatedFriendlyName).toEqual(newValue);
      });
    });

    describe("the External Number field", () => {
      test("initial state", () => {
        renderComponent(contactInfo);
        const expectedOutgoingProps = {
          id: "external-number-input",
          value: contactInfo.external_num,
          label: "External Number"
        };
        expect(TextField.mock.calls.length).toBe(2);
        expectOnlyPassedProps(TextField, expectedOutgoingProps, 1);
      });
      test("changes made to the External Number field", () => {
        const newValue = "1-800-867-5309";
        renderComponent(contactInfo);
        act(() => {
          const event = {
            preventDefault() {},
            target: { value: newValue }
          };
          const onChange = TextField.mock.calls[1][0].onChange;
          onChange(event);
        });
        expect(TextField.mock.calls.length).toBe(4);
        const updatedExternalNumber = TextField.mock.calls[3][0].value;
        expect(updatedExternalNumber).toEqual(newValue);
      });
    });
  });

  describe("required contact info is missing", () => {
    const contactInfo = {
      whatever: "not contact_id",
      somethingElse: "not contact_nme",
      not_contact_num: "800-123-4567",
      contact_id: 2000
    };
    test("should render all 3 fields with empty strings", () => {
      const rendered = renderComponent(contactInfo);
      expectMockedComponent(rendered, { ModalPhoneNumber }, 1);
      expectMockedComponent(rendered, { TextField }, 2);
      expectMockedComponent(rendered, { StyledButton }, 2);
      const transferNumberOutgoingProps = {
        id: "transfer-number-input",
        number: "",
        label: "Transfer Number"
      };
      expectOnlyPassedProps(ModalPhoneNumber, transferNumberOutgoingProps);
      const friendlyNameOutgoingProps = {
        id: "friendly-name-input",
        value: "",
        label: "Friendly Name"
      };
      expectOnlyPassedProps(TextField, friendlyNameOutgoingProps, 0);
      const externalNumberOutgoingProps = {
        id: "external-number-input",
        value: "",
        label: "External Number"
      };
      expect(TextField.mock.calls.length).toBe(2);
      expectOnlyPassedProps(TextField, externalNumberOutgoingProps, 1);
    });
  });
});
