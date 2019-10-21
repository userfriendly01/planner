import AddUser from "../AddUser";
import { AddUserModal } from "components";
import React from "react";
import {
  act,
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("components/usermanagement", () => ({
  __esModule: true,
  AddUserModal: jest.fn()
}));

const renderComponent = () => {
  return render(<AddUser />);
};

describe("<AddUser />", () => {
  beforeEach(() => {
    setupMockedComponents({
      AddUserModal
    });
  });

  test("upon initial render, should display an Add User button", () => {
    const rendered = renderComponent();
    expect(rendered.getByTestId("add-user-button", { selector: "button" })).toBeInTheDocument();
    expect(rendered.container).toHaveTextContent("Add User");
  });
  test("when you click on the add user button, the user modal is rendered. When you call handleClose, the modal is no longer rendered", () => {
    const rendered = renderComponent();
    const button = rendered.getByTestId("add-user-button");
    expectMockedComponent(rendered, { AddUserModal }, 0);
    act(() => {
      fireEvent.click(button);
    });
    expectMockedComponent(rendered, { AddUserModal }, 1);
    const handleClose = AddUserModal.mock.calls[0][0].handleClose;
    act(() => {
      handleClose();
    });
    expectMockedComponent(rendered, { AddUserModal }, 0);
  });
});
