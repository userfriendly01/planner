import React from "react";

export interface ReactStateAction<StateActionType> {
  state: StateActionType;
  setState: React.Dispatch<React.SetStateAction<StateActionType>>;
}