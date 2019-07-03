export type ComparerStr<T> = (a: T, b: T) => string;
export type ComparerNum<T> = (a: T, b: T) => number;

export type Comparer<T> = ComparerNum<T> | ComparerStr<T>;

export type IdSelectorStr<T> = (model: T) => string;
export type IdSelectorNum<T> = (model: T) => number;

export type IdSelector<T> = IdSelectorStr<T> | IdSelectorNum<T>;

export type KeySelector<T> = {[keyname: string]: IdSelector<T>};

export interface DictionaryNum<T> {
    [id: number]: T;
}

export abstract class Dictionary<T> implements DictionaryNum<T> {
    [id: string]: T;
}

export interface UpdateStr<T> {
    id: string;
    changes: Partial<T>;
}

export interface UpdateNum<T> {
    id: number;
    changes: Partial<T>;
}

export interface RelationalKeys {
    [index: string]: { [key: string]: string[] };
}

export type Update<T> = UpdateStr<T> | UpdateNum<T>;

export type Predicate<T> = (entity: T) => boolean;

export type EntityRelationMap<T> = (entity: T) => T;

export interface EntityRelationState<T> {
    ids: string[] | number[];
    keys: RelationalKeys;
    entities: Dictionary<T>;
}

export interface EntityDefinition<T> {
    selectId: IdSelector<T>;
    sortComparer: false | Comparer<T>;
    selectKey: KeySelector<T>;
    
}

export interface EntityRelationStateAdapter<T> {
    addOne<S extends EntityRelationState<T>>(entity: T, state: S): S;
    
    addMany<S extends EntityRelationState<T>>(entities: T[], state: S): S;
    
    addAll<S extends EntityRelationState<T>>(entities: T[], state: S): S;
    
    removeOne<S extends EntityRelationState<T>>(key: string, state: S): S;
    
    removeOne<S extends EntityRelationState<T>>(key: number, state: S): S;
    
    removeMany<S extends EntityRelationState<T>>(keys: string[], state: S): S;
    
    removeMany<S extends EntityRelationState<T>>(keys: number[], state: S): S;
    
    removeMany<S extends EntityRelationState<T>>(predicate: Predicate<T>, state: S): S;
    
    removeAll<S extends EntityRelationState<T>>(state: S): S;
    
    updateOne<S extends EntityRelationState<T>>(update: Update<T>, state: S): S;
    
    updateMany<S extends EntityRelationState<T>>(updates: Update<T>[], state: S): S;
    
    upsertOne<S extends EntityRelationState<T>>(entity: T, state: S): S;
    
    upsertMany<S extends EntityRelationState<T>>(entities: T[], state: S): S;
    
    map<S extends EntityRelationState<T>>(map: EntityRelationMap<T>, state: S): S;
}

export interface EntityRelationSelectors<T, V> {
    selectIds: (state: V) => string[] | number[];
    selectKeys: (state: V) => string[] | number[];
    selectEntities: (state: V) => Dictionary<T>;
    selectAll: (state: V) => T[];
    selectTotal: (state: V) => number;
}

export interface EntityRelationAdapter<T> extends EntityRelationStateAdapter<T> {
    selectId: IdSelector<T>;
    sortComparer: false | Comparer<T>;
    selectKey: KeySelector<T>;
    
    getInitialState(): EntityRelationState<T>;
    
    getInitialState<S extends object>(state: S): EntityRelationState<T> & S;
    
    getSelectors(): EntityRelationSelectors<T, EntityRelationState<T>>;
    
    getSelectors<V>(
        selectState: (state: V) => EntityRelationState<T>
    ): EntityRelationSelectors<T, V>;
}
