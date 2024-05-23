import { AbstractReactState } from "./AbstractReactState.Manager";
import { useState } from "react";

export class ObjectArrayState<T> extends AbstractReactState<Array<T>> {
  constructor() {
    super();
    const [stateAction, setStateAction] = useState<Array<T>>([]);

    this.stateAction = stateAction;
    this.setStateAction = setStateAction;
  }

  protected initialState(): Array<T> {
    return [];
  }
}