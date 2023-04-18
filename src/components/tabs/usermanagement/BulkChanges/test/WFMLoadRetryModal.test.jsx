import WFMLoadRetryModal from "../WFMLoadRetryModal";
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
  getCalabrioWfmOptions, getCalabrioWfmOrg
} from "utils";
import {
  useAdminDispatch
} from "context";
import { CircularProgress } from "@mui/material";

jest.mock("@mui/material", () => ({
  CircularProgress: jest.fn()
}));

jest.mock("utils", () => ({
  getCalabrioWfmOptions: jest.fn(),
  getCalabrioWfmOrg: jest.fn()
}));

jest.mock("../BulkChanges.Styles.ts", () => ({
  Button: jest.fn(),
  ButtonWrapper: jest.fn(),
  ModalWrapper: jest.fn(),
  TextWrapper: jest.fn()
}));


jest.mock("context", () => ({
  useAdminDispatch: jest.fn()
}));

const mockDispatch = jest.fn();
const mockHandleClose = jest.fn();

const renderComponent = () => {
  return render(<WFMLoadRetryModal
    handleClose={mockHandleClose}
  />);
};

describe("<WFMLoadRetryModal />", () => {
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
          getCalabrioWfmOptions.mockReturnValue(false);
          getCalabrioWfmOrg.mockReturnValue(false);
          renderComponent();
          render(ModalWrapper.mock.calls[0][0].children);
          render(ButtonWrapper.mock.calls[0][0].children);
          render(TextWrapper.mock.calls[0][0].children);
          expect(Button.mock.calls.length).toBe(1);
          expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");

          const cancelClick = Button.mock.calls[0][0].onClick;
          act(() => cancelClick());
          await waitFor(() => {
            expect(getCalabrioWfmOptions).toBeCalledTimes(1);
            expect(getCalabrioWfmOrg).toBeCalledTimes(1);
            expect(mockHandleClose).toBeCalledTimes(1);
          });
        });
      });
      describe("retry call succeeds", () => {
        beforeEach(() => {
          getCalabrioWfmOptions.mockReturnValueOnce(true);
          getCalabrioWfmOrg.mockReturnValueOnce(true);
        });
        test("Calls succeed on first try, Should try only once and render appropriate components", async () => {
          renderComponent();
          render(ModalWrapper.mock.calls[0][0].children);
          render(ButtonWrapper.mock.calls[0][0].children);
          render(TextWrapper.mock.calls[0][0].children);
          expect(Button.mock.calls.length).toBe(1);
          expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");

          await waitFor(() => {
            expect(getCalabrioWfmOptions).toBeCalledTimes(1);
            expect(getCalabrioWfmOrg).toBeCalledTimes(1);
          });
        });
      });
      describe("retry call fails", () => {
        describe("retry calls eventually succeed", () => {
          describe("Should stop retrying and render appropriate components", () => {
            test("Org/people call succeeds right away, options call retries and eventually succeeds", async () => {
              getCalabrioWfmOptions
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
              getCalabrioWfmOrg
                .mockReturnValueOnce(true);

              renderComponent();
              render(ModalWrapper.mock.calls[0][0].children);
              render(ButtonWrapper.mock.calls[0][0].children);
              render(TextWrapper.mock.calls[0][0].children);
              expect(Button.mock.calls.length).toBe(1);
              expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");

              await waitFor(() => {
                expect(getCalabrioWfmOptions).toBeCalledTimes(1);
                expect(getCalabrioWfmOrg).toBeCalledTimes(1);
                expect(CircularProgress.mock.calls.length).toBe(1);

              });
              await waitFor(() => {
                expect(getCalabrioWfmOptions).toBeCalledTimes(7);
                expect(getCalabrioWfmOrg).toBeCalledTimes(1);
                expect(CircularProgress.mock.calls.length).toBe(1);
                expect(mockHandleClose).toBeCalledTimes(1);

              });

            });
            test("Options call succeeds right away, Org/People call retries and eventually succeeds", async () => {
              getCalabrioWfmOrg
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
              getCalabrioWfmOptions
                .mockReturnValueOnce(true);
              renderComponent();
              render(ModalWrapper.mock.calls[0][0].children);
              render(ButtonWrapper.mock.calls[0][0].children);
              render(TextWrapper.mock.calls[0][0].children);
              expect(Button.mock.calls.length).toBe(1);
              expect(TextWrapper.mock.calls[0][0].children).toBe("WFM Options have not been successfully loaded into Triton admin but are needed for WFM Bulk Create operations. Attempting to load WFM Data...");

              await waitFor(() => {
                expect(getCalabrioWfmOptions).toBeCalledTimes(1);
                expect(CircularProgress.mock.calls.length).toBe(1);
              });
              await waitFor(() => {
                expect(getCalabrioWfmOptions).toBeCalledTimes(1);
                expect(getCalabrioWfmOrg).toBeCalledTimes(5);
                expect(CircularProgress.mock.calls.length).toBe(1);
                expect(mockHandleClose).toBeCalledTimes(1);
              });
            });
          });
        });
        describe("retry calls exceed 10 tries", () => {
          beforeEach(() => {
            getCalabrioWfmOptions
              .mockReturnValue(false);
            getCalabrioWfmOrg
              .mockReturnValue(false);
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
              expect(getCalabrioWfmOptions).toBeCalledTimes(1);
              expect(getCalabrioWfmOrg).toBeCalledTimes(1);
              expect(mockHandleClose).toBeCalledTimes(0);
            });
            await waitFor(() => {
              expect(CircularProgress.mock.calls.length).toBe(1);
              expect(getCalabrioWfmOptions).toBeCalledTimes(10);
              expect(getCalabrioWfmOrg).toBeCalledTimes(10);
              expect(mockHandleClose).toBeCalledTimes(0);
            });
          });
        });
      });
    });
  });
});