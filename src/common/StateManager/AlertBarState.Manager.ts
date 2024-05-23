import { useState } from "react";
import { AbstractReactState } from "./AbstractReactState.Manager";
import {
  AlertBarProps, AlertSeverityType,
  AlertSeverityTypeEnum
} from "./AlertBarState.Interfaces";
import {GraphQLErrors} from "../../globals";
import {GraphQLError} from "../GraphQL/GraphQL.Interfaces";

export const initialAlertBar: AlertBarProps = {
  open: false,
  msg: "",
  severityType: "info",
  duration: 6000
};

export class AlertBarState extends AbstractReactState<AlertBarProps> {
  constructor() {
    super();
    const [state, setStateAction] = useState<AlertBarProps>(initialAlertBar);

    this.stateAction = state;
    this.setStateAction = setStateAction;
  }

  protected initialState(): AlertBarProps {
    return initialAlertBar;
  }

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
    this.setStateAction(stateAction => ({
      ...stateAction,
      msg: message,
      severityType,
      open,
      duration
    } as AlertBarProps));
  }
}