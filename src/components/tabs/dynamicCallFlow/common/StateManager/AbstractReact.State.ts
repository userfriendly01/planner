import React, { useState } from "react";

export interface ReactStateAction<StateActionType> {
  state: StateActionType;
  setState: React.Dispatch<React.SetStateAction<StateActionType>>;
}

export abstract class AbstractReactState<StateType> {
  protected _state: StateType;
  protected _setState: React.Dispatch<React.SetStateAction<StateType>>;
  protected _initialState: StateType;

  constructor(initialState: StateType) {
    this._state = initialState;

    const [state, setState] = useState<StateType>(initialState);
    this._initialState = initialState;
    this._state = state;
    this._setState = setState;
  }
  /**
   * Updates the current state with the new stateAction, overwriting any existing values with the same key.
   * @param {<StateType>} newState
   */
  set state(newState: StateType) {
    this._setState( (state: StateType) => ({
      ...state,
      ...newState
    }));
  }

  get state(): StateType {
    return this._state;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setProperty(key: string, value: any): this {
    this._setState({
      ...this._state,
      [key]: value
    });

    return this;
  }

  reset(): void {
    this._setState(this._initialState);
  }
}
