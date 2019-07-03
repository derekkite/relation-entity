import {isDevMode} from '@angular/core';
import {IdSelector, KeySelector} from './models';

export function selectIdValue<T>(entity: T, selectId: IdSelector<T>) {
    const key = selectId(entity);
    
    if (isDevMode() && key === undefined) {
        console.warn(
            '@ngrx/entity: The entity passed to the `selectId` implementation returned undefined.',
            'You should probably provide your own `selectId` implementation.',
            'The entity that was passed:',
            entity,
            'The `selectId` implementation:',
            selectId.toString()
        );
    }
    
    return key;
}

export function selectKeyValue<T>(entity: T, selectKey: KeySelector<T>) {
    
    let key = {};
    Object.keys(selectKey).forEach(k => {
        key[k] = selectKey[k](entity);
    
    
        if (isDevMode() && key[k] === undefined) {
            console.warn(
                '@ngrx/entity: The entity passed to the `selectKey` implementation returned undefined.',
                'You should probably provide your own `selectKey` implementation.',
                'The entity that was passed:',
                entity,
                'The `selectKey` implementation:',
                selectKey.toString()
            );
        }
    });
    
    return key;
}
