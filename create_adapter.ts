import { createSelector } from '@ngrx/store';
import {
  EntityDefinition,
  Comparer,
  IdSelector,
  EntityRelationAdapter, KeySelector,
  
} from './models';
import { createInitialStateFactory } from './entity_state';
import { createSelectorsFactory } from './state_selectors';
import { createSortedStateAdapter } from './sorted_state_adapter';
import { createUnsortedStateAdapter } from './unsorted_state_adapter';

export function createEntityRelationAdapter<T>(
  options: {
    selectId?: IdSelector<T>;
    sortComparer?: false | Comparer<T>;
    selectKey?: KeySelector<T>;
  } = {}
): EntityRelationAdapter<T> {
  const { selectId, sortComparer, selectKey }: EntityDefinition<T> = {
    sortComparer: false,
    selectId: (instance: any) => instance.id,
    selectKey: {'key': (instance: any) => instance.key},
    ...options,
  };

  const stateFactory = createInitialStateFactory<T>();
  const selectorsFactory = createSelectorsFactory<T>();
  const stateAdapter = sortComparer
    ? createSortedStateAdapter(selectId, sortComparer, selectKey)
    : createUnsortedStateAdapter(selectId, selectKey);

  return {
    selectId,
    sortComparer,
    selectKey,
    ...stateFactory,
    ...selectorsFactory,
    ...stateAdapter,
  };
}
