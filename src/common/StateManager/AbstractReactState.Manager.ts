import React from "react";

export abstract class AbstractReactState<StateActionType> {
  protected stateAction: StateActionType;
  protected setStateAction: React.Dispatch<React.SetStateAction<StateActionType>>;

  /**
   * Updates the current state with the new stateAction, overwriting any existing values with the same key.
   * @param newStateAction
   */
  set state(newStateAction: StateActionType) {
    this.setStateAction( (stateAction: StateActionType) => ({
      ...stateAction,
      ...newStateAction
    }));
  }

  get state(): StateActionType {
    return this.stateAction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setProperty(key: string, value: any): this {
    this.setStateAction({
      ...this.stateAction,
      [key]: value
    });

    return this;
  }

  reset(): void {
    this.setStateAction(this.initialState());
    this.setStateAction(this.stateAction);
  }

  protected abstract initialState(): StateActionType;
}