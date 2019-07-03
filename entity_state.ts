import { EntityRelationState } from './models';

export function getInitialEntityState<V>(): EntityRelationState<V> {
  return {
    ids: [],
    entities: {},
    keys: {}
  };
}

export function createInitialStateFactory<V>() {
  function getInitialState(): EntityRelationState<V>;
  function getInitialState<S extends object>(
    additionalState: S
  ): EntityRelationState<V> & S;
  function getInitialState(additionalState: any = {}): any {
    return Object.assign(getInitialEntityState(), additionalState);
  }

  return { getInitialState };
}
