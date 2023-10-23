import ResetModal from "../ResetModal";
import React from "react";
import { fetchResetProfileDatadogLogs, resetProfiles } from "services";
import { Divider } from "@mui/material";
import { StyledButton, ModalFetchingRing } from "components";
import { ReportGmailerrorred } from "@mui/icons-material";
import {
  act,
  render,
  setupMockedComponents,
  waitFor
} from "testUtils";
import { ProgressBar } from "../../BulkChanges/Processing";

jest.mock("../../BulkChanges/Processing", () => ({
  ProgressBar: jest.fn()
}));

jest.mock("components", () => ({
  ModalFetchingRing: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("@mui/material", () => ({
  Paper: jest.requireActual("@mui/material").Paper,
  Divider: jest.fn()
}));

jest.mock("@mui/icons-material", () => ({
  ReportGmailerrorred: jest.fn()
}));

jest.mock("services", () => ({
  fetchResetProfileDatadogLogs: jest.fn(),
  resetProfiles: jest.fn()
}));

jest.useFakeTimers();

const nNumber = "n0263786";
const email = "faith.cuneo@libertymutual.com";
const workerSid = "WK939u3";
const mockOnClose = jest.fn();

const renderComponent = () => {
  return render(<ResetModal nNumber={nNumber} email={email} workerSid={workerSid} onClose={mockOnClose} />)
}

const datadogResults = {
  attributes: {
    attributes: {
      sharedAdminAPILog: {
        results: [
          {
            stepNumber: 1,
            result: "Whoop Whoop"
          },
          {
            stepNumber: 2,
            result: ["We did it!", "We did it again!"]
          }
        ]
      }
    }
  }
}
describe("ResetModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      Divider,
      StyledButton,
      ModalFetchingRing,
      ReportGmailerrorred,
      ProgressBar
    });
  });
  describe("initial state", () => {
    test("renders as expected", () => {
      const rendered = renderComponent();
      expect(rendered.container).toHaveTextContent("Before you reset profiles you have to go to this site and confirm that all 4 emails for n0263786 match EXACTLY.");
      expect(rendered.container).toHaveTextContent("They even need the same casing.");
      expect(rendered.container).toHaveTextContent("(AD, LDAP(i), LDAP(e), HR)");
      const aTag = rendered.getByText("Security Identity Portal");
      expect(aTag.href).toBe("https://security-identity-portal.lmig.com/dashboard");
      expect(StyledButton).toHaveBeenCalledTimes(3);
      expect(StyledButton.mock.calls[0][0].children).toBe("The Emails all Match!");
      expect(StyledButton.mock.calls[1][0].children).toBe("I don't have access to this link");
      expect(StyledButton.mock.calls[2][0].children).toBe("Cancel");
    });
  });
  describe("no access", () => {
    test("access instructions are rendered", () => {
      const noAccessText = "You need to get access to this link before using the Reset Profile Functionality. To aquire access, request this AD Group: gpi-grm-ro-access2SecurityIdentityPortal (requestit form 3041).";
      const rendered = renderComponent();
      expect(rendered.container).not.toHaveTextContent(noAccessText);
      const noAccessButton = StyledButton.mock.calls[1][0].onClick;
      act(() => noAccessButton());
      expect(rendered.container).toHaveTextContent(noAccessText);
      const closeButton = StyledButton.mock.calls[3][0].onClick;
      act(() => closeButton());
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
  describe("cancel reset - onClose", () => {
    test("modal is closed", () => {
      renderComponent();
      const cancelButton = StyledButton.mock.calls[2][0].onClick;
      act(() => cancelButton());
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
  describe("emails are aligned", () => {
    beforeEach(() => {
      resetProfiles.mockResolvedValue({ data: "Successful Reset!" });
      fetchResetProfileDatadogLogs.mockResolvedValue({ data: "Successful Reset!" });
    });
    describe("status changes", () => {
      describe("status === Started", () => {
        test("progress bar is rendered & process is initiated", done => {
          renderComponent();
          const confirmEmailsButton = StyledButton.mock.calls[0][0].onClick;
          act(() => confirmEmailsButton());
          // jest.advanceTimersByTime(3000);
          expect(ProgressBar).toHaveBeenCalledTimes(1);
          done();
        });
      });
      describe("status === Timeout", () => {
        beforeEach(() => {
          resetProfiles.mockRejectedValue({
            response: {
              data: {
                message: "read timed out"
              }
            }
          });
          fetchResetProfileDatadogLogs.mockResolvedValue({
            data: [datadogResults]
          });
        });
        test("fetch datadog calls are triggered", async () => {
          const rendered = renderComponent();
          const confirmEmailsButton = StyledButton.mock.calls[0][0].onClick;
          act(() => confirmEmailsButton());
          expect(ProgressBar).toHaveBeenCalledTimes(1);
          jest.advanceTimersByTime(3000);
          await waitFor(() => {
            expect(fetchResetProfileDatadogLogs).toHaveBeenCalledTimes(1);
            expect(rendered.container).toHaveTextContent("Reset Results");
            expect(rendered.container).toHaveTextContent("Step 1:");
            expect(rendered.container).toHaveTextContent("Step 2:");
            expect(rendered.container).toHaveTextContent("Result:");
            expect(rendered.container).toHaveTextContent("Whoop Whoop");
            expect(rendered.container).toHaveTextContent("We did it!");
            expect(rendered.container).toHaveTextContent("We did it again!");
          })
        });
      });
      describe("status === Fail", () => {
        describe("progress hit its max", () => {
          beforeEach(() => {
            resetProfiles.mockRejectedValue({
              response: {
                data: {
                  message: "read timed out"
                }
              }
            });
            fetchResetProfileDatadogLogs.mockResolvedValue({
              data: []
            });
          });
          test("status is updated to Fail", async () => {
            const rendered = renderComponent();
            const confirmEmailsButton = StyledButton.mock.calls[0][0].onClick;
            act(() => confirmEmailsButton());
            expect(ProgressBar).toHaveBeenCalledTimes(1);
            await waitFor(() => {
              jest.advanceTimersByTime(6000);
              expect(fetchResetProfileDatadogLogs).toHaveBeenCalledTimes(35);
              expect(rendered.container).toHaveTextContent("Calabrio... is the worst we're sorry");
              expect(rendered.container).toHaveTextContent("We waited a while but the log was not found in datadog. We're unable to confirm this process succeeded. Please try again.");
            });
          });
        });
        describe("error was thrown from Calabrio", () => {
          beforeEach(() => {
            resetProfiles.mockRejectedValue({ message: "We failed" });
          });
          test("status is updated to Fail", async () => {
            const rendered = renderComponent();
            const confirmEmailsButton = StyledButton.mock.calls[0][0].onClick;
            act(() => confirmEmailsButton());
            expect(ProgressBar).toHaveBeenCalledTimes(1);
            await waitFor(() => {
              expect(fetchResetProfileDatadogLogs).toHaveBeenCalledTimes(0);
              expect(rendered.container).toHaveTextContent("Calabrio... is the worst we're sorry");
              expect(rendered.container).toHaveTextContent("We failed");
            });
          });
          beforeEach(() => {
            resetProfiles.mockRejectedValue({
              response: {
                message: "We failed"
              }
            });
          });
          test("status is updated to Fail", async () => {
            const rendered = renderComponent();
            const confirmEmailsButton = StyledButton.mock.calls[0][0].onClick;
            act(() => confirmEmailsButton());
            expect(ProgressBar).toHaveBeenCalledTimes(1);
            await waitFor(() => {
              expect(fetchResetProfileDatadogLogs).toHaveBeenCalledTimes(0);
              expect(rendered.container).toHaveTextContent("Calabrio... is the worst we're sorry");
              expect(rendered.container).toHaveTextContent("We failed");
            });
          });
          beforeEach(() => {
            resetProfiles.mockRejectedValue("We failed");
          });
          test("status is updated to Fail", async () => {
            const rendered = renderComponent();
            const confirmEmailsButton = StyledButton.mock.calls[0][0].onClick;
            act(() => confirmEmailsButton());
            expect(ProgressBar).toHaveBeenCalledTimes(1);
            await waitFor(() => {
              expect(fetchResetProfileDatadogLogs).toHaveBeenCalledTimes(0);
              expect(rendered.container).toHaveTextContent("Calabrio... is the worst we're sorry");
              expect(rendered.container).toHaveTextContent("We failed");
            });
          });
        });
        describe("error was thrown from Datadog", () => {
          beforeEach(() => {
            resetProfiles.mockRejectedValue({
              response: {
                data: {
                  message: "read timed out"
                }
              }
            });
            fetchResetProfileDatadogLogs.mockRejectedValue("Aww");
          });
          test("modal is rendered with fail results", async () => {
            const rendered = renderComponent();
            const confirmEmailsButton = StyledButton.mock.calls[0][0].onClick;
            act(() => confirmEmailsButton());
            expect(ProgressBar).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(3000);
            await waitFor(() => {
              expect(fetchResetProfileDatadogLogs).toHaveBeenCalledTimes(1);
              expect(rendered.container).toHaveTextContent("Calabrio... is the worst we're sorry");
              expect(rendered.container).toHaveTextContent("Aww");
            })
          });
        });
      });
      describe("status === Success", () => {
        test("", () => {

        });
      });
    });
  });

});