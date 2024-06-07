import { GraphQLError } from "./GraphQL/AbstractGraphQL.Query";
import { ReactSetState } from "./Container.Interfaces";

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