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
  open?: boolean;
  msg?: string;
  severityType?: AlertSeverityType;
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

  error(message: string, duration = ALERT_BAR_10_SECOND_DURATION): void {
    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Error, duration, OPEN_ALERT_BAR);
  }

  graphQLError(errors: Array<GraphQLError>): void {
    let message = "Error: ";

    errors.forEach((error: GraphQLError) => {
      message = message.concat("\n\t", error.message);
    });

    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Error, ALERT_BAR_10_SECOND_DURATION, OPEN_ALERT_BAR);
  }

  warning(message: string, duration = ALERT_BAR_10_SECOND_DURATION): void {
    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Warning, duration, OPEN_ALERT_BAR);
  }

  info(message: string, duration = ALERT_BAR_5_SECOND_DURATION): void {
    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Info, duration, OPEN_ALERT_BAR);
  }

  success(message: string, duration = ALERT_BAR_5_SECOND_DURATION): void {
    return this.setAlertBarPropsState(message, AlertSeverityTypeEnum.Success, duration, OPEN_ALERT_BAR);
  }

  private setAlertBarPropsState(message: string, severityType: AlertSeverityType,  duration = 15000, open: boolean): void {
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