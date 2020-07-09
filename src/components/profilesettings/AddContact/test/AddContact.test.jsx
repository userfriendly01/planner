import AddContact from "../AddContact";
// import { AddUserModal } from "components";
import React from "react";
import {
  act,
  // expectMockedComponent,
  fireEvent,
  render
  // setupMockedComponents
} from "testUtils";

describe("<AddContact />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initial render", () => {
    test("should display correct text", () => {
      const rendered = render(<AddContact />);
      expect(rendered.getByTestId("add-contact-button", { selector: "button" })).toBeInTheDocument();
      expect(rendered.container).toHaveTextContent("Add Contact");
    });
  });

  describe("button is clicked", () => {
    console.log = jest.fn();
    test("should render add/edit modal", done => {
      const rendered = render(<AddContact />);
      const addButton = rendered.getByTestId("add-contact-button", { selector: "button" });
      act(() => {
        fireEvent.click(addButton);
        return Promise.resolve();
      })
        .then(() => {
          expect(console.log).toHaveBeenCalledWith("you clicked the 'add contact' button");
          done();
        });
    });
  });
});
