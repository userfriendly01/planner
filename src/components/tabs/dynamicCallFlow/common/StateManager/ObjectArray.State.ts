import { AbstractReactStateDeprecated } from "./AbstractReactStateDeprecated";

export class ObjectArrayState<T> extends AbstractReactStateDeprecated<Array<T>> {
  constructor() {
    super([]);
  }
}