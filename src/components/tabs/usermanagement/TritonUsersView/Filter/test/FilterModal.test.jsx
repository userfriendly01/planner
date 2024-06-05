import { FilterModal } from "../FilterModal";
import React from "react";
import {
  expectMockedComponent,
  getMockedComponentProps,
  render,
  setupMockedComponents,
  act
} from "testUtils";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import { ProfileFilterDropdown } from "usermanagement/ProfileFilterDropdown";
import { OuFilterDropdown } from "usermanagement/OuFilterDropdown";
import { ManagerDropdown } from "usermanagement/ManagerDropdown";
import { CloseRounded } from "@mui/icons-material";

jest.mock("@mui/icons-material", () => ({
  CloseRounded: jest.fn()
}));


jest.mock("components/PaperContainer", () => ({
  PaperContainer: jest.fn()
}));

jest.mock("components/StyledButton", () => ({
  StyledButton: jest.fn()
}));

jest.mock("usermanagement/ManagerDropdown", () => ({
  ManagerDropdown: jest.fn()
}));

jest.mock("usermanagement/ProfileFilterDropdown", () => ({
  ProfileFilterDropdown: jest.fn()
}));

jest.mock("usermanagement/OuFilterDropdown", () => ({
  OuFilterDropdown: jest.fn()
}));

const mockHandleClose = jest.fn();
const mockHandleClear = jest.fn();

describe("<FilterModal />", () => {

  const renderComponent = () => render(<FilterModal handleClose={mockHandleClose} handleClear={mockHandleClear} />);
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      CloseRounded,
      StyledButton,
      ProfileFilterDropdown,
      ManagerDropdown,
      OuFilterDropdown
    });
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
    mockHandleClose.mockClear();
    mockHandleClear.mockClear();
  });

  describe("initial state of the modal", () => {
    test("should render StyledButtons, CloseRounded, ProfileFilterDropdown, ManagerDropdown & OuFilterDropdown once each", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded });
      expectMockedComponent(rendered, { ManagerDropdown });
      expect(ManagerDropdown.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { ProfileFilterDropdown });
      expect(ProfileFilterDropdown.mock.calls.length).toBe(1);
      expectMockedComponent(rendered, { OuFilterDropdown });
      expect(OuFilterDropdown.mock.calls.length).toBe(1);
      expect(StyledButton.mock.calls[0][0].children).toBe("Done");
      expect(StyledButton.mock.calls[1][0].children).toBe("Clear");
    });
  });

  describe("close behaviour", () => {
    test("should render whenever modal is open", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CloseRounded }, 1);
      expect(StyledButton.mock.calls[0][0].children).toBe("Done");
    });
    describe("when clicked", () => {
      test("close rounded button should close the modal", () => {
        renderComponent();
        const { onClick } = getMockedComponentProps(CloseRounded);
        act(() => onClick());
        expect(mockHandleClose).toBeCalled();
      });
      test("apply filters button should close the modal", () => {
        renderComponent();
        act(() => {
          StyledButton.mock.calls[0][0].onClick();
        });
        expect(mockHandleClose).toBeCalled();
      });
    });
  });

  describe("clear filter behaviour", () => {
    test("should render whenever modal is open", () => {
      renderComponent();
      expect(StyledButton.mock.calls[1][0].children).toBe("Clear");
    });
    test("should clear filters when clicked", () => {
      renderComponent();
      act(() => {
        StyledButton.mock.calls[1][0].onClick();
      });
      expect(mockHandleClear).toHaveBeenCalledTimes(1);
    });
  });



});

