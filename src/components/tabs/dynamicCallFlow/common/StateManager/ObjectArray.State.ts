import { AbstractReactState } from "./AbstractReact.State";

export class ObjectArrayState<T> extends AbstractReactState<Array<T>> {
  constructor() {
    super([]);
  }
}