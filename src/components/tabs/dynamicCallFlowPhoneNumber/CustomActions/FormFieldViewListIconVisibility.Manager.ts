import { AbstractReactState } from "../../../../common/StateManager/AbstractReactState.Manager";
import { useState } from "react";

export class FormFieldViewListIconVisibilityState extends AbstractReactState<{ [key: string]: boolean }> {
  constructor(initialState: { [key: string]: boolean } = {}) {
    super();
    const [stateAction, setStateAction] = useState<{ [key: string]: boolean }>(initialState);

    this.stateAction = stateAction;
    this.setStateAction = setStateAction;
  }

  protected initialState(): { [key: string]: boolean } {
    return {};
  }
}