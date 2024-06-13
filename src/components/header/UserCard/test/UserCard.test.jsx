import UserCard from "../UserCard";
import { AccountBox } from "@mui/icons-material";
import React from "react";
import {
  expectMockedComponent,
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

jest.mock("@azure/msal-react", () => ({
  useMsal: jest.fn().mockReturnValue({
    instance: {
      getActiveAccount: jest.fn().mockReturnValue({
        name: "John Doe"
      })
    }
  })
}));

describe("<UserCard />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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