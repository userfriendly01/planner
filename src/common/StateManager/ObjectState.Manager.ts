import { AbstractReactState } from "./AbstractReactState.Manager";
import { useState } from "react";

export class ObjectState<T> extends AbstractReactState<T> {
  constructor() {
    super();
    const [stateAction, setStateAction] = useState<T>({} as T);

    this.stateAction = stateAction;
    this.setStateAction = setStateAction;
  }

  protected initialState(): T {
    return {} as T;
  }
}