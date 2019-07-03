import { createSelector } from '@ngrx/store';
import { EntityRelationState, EntityRelationSelectors, Dictionary } from './models';

export function createSelectorsFactory<T>() {
  function getSelectors(): EntityRelationSelectors<T, EntityRelationState<T>>;
  function getSelectors<V>(
    selectState: (state: V) => EntityRelationState<T>
  ): EntityRelationSelectors<T, V>;
  function getSelectors(
    selectState?: (state: any) => EntityRelationState<T>
  ): EntityRelationSelectors<T, any> {
    const selectIds = (state: any) => state.ids;
    const selectKeys = (state: any) => state.keys;
    const selectEntities = (state: EntityRelationState<T>) => state.entities;
    const selectAll = createSelector(
      selectIds,
      selectEntities,
      (ids: T[], entities: Dictionary<T>): any =>
        ids.map((id: any) => (entities as any)[id])
    );

    const selectTotal = createSelector(selectIds, ids => ids.length);

    if (!selectState) {
      return {
        selectIds,
        selectKeys,
        selectEntities,
        selectAll,
        selectTotal,
      };
    }

    return {
      selectIds: createSelector(selectState, selectIds),
      selectKeys: createSelector(selectState, selectKeys),
      selectEntities: createSelector(selectState, selectEntities),
      selectAll: createSelector(selectState, selectAll),
      selectTotal: createSelector(selectState, selectTotal),
    };
  }

  return { getSelectors };
}
