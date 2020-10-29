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

const mockHandleClick = jest.fn();
const buttonText = "Button";
const text = "I will display in the modal but not in the button";

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
    const rendered = render(<NotificationModal
      buttonText={buttonText}
      handleClick={mockHandleClick}
      text={text}
    />);
    expectMockedComponent(rendered, { StyledButton });
    expectOnlyPassedProps(StyledButton, {
      disabled: false,
      onClick: mockHandleClick
    });
    expect(rendered.container).toHaveTextContent(text);
    expect(rendered.container).toHaveTextContent(buttonText);
  });
});
