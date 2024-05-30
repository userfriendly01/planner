import React from "react";

export type ReactSetState<StateType> = React.Dispatch<React.SetStateAction<StateType>>;

export abstract class AbstractReactState<StateType> {
  private _state: StateType;
  private _setState: ReactSetState<StateType>;
  private _initialState: StateType;

  constructor(state: StateType, setState: ReactSetState<StateType>) {
    this._state = state;
    this._setState = setState;
    this._initialState =  { ...state };
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

  refresh(): void {
    this._setState({ ...this._state });
  }

  reset(): void {
    this._setState(this._initialState);
  }
}
