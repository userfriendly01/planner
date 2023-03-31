import WFMLoadOptionsModal from "../WFMLoadOptionsModal";
import React from "react";
import {
  act,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import {
  ButtonWrapper,
  Button,
  ModalWrapper,
  TextWrapper
} from "../BulkChanges.Styles";
import {
  getWfmOrg,
  getWfmOptions
} from "services";
import {
  useAdminDispatch
} from "context";
import { CircularProgress } from "@mui/material";

jest.mock("@mui/material", () => ({
  CircularProgress: jest.fn()
}));

jest.mock("../BulkChanges.Styles.ts", () => ({
  Button: jest.fn(),
  ButtonWrapper: jest.fn(),
  ModalWrapper: jest.fn(),
  TextWrapper: jest.fn()
}));

jest.mock("services", () => ({
  getWfmOptions: jest.fn(),
  getWfmOrg: jest.fn()
}));

jest.mock("context", () => ({
  useAdminDispatch: jest.fn()
}));

const mockDispatch = jest.fn();
const mockHandleClose = jest.fn();

const renderComponent = () => {
  return render(<WFMLoadOptionsModal
    handleClose={mockHandleClose}
  />);
};

describe("<WFMLoadOptionsModal />", () => {
  beforeEach(() => {
    useAdminDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
    setupMockedComponents({
      Button,
      ButtonWrapper,
      ModalWrapper,
      TextWrapper
    });
  });
  describe("initial render", () => {
    describe("wfm data isn't properly loaded, calls retry to get wfmOrg and wfm Options", () => {
      describe("cancel button is clicked stops retrying, calls handleClose", () => {
        test("stops retrying, calls handleClose", async () => {
          getWfmOptions.mockRejectedValue("nope");
          getWfmOrg.mockRejectedValue("nope");
          renderComponent();
          render(ModalWrapper.mock.calls[0][0].children);
          render(ButtonWrapper.mock.calls[0][0].children);
          render(TextWrapper.mock.calls[0][0].children);
          expect(Button.mock.calls.length).toBe(1);
          expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");

          const cancelClick = Button.mock.calls[0][0].onClick;
          act(() => cancelClick());
          await waitFor(() => {
            expect(getWfmOptions).toBeCalledTimes(1);
            expect(getWfmOrg).toBeCalledTimes(1);
            expect(mockHandleClose).toBeCalledTimes(1);
          });
        });
      });
      describe("retry call succeeds", () => {
        beforeEach(() => {
          getWfmOptions.mockResolvedValueOnce({ data: { organization: { businessUnits: [ { Id: "123" }]}}});
          getWfmOrg.mockResolvedValueOnce({ data: { organization: { businessUnits: [ { Id: "123" }]}}});
        });
        test("Calls succeed on first try, Should try only once and render appropriate components", async () => {
          renderComponent();
          render(ModalWrapper.mock.calls[0][0].children);
          render(ButtonWrapper.mock.calls[0][0].children);
          render(TextWrapper.mock.calls[0][0].children);
          expect(Button.mock.calls.length).toBe(1);
          expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");

          await waitFor(() => {
            expect(getWfmOptions).toBeCalledTimes(1);
            expect(getWfmOrg).toBeCalledTimes(1);
            expect(mockDispatch).toBeCalledTimes(2);
            expect(mockDispatch).toBeCalledWith({
              payload: [{ Id: "123" }],
              type: "loadWfmOptions"
            });
            expect(mockDispatch).toBeCalledWith({
              payload: [{ Id: "123" }],
              type: "loadWfmOrg"
            });
          });
        });
      });
      describe("retry call fails", () => {
        describe("retry calls eventually succeed", () => {
          describe("Should stop retrying and render appropriate components", () => {
            test("Org/people call succeeds right away, options call retries and eventually succeeds", async () => {
              getWfmOptions
                .mockRejectedValueOnce("nope")
                .mockRejectedValueOnce("nope")
                .mockRejectedValueOnce("nope")
                .mockRejectedValueOnce("nope")
                .mockRejectedValueOnce("nope")
                .mockRejectedValueOnce("nope")
                .mockResolvedValueOnce({ data: { organization: { businessUnits: [ { Id: "123" }]}}});
              getWfmOrg
                .mockResolvedValueOnce({ data: { organization: { businessUnits: [ { Id: "123" }]}}});

              renderComponent();
              render(ModalWrapper.mock.calls[0][0].children);
              render(ButtonWrapper.mock.calls[0][0].children);
              render(TextWrapper.mock.calls[0][0].children);
              expect(Button.mock.calls.length).toBe(1);
              expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");

              await waitFor(() => {
                expect(getWfmOptions).toBeCalledTimes(1);
                expect(getWfmOrg).toBeCalledTimes(1);
                expect(CircularProgress.mock.calls.length).toBe(1);
                expect(mockDispatch).toBeCalledWith({
                  payload: [{ Id: "123" }],
                  type: "loadWfmOrg"
                });

              });
              await waitFor(() => {
                expect(getWfmOptions).toBeCalledTimes(7);
                expect(getWfmOrg).toBeCalledTimes(1);
                expect(CircularProgress.mock.calls.length).toBe(1);
                expect(mockDispatch).toBeCalledTimes(2);
                expect(mockDispatch).toBeCalledWith({
                  payload: [{ Id: "123" }],
                  type: "loadWfmOptions"
                });
                expect(mockHandleClose).toBeCalledTimes(1);

              });

            });
            test("Options call succeeds right away, Org/People call retries and eventually succeeds", async () => {
              getWfmOrg
                .mockRejectedValueOnce("nope")
                .mockRejectedValueOnce("nope")
                .mockRejectedValueOnce("nope")
                .mockRejectedValueOnce("nope")
                .mockResolvedValueOnce({ data: { organization: { businessUnits: [ { Id: "123" }]}}});
              getWfmOptions
                .mockResolvedValueOnce({ data: { organization: { businessUnits: [ { Id: "123" }]}}});
              renderComponent();
              render(ModalWrapper.mock.calls[0][0].children);
              render(ButtonWrapper.mock.calls[0][0].children);
              render(TextWrapper.mock.calls[0][0].children);
              expect(Button.mock.calls.length).toBe(1);
              expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");

              await waitFor(() => {
                expect(getWfmOptions).toBeCalledTimes(1);
                expect(CircularProgress.mock.calls.length).toBe(1);
                expect(mockDispatch).toBeCalledTimes(1);
                expect(mockDispatch).toBeCalledWith({
                  payload: [{ Id: "123" }],
                  type: "loadWfmOptions"
                });
              });
              await waitFor(() => {
                expect(getWfmOptions).toBeCalledTimes(1);
                expect(getWfmOrg).toBeCalledTimes(5);
                expect(CircularProgress.mock.calls.length).toBe(1);
                expect(mockDispatch).toBeCalledTimes(2);
                expect(mockDispatch).toBeCalledWith({
                  payload: [{ Id: "123" }],
                  type: "loadWfmOrg"
                });
                expect(mockHandleClose).toBeCalledTimes(1);
              });
            });
          });
        });
        describe("retry calls exceed 10 tries", () => {
          beforeEach(() => {
            getWfmOptions
              .mockRejectedValue("nope");
            getWfmOrg
              .mockRejectedValue("nope");
          });
          test("Should stop retrying and render appropriate components", async () => {
            renderComponent();
            render(ModalWrapper.mock.calls[0][0].children);
            render(ButtonWrapper.mock.calls[0][0].children);
            render(TextWrapper.mock.calls[0][0].children);
            expect(Button.mock.calls.length).toBe(1);
            expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");
            expect(TextWrapper.mock.calls[1][0].children).toBe("");

            await waitFor(() => {
              expect(CircularProgress.mock.calls.length).toBe(1);
              expect(getWfmOptions).toBeCalledTimes(1);
              expect(getWfmOrg).toBeCalledTimes(1);
              expect(mockDispatch).toBeCalledTimes(0);

              expect(mockHandleClose).toBeCalledTimes(0);
            });
            await waitFor(() => {
              expect(CircularProgress.mock.calls.length).toBe(1);
              expect(getWfmOptions).toBeCalledTimes(10);
              expect(getWfmOrg).toBeCalledTimes(10);
              expect(mockDispatch).toBeCalledTimes(0);
              expect(mockHandleClose).toBeCalledTimes(0);
            });
          });
        });
      });
    });
  });
});