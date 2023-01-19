import UserCard from "../UserCard";
import { AccountBox } from "@mui/icons-material";
import { useAdminState } from "context";
import React from "react";
import {
  expectMockedComponent,
  initialTestState,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  AccountBox: jest.fn(),
  CloseRounded: jest.fn(),
  Edit: jest.fn(),
  InfoOutlined: jest.fn(),
  Close: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

const state = initialTestState;
state.userContext.pingIdentity.displayName = "John Doe";

describe("<UserCard />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminState.mockReturnValue(state);
    setupMockedComponents({
      AccountBox
    });
  });

  test("should render a div with correct name and Account Box icon.", () => {
    const rendered = render(<UserCard />);
    expectMockedComponent(rendered, { AccountBox });
    expect(rendered.getByText("John Doe")).toBeInTheDocument();
  });
});