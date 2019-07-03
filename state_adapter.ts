import { EntityRelationState } from './models';

export enum DidMutate {
  EntitiesOnly,
  Both,
  None,
}

export function createStateOperator<V, R>(
  mutator: (arg: R, state: EntityRelationState<V>) => DidMutate
): EntityRelationState<V>;
export function createStateOperator<V, R>(
  mutator: (arg: any, state: any) => DidMutate
): any {
  return function operation<S extends EntityRelationState<V>>(arg: R, state: any): S {
    const clonedEntityState: EntityRelationState<V> = {
      ids: [...state.ids],
      entities: { ...state.entities },
      keys: {...state.keys}
    };

    const didMutate = mutator(arg, clonedEntityState);

    if (didMutate === DidMutate.Both) {
      return Object.assign({}, state, clonedEntityState);
    }

    if (didMutate === DidMutate.EntitiesOnly) {
      return {
        ...state,
        entities: clonedEntityState.entities,
      };
    }

    return state;
  };
}
