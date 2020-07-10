import AddContact from "../AddContact";
import { DialListEntryForm } from "components";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/profilesettings", () => ({
  __esModule: true,
  DialListEntryForm: jest.fn()
}));

describe("<AddContact />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({ DialListEntryForm });
  });

  describe("initial render", () => {
    test("should display add contact button, not modal", () => {
      const rendered = render(<AddContact />);
      expect(rendered.getByTestId("add-contact-button", { selector: "button" })).toBeInTheDocument();
      expect(rendered.container).toHaveTextContent("Add Contact");
      expectMockedComponent(rendered, { DialListEntryForm }, 0);
    });
  });

  describe("button is clicked", () => {
    test("should render add/edit modal; when handleClose is called, modal should close", done => {
      const rendered = render(<AddContact />);
      const addButton = rendered.getByTestId("add-contact-button", { selector: "button" });
      act(() => {
        fireEvent.click(addButton);
      });
      expectMockedComponent(rendered, { DialListEntryForm });
      const handleClose = DialListEntryForm.mock.calls[0][0].handleClose;
      act(() => handleClose());
      expectMockedComponent(rendered, { DialListEntryForm }, 0);
      done();
    });
  });
});
