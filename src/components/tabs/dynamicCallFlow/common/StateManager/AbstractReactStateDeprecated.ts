import React, { useState } from "react";

import {DataGridStateProps} from "../DataGrid/DataGrid.State";

export interface ReactStateAction<StateActionType> {
  state: StateActionType;
  setState: React.Dispatch<React.SetStateAction<StateActionType>>;
}

export interface StateManager<StateType> {
  set state(newState: StateType);
  get state(): StateType;
  reset(): void;
}

export abstract class AbstractReactStateDeprecated<StateType> {
  private _state: StateType;
  private _setState: React.Dispatch<React.SetStateAction<StateType>>;
  private _initialState: StateType;

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
    this._setState((prevState: StateType) => ({
      ...prevState,
      ...newState
    }));
  }

  get state(): StateType {
    return this._state;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setProperty(key: string, value: any): void {
    this.state[key as keyof StateType] = value;
  }

  reset(): void {
    this._setState(this._initialState);
  }
}
