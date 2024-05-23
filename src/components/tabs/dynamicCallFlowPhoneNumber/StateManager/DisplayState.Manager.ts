import { AbstractReactState } from "../../../../common/StateManager/AbstractReactState.Manager";
import { useState } from "react";

export interface ViewOrAddProps {
  callerType:boolean;
  dataRequests:boolean;
  callFlowRoute:boolean;
}

const initialDisplayState: ViewOrAddProps = {
  callerType: false,
  dataRequests: false,
  callFlowRoute: false
};

export class DisplayState extends AbstractReactState<ViewOrAddProps> {
  constructor() {
    super();
    const [stateAction, setStateAction] = useState<ViewOrAddProps>(initialDisplayState);

    this.stateAction = stateAction;
    this.setStateAction = setStateAction;
  }

  protected initialState(): ViewOrAddProps {
    return {
      callerType: false,
      dataRequests: false,
      callFlowRoute: false
    };
  }

  setCallerType(callerType: boolean): DisplayState {
    return this.setProperty("callerType", callerType);
  }

  get callerType(): boolean {
    return this.state.callerType;
  }

  setDataRequests(dataRequests: boolean): DisplayState {
    return this.setProperty("dataRequests", dataRequests);
  }

  get dataRequests(): boolean {
    return this.state.dataRequests;
  }

  setCallFlowRoute(callFlowRoute: boolean): DisplayState {
    return this.setProperty("callFlowRoute", callFlowRoute);
  }

  get callFlowRoute(): boolean {
    return this.state.callFlowRoute;
  }
}