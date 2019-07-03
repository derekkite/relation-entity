import {
    EntityRelationState,
    EntityRelationStateAdapter,
    IdSelector,
    Update,
    Predicate,
    EntityRelationMap, KeySelector,
} from './models';
import {createStateOperator, DidMutate} from './state_adapter';
import {selectIdValue, selectKeyValue} from './utils';

interface relationparameter {
    [id: string]: [
        {
            tag: string,
            old: { [relation: string]: string },
            new: { [relation: string]: string }
        }
        ]
}


export function createUnsortedStateAdapter<T>(
    selectId: IdSelector<T>,
    selectKey: KeySelector<T>
): EntityRelationStateAdapter<T>;
export function createUnsortedStateAdapter<T>(selectId: IdSelector<T>, selectKey: KeySelector<T>): any {
    type R = EntityRelationState<T>;
    
    function addOneMutably(entity: T, state: R): DidMutate;
    function addOneMutably(entity: any, state: any): DidMutate {
        // console.log('selectIdValue addOneMutably', entity);
        const key = selectIdValue(entity, selectId);
        
        if (key in state.entities) {
            
            return DidMutate.None;
        }
        // console.log('addOneMutably', entity);
        const rel = selectKeyValue(entity, selectKey);
        state.ids.push(key);
        
        Object.keys(rel).forEach(r => {
            
            if (state.keys[r] && state.keys[r][rel[r]]) {
                state.keys[r][rel[r]].push(key);
            } else {
                state.keys[r] = {...state.keys[r], [rel[r]]: [key]};
            }
        });
        state.entities[key] = entity;
        
        return DidMutate.Both;
    }
    
    function addManyMutably(entities: T[], state: R): DidMutate;
    function addManyMutably(entities: any[], state: any): DidMutate {
        let didMutate = false;
        
        for (const entity of entities) {
            
            didMutate = addOneMutably(entity, state) !== DidMutate.None || didMutate;
        }
        
        return didMutate ? DidMutate.Both : DidMutate.None;
    }
    
    function addAllMutably(entities: T[], state: R): DidMutate;
    function addAllMutably(entities: any[], state: any): DidMutate {
        state.ids = [];
        state.entities = {};
        state.keys = {};
        addManyMutably(entities, state);
        
        return DidMutate.Both;
    }
    
    function removeOneMutably(key: T, state: R): DidMutate;
    function removeOneMutably(key: any, state: any): DidMutate {
        return removeManyMutably([key], state);
    }
    
    function removeManyMutably(keys: T[], state: R): DidMutate;
    function removeManyMutably(predicate: Predicate<T>, state: R): DidMutate;
    
    function removeManyMutably(
        keysOrPredicate: any[] | Predicate<T>,
        state: any
    ): DidMutate {
        const keys =
            keysOrPredicate instanceof Array
                ? keysOrPredicate
                : state.ids.filter((key: any) => keysOrPredicate(state.entities[key]));
        
        // keys is list of ids to remove
        // either a direct array or a function that returns boolean
        
        const didMutate =
            keys
                .filter((key: any) => key in state.entities)
                .map((k: any) => {
                    Object.keys(state.keys).forEach(indexkey => {
                        let rkey = selectKey[indexkey](state.entities[k]);
                        state.keys[indexkey][rkey] = state.keys[indexkey][rkey].filter(i => i !== k);
                        if (state.keys[indexkey][rkey].length === 0) {
                            delete state.keys[indexkey][rkey];
                        }
                    });
                    return k;
                })
                .map((key: any) => delete state.entities[key]).length > 0;
        
        if (didMutate) {
            state.ids = state.ids.filter((id: any) => id in state.entities);
            
            
        }
        
        return didMutate ? DidMutate.Both : DidMutate.None;
    }
    
    function removeAll<S extends R>(state: S): S;
    function removeAll<S extends R>(state: any): S {
        return Object.assign({}, state, {
            ids: [],
            entities: {},
            keys: {}
        });
    }
    
    function takeNewKey(
        keys: { [id: string]: string },
        relations: {
            [id: string]: [
                {
                    tag: string,
                    old: { [relation: string]: string },
                    new: { [relation: string]: string }
                }
                ]
        },
        update: Update<T>,
        state: R
    ): void;
    
    function takeNewKey(
        keys: { [id: string]: any },
        relations: relationparameter,
        update: Update<T>,
        state: any
    ): boolean {
        // console.log('takeNewKey', update, relations);
        // get original entity
        const original = state.entities[update.id];
        const originalid = selectIdValue(original, selectId);
        const originalrelation = selectKeyValue(original, selectKey);
        // create new entity with update
        const updated: T = Object.assign({}, original, update.changes);
        // get key values
        // console.log('takenewkey selectIdValue', updated, selectId);
        const newKey = selectIdValue(updated, selectId);
        
        const newRelation = selectKeyValue(updated, selectKey);
        const hasNewKey = newKey !== update.id;
        let hasNewRelation = false;
        // console.log('newrelation', newRelation);
        for (let r in newRelation) {   // keys
            // console.log(r, originalrelation, newRelation);
            if (originalrelation[r] !== newRelation[r] || hasNewKey) {
                hasNewRelation = true;
                if (originalid in relations) {
                    relations[originalid].push({
                        tag: r,
                        old: {[<string>originalrelation[r]]: <string>originalid},
                        new: {[<string>newRelation[r]]: <string>newKey}
                    });
                } else {
                    relations[originalid] = [{
                        tag: r,
                        old: {[<string>originalrelation[r]]: <string>update.id},
                        new: {[<string>newRelation[r]]: <string>newKey}
                    }];
                }
            }
        }
        // console.log('relations', relations);
        // console.log(relations['332'][0]['tag']);
        // console.log(relations['332'][0]['old']);
        // console.log(relations['332'][0]['new']);
        if (hasNewKey) {
            keys[update.id] = newKey;
            delete state.entities[update.id];
        }
        
        state.entities[newKey] = updated;
        // console.log('takenewkey', hasNewKey, hasNewRelation);
        return hasNewKey || hasNewRelation;
    }
    
    
    function updateRelationIds(
        keys: { [id: string]: any },
        relations: relationparameter,
        state: any
    ): void {
        // console.log('relations', relations, state.keys);
        let k = Object.keys(relations)
            .forEach(relationid => {
                // get array of changes
                relations[relationid].forEach((change: {
                    tag: string,
                    old: { [relation: string]: string },
                    new: { [relation: string]: string }
                }) => {
                    
                    let oldrelation = Object.keys(change.old)[0];
                    let newrelation = Object.keys(change.new)[0];
                    let oldid = change.old[oldrelation];
                    let newid = change.new[newrelation];
        
                    // console.log('updaterelationids', state.keys, oldrelation, newrelation, oldid, newid);
                    // find old id in old relation and remove it
                    state.keys[change.tag][oldrelation] = state.keys[change.tag][oldrelation]
                        .filter(id => id !== oldid);
                    
                    if (state.keys[change.tag][oldrelation].length < 1) {
                        delete state.keys[change.tag][oldrelation];
                    }
                    
                    if (state.keys[change.tag][newrelation]) {
                        state.keys[change.tag][newrelation].push(newid);
                    } else {
                        state.keys[change.tag][newrelation] = [newid];
                    }
                    
                    
                    // no change in id, but change in relation
                    // both change
                })
            })
    }
    
    
    function updateOneMutably(update: Update<T>, state: R): DidMutate;
    function updateOneMutably(update: any, state: any): DidMutate {
        return updateManyMutably([update], state);
    }
    
    function updateManyMutably(updates: Update<T>[], state: R): DidMutate;
    
    function updateManyMutably(updates: any[], state: any): DidMutate {
        const newKeys: { [id: string]: string } = {};
        const newRelations: relationparameter = {};
        updates = updates.filter(update => update.id in state.entities);
        
        const didMutateEntities = updates.length > 0;
        // console.log('didMutateentities', didMutateEntities);
        if (didMutateEntities) {
            const didMutateIds =
                updates.filter(update => takeNewKey(newKeys, newRelations, update, state)).length > 0;
            // console.log('didMutateIds', didMutateIds);
            if (didMutateIds) {
                // console.log('didMutateIds', didMutateIds);
                state.ids = state.ids.map((id: any) => newKeys[id] || id);
                // console.log('updateManyMutably', newKeys, newRelations, state);
                updateRelationIds(newKeys, newRelations, state);
                return DidMutate.Both;
            } else {
                return DidMutate.Both;
            }
        }
        
        return DidMutate.None;
    }
    
    function mapMutably(map: EntityRelationMap<T>, state: R): DidMutate;
    function mapMutably(map: any, state: any): DidMutate {
        const changes: Update<T>[] = state.ids.reduce(
            (changes: any[], id: string | number) => {
                const change = map(state.entities[id]);
                if (change !== state.entities[id]) {
                    changes.push({id, changes: change});
                }
                return changes;
            },
            []
        );
        const updates = changes.filter(({id}) => id in state.entities);
        
        return updateManyMutably(updates, state);
    }
    
    function upsertOneMutably(entity: T, state: R): DidMutate;
    function upsertOneMutably(entity: any, state: any): DidMutate {
        return upsertManyMutably([entity], state);
    }
    
    function upsertManyMutably(entities: T[], state: R): DidMutate;
    function upsertManyMutably(entities: any[], state: any): DidMutate {
        const added: any[] = [];
        const updated: any[] = [];
        
        for (const entity of entities) {
            // console.log('selectIdValue upsertManyMutably', entity);
            const id = selectIdValue(entity, selectId);
            if (id in state.entities) {
                updated.push({id, changes: entity});
            } else {
                added.push(entity);
            }
        }
        
        const didMutateByUpdated = updateManyMutably(updated, state);
        const didMutateByAdded = addManyMutably(added, state);
        
        switch (true) {
            case didMutateByAdded === DidMutate.None &&
            didMutateByUpdated === DidMutate.None:
                return DidMutate.None;
            case didMutateByAdded === DidMutate.Both ||
            didMutateByUpdated === DidMutate.Both:
                return DidMutate.Both;
            default:
                return DidMutate.EntitiesOnly;
        }
    }
    
    return {
        removeAll,
        addOne: createStateOperator(addOneMutably),
        addMany: createStateOperator(addManyMutably),
        addAll: createStateOperator(addAllMutably),
        updateOne: createStateOperator(updateOneMutably),
        updateMany: createStateOperator(updateManyMutably),
        upsertOne: createStateOperator(upsertOneMutably),
        upsertMany: createStateOperator(upsertManyMutably),
        removeOne: createStateOperator(removeOneMutably),
        removeMany: createStateOperator(removeManyMutably),
        map: createStateOperator(mapMutably),
    };
}
