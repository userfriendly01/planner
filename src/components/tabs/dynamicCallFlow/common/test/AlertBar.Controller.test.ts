import {
  AlertBarController, AlertSeverityTypeEnum, ALERT_BAR_15_SECOND_DURATION, ALERT_BAR_10_SECOND_DURATION, initialAlertBarProps
} from "../AlertBar.Controller";
import { GraphQLError } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";
import { ReactSetState } from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { AlertBarProps } from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";

describe("AlertBarController", () => {
  let mockSetAlertBarProps: ReactSetState<AlertBarProps>;
  let alertBarController: AlertBarController;

  beforeEach(() => {
    mockSetAlertBarProps = jest.fn();
    alertBarController = new AlertBarController(mockSetAlertBarProps);
  });

  it("shouldSetErrorAlert", () => {
    alertBarController.error("Test error message");
    expect(mockSetAlertBarProps).toHaveBeenCalledWith({
      msg: "Test error message",
      severityType: AlertSeverityTypeEnum.Error,
      open: true,
      duration: ALERT_BAR_15_SECOND_DURATION
    });
  });

  it("shouldSetGraphQLErrorAlert", () => {
    const errors: Array<GraphQLError> = [{ message: "Error 1" }, { message: "Error 2" }];
    alertBarController.graphQLError(errors);
    expect(mockSetAlertBarProps).toHaveBeenCalledWith({
      msg: "Error: \n\tError 1\n\tError 2",
      severityType: AlertSeverityTypeEnum.Error,
      open: true,
      duration: ALERT_BAR_15_SECOND_DURATION
    });
  });

  it("shouldSetWarningAlert", () => {
    alertBarController.warning("Test warning message");
    expect(mockSetAlertBarProps).toHaveBeenCalledWith({
      msg: "Test warning message",
      severityType: AlertSeverityTypeEnum.Warning,
      open: true,
      duration: ALERT_BAR_10_SECOND_DURATION
    });
  });

  it("shouldSetInfoAlert", () => {
    alertBarController.info("Test info message");
    expect(mockSetAlertBarProps).toHaveBeenCalledWith({
      msg: "Test info message",
      severityType: AlertSeverityTypeEnum.Info,
      open: true,
      duration: ALERT_BAR_10_SECOND_DURATION
    });
  });

  it("shouldSetSuccessAlert", () => {
    alertBarController.success("Test success message");
    expect(mockSetAlertBarProps).toHaveBeenCalledWith({
      msg: "Test success message",
      severityType: AlertSeverityTypeEnum.Success,
      open: true,
      duration: ALERT_BAR_10_SECOND_DURATION
    });
  });

  it("shouldCloseAlert", () => {
    alertBarController.closeAlertBar();
    expect(mockSetAlertBarProps).toHaveBeenCalledWith(initialAlertBarProps);
  });
});