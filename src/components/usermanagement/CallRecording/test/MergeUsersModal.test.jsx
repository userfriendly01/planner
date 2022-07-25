import MergeUsersModal from "../MergeUsersModal";
import { StyledButton } from "components";
import { useAdminDispatch } from "context";
import React from "react";
import { getCalabrioAgents } from "services";
import {
  render,
  setupMockedComponents
} from "testUtils";
import {
  checkDuplicateRecords,
  wait
} from "utils";

jest.mock("utils", () => ({
  checkDuplicateRecords: jest.fn(),
  wait: jest.requireActual("utils").wait
}));

jest.mock("components", () => ({
  StyledButton: jest.fn()
}));

jest.mock("context", () => ({
  useAdminDispatch: jest.fn()
}));

jest.mock("services", () => ({
  getCalabrioAgents: jest.fn()
}));

const mockDispatch = jest.fn();
const mockUpdateLoading = jest.fn();
const mockSetMergeUsersModalState = jest.fn();
const mockHandleClose = jest.fn();

const mergeUsersModalState = {
  permanentUser: {
    acdId: 10,
    firstName: "Brian",
    lastName: "Griffin"
  }
};

const renderComponent = () => {
  return render(<MergeUsersModal
    loading={{}}
    handleClose={mockHandleClose}
    mergeUsersModalState={mergeUsersModalState}
    setMergeUsersModalState={mockSetMergeUsersModalState}
    updateLoading={mockUpdateLoading}
  />);
};

describe("<MergeUsersModal/>", () => {
  beforeEach(() => {
    useAdminDispatch.mockReturnValue(mockDispatch);
    setupMockedComponents({
      StyledButton
    });
  });
  describe("Initial Render", () => {
    describe("conflict state is not null", () => {
      test("conflict check is not run",() => {
      });
    });
    describe("conflict state is null", () => {
      describe("getCalabrioAgents fails", () => {
        beforeEach(() => {
          getCalabrioAgents.mockRejectedValue();
        });
        test("MergeUsersModal is closed, Loading is updated to a partial fail and then closes", () => {
          renderComponent();
          expect(getCalabrioAgents).toHaveBeenCalledTimes(1);
          expect(mockDispatch).toHaveBeenCalledTimes(0);
          // expect(console.error).toHaveBeenCalledWith("butts");
          // expect(mockSetMergeUsersModalState.mock.calls).toBe("butts");
          // expect(mockSetMergeUsersModalState).toHaveBeenCalledWith({
          //   open: false,
          //   permanentUser: null
          // });
          // expect(mockUpdateLoading).toHaveBeenCalledTimes(2);
          // expect(mockUpdateLoading.mock.calls).toBe("butts");
        });
      });
      describe("unknown error is thrown during conflict check", () => {
        test("MergeUsersModal is closed, Loading is updated to a partial fail and then closes", () => {

        });
      });
      describe("conflict is found during conflict check", () => {
        test("conflictState is set and modal is rendered with conflict data", () => {

        });
      });
      describe("conflict is not found during conflict check", () => {
        test("Loading is updated to success and handleClose is called", () => {

        });
      });
    });
  });
  describe("Cancel Button Clicked", () => {
    test("handleCloseMergeUsersModal is run", () => {

    });
  });
  describe("Continue Button Clicked", () => {
    test("handleConflictCheck is called", () => {

    });
  });
});