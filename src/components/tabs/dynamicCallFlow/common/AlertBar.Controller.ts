import { ReactSetState } from "./DynamicCallFlow.Interfaces";
import { GraphQLError } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export const OPEN_ALERT_BAR = true;
export const CLOSE_ALERT_BAR = false;

export const ALERT_BAR_5_SECOND_DURATION = 5000;
export const ALERT_BAR_10_SECOND_DURATION = 10000;
export const ALERT_BAR_15_SECOND_DURATION = 15000;

export type AlertSeverityType = "success" | "info" | "warning" | "error";
export enum AlertSeverityTypeEnum {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error"
}

export interface AlertBarProps {
  open: boolean;
  msg: string;
  severityType: AlertSeverityType;
  duration?: number
}

export const initialAlertBarProps: AlertBarProps = {
  open: false,
  msg: "",
  severityType: "info",
  duration: 6000
};

export class AlertBarController {
  private _alertBarProps: AlertBarProps;
  private readonly _setAlertBarProps: ReactSetState<AlertBarProps>;

  constructor(setAlertBarProps: ReactSetState<AlertBarProps>) {
    this._alertBarProps = initialAlertBarProps;
    this._setAlertBarProps = setAlertBarProps;
  }

  error(message: string, open = true, duration = 15000): void {
    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Error, open, duration);
  }

  graphQLError(errors: Array<GraphQLError>): void {
    let message = "Error: ";

    errors.forEach((error: GraphQLError) => {
      message = message.concat("\n\t", error.message);
    });

    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Error, true);
  }

  warning(message: string, open = true, duration = 15000): void {
    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Warning, open, duration);
  }

  info(message: string, open = true, duration = 15000): void {
    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Info, open, duration);
  }

  success(message: string, open = true, duration = 15000): void {
    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Success, open, duration);
  }

  private setAlertBarPropsState(message: string, severityType: AlertSeverityType, open: boolean, duration = 15000): void {
    this._setAlertBarProps({
      msg: message,
      severityType,
      open,
      duration
    });
  }

  closeAlertBar(): void {
    this._setAlertBarProps(initialAlertBarProps);
  }
}