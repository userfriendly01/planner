import { AbstractReactStateDeprecated } from "./AbstractReactStateDeprecated";

import { GraphQLError } from "../GraphQL/AbstractGraphQL.Query";
import {AbstractReactState} from "./Abstract.ReactState";
import React from "react";
import {AlertBarState} from "./AlertBar.State";

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

export class AlertBarStateManager extends AbstractReactState<AlertBarProps> implements AlertBarState {
  constructor(state: AlertBarProps, setState: React.Dispatch<React.SetStateAction<AlertBarProps>>) {
    super(state, setState);
  }

  handleClose(isAlertOpen: boolean): void {
    this.open = isAlertOpen;
  };

  error(message: string, open = true, duration = 15000): void {
    this.setAlertBarState(message, AlertSeverityTypeEnum.Error, open, duration);
  }

  graphQLError(errors: Array<GraphQLError>): void {
    let message = "Error: ";

    errors.forEach((error: GraphQLError) => {
      message = message.concat("\n\t", error.message);
    });

    this.setAlertBarState(message, AlertSeverityTypeEnum.Error, true);
  }

  warning(message: string, open = true, duration = 15000): void {
    this.setAlertBarState(message, AlertSeverityTypeEnum.Warning, open, duration);
  }

  info(message: string, open = true, duration = 15000): void {
    this.setAlertBarState(message, AlertSeverityTypeEnum.Info, open, duration);
  }

  success(message: string, open = true, duration = 15000): void {
    this.setAlertBarState(message, AlertSeverityTypeEnum.Success, open, duration);
  }

  set open(open: boolean) {
    this.setAlertBarState(this.state.msg, this.state.severityType, open, this.state.duration);
  }

  get open(): boolean {
    return this.state.open;
  }

  get msg(): string {
    return this.state.msg;
  }

  get severityType(): AlertSeverityType {
    return this.state.severityType;
  }

  get duration(): number {
    return this.state.duration;
  }

  private setAlertBarState(message: string, severityType: AlertSeverityType, open: boolean, duration = 15000): void {
    this.state = {
      msg: message,
      severityType,
      open,
      duration
    } as AlertBarProps;
  }
}