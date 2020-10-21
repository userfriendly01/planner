import NotificationModal from "../NotificationModal";
import {
  PaperContainer,
  StyledButton
} from "components";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

const mockReloadFn = jest.fn();

jest.mock("components", () => ({
  __esModule: true,
  PaperContainer: jest.fn(),
  StyledButton: jest.fn()
}));

describe("<NotificationModal />", () => {
  beforeEach(() => {
    setupMockedComponents({ StyledButton });
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });
  test("should render reload button & correct text", () => {
    const rendered = render(<NotificationModal reloadFn={mockReloadFn} />);
    expectMockedComponent(rendered, { StyledButton });
    expectOnlyPassedProps(StyledButton, {
      disabled: false,
      onClick: mockReloadFn
    });
    expect(rendered.container).toHaveTextContent("Your session has expired. Please reload the page.");
  });
});
