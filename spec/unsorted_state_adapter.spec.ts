import {EntityRelationAdapter, EntityRelationState} from '../models';
import {createEntityRelationAdapter} from '../create_adapter';
import {
    BookModel,
    TheGreatGatsby,
    AClockworkOrange,
    AnimalFarm,
    georgethethief1,
    BorrowerModel,
    BorrowModel,
    george,
    peter,
    john,
    georgethethief2,
    georgethethief3,
    peterwithglasses,
    johnwith
} from './book';
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";

describe('Unsorted State Adapter', () => {
    let bookadapter: EntityAdapter<BookModel>;
    let bookstate: EntityState<BookModel>;
    let borroweradapter: EntityAdapter<BorrowerModel>;
    let borrowerstate: EntityState<BorrowerModel>;
    let borrowadapter: EntityRelationAdapter<BorrowModel>;
    let borrowstate: EntityRelationState<BorrowModel>;
    
    beforeAll(() => {
        Object.defineProperty(Array.prototype, 'unwantedField', {
            enumerable: true,
            configurable: true,
            value: 'This should not appear anywhere',
        });
    });
    
    afterAll(() => {
        delete (Array.prototype as any).unwantedField;
    });
    
    beforeEach(() => {
        bookadapter = createEntityAdapter({
            selectId: (book: BookModel) => book.id,
        });
        bookstate = {ids: [], entities: {}};
        
        borrowadapter = createEntityRelationAdapter({
            selectId: (borrow: BorrowModel) => borrow.id,
            selectKey: {
                book: (borrow: BorrowModel) => borrow.bookid,
                borrower: (borrow: BorrowModel) => borrow.borrowerid
            },
        });
        borrowstate = {ids: [], entities: {}, keys: {}};
        
        borroweradapter = createEntityAdapter({
            selectId: (borrower: BorrowerModel) => borrower.id,
        });
        borrowerstate = {ids: [], entities: {}};
    });
    
    it('should let you add one entity to the state', () => {
        const withOneEntity = borrowadapter.addOne(georgethethief1, borrowstate);
        
        expect(withOneEntity).toEqual({
            ids: [georgethethief1.id],
            entities: {
                [georgethethief1.id]: georgethethief1,
            },
            keys: {
                book: {[georgethethief1.bookid]: [georgethethief1.id]},
                borrower: {[georgethethief1.borrowerid]: [georgethethief1.id]}
            }
            
        });
    });
    
    it('should not change state if you attempt to re-add an entity', () => {
        
        const withOneEntity = borrowadapter.addOne(georgethethief1, borrowstate);
        
        const readded = borrowadapter.addOne(georgethethief1, withOneEntity);
        
        expect(readded).toBe(withOneEntity);
    });
    
    it('should let you add many entities to the state', () => {
        let withOneEntity = borrowadapter.addOne(georgethethief1, borrowstate);
        
        const withManyMore = borrowadapter.addMany(
            [georgethethief2, georgethethief3, peterwithglasses, johnwith],
            withOneEntity
        );
        
        expect(withManyMore).toEqual({
            ids: [
                georgethethief1.id,
                georgethethief2.id,
                georgethethief3.id,
                peterwithglasses.id,
                johnwith.id
            ],
            
            entities: {
                [georgethethief1.id]: georgethethief1,
                [georgethethief2.id]: georgethethief2,
                [georgethethief3.id]: georgethethief3,
                [peterwithglasses.id]: peterwithglasses,
                [johnwith.id]: johnwith
            },
            keys: {
                book: {
                    'tgg': [georgethethief1.id, peterwithglasses.id],
                    'af': [georgethethief2.id, johnwith.id],
                    'aco': [georgethethief3.id]
                },
                borrower: {
                    'ggg': [
                        georgethethief1.id,
                        georgethethief2.id,
                        georgethethief3.id,
                        peterwithglasses.id
                    ],
                    'jjj': [johnwith.id]
                }
            }
        });
    });
    
    it('should let you add all entities to the state', () => {
        const withOneEntity = borrowadapter.addOne(georgethethief1, borrowstate);
        
        const withAll = borrowadapter.addAll(
            [georgethethief1, georgethethief2, georgethethief3, peterwithglasses, johnwith],
            withOneEntity
        );
        
        expect(withAll).toEqual({
            ids: [
                georgethethief1.id,
                georgethethief2.id,
                georgethethief3.id,
                peterwithglasses.id,
                johnwith.id
            ],
            
            entities: {
                [georgethethief1.id]: georgethethief1,
                [georgethethief2.id]: georgethethief2,
                [georgethethief3.id]: georgethethief3,
                [peterwithglasses.id]: peterwithglasses,
                [johnwith.id]: johnwith
            },
            keys: {
                book: {
                    'tgg': [georgethethief1.id, peterwithglasses.id],
                    'af': [georgethethief2.id, johnwith.id],
                    'aco': [georgethethief3.id]
                },
                borrower: {
                    'ggg': [
                        georgethethief1.id,
                        georgethethief2.id,
                        georgethethief3.id,
                        peterwithglasses.id
                    ],
                    'jjj': [johnwith.id]
                }
            }
        });
    });
    
    it('should let you add remove an entity from the state', () => {
        const withOneEntity = borrowadapter.addOne(georgethethief1, borrowstate);
        
        const withoutOne = borrowadapter.removeOne(georgethethief1.id, borrowstate);
        
        expect(withoutOne).toEqual({
            ids: [],
            entities: {},
            keys: {}
        });
    });
    
    it('should let you remove many entities by id from the state', () => {
        const withAll = borrowadapter.addAll(
            [georgethethief2, georgethethief3, peterwithglasses, johnwith],
            borrowstate
        );
        
        const withoutMany = borrowadapter.removeMany(
            [georgethethief2.id, georgethethief3.id],
            withAll
        );
        
        expect(withoutMany).toEqual({
            ids: [
                peterwithglasses.id,
                johnwith.id
            ],
            
            entities: {
                [peterwithglasses.id]: peterwithglasses,
                [johnwith.id]: johnwith
            },
            keys: {
                book: {
                    'tgg': [peterwithglasses.id],
                    'af': [johnwith.id]
                },
                borrower: {
                    'ggg': [peterwithglasses.id],
                    'jjj': [johnwith.id]
                }
            }
        });
    });
    
    it('should let you remove many entities by a predicate from the state', () => {
        const withAll = borrowadapter.addAll(
            [georgethethief2, georgethethief3, peterwithglasses, johnwith],
            borrowstate
        );
        
        const withoutMany = borrowadapter.removeMany(p => p.id.startsWith('3'), withAll);
        
        expect(withoutMany).toEqual({
            ids: [
                peterwithglasses.id,
                johnwith.id
            ],
            
            entities: {
                [peterwithglasses.id]: peterwithglasses,
                [johnwith.id]: johnwith
            },
            keys: {
                book: {
                    'tgg': [peterwithglasses.id],
                    'af': [johnwith.id]
                },
                borrower: {
                    'ggg': [peterwithglasses.id],
                    'jjj': [johnwith.id]
                }
            }
        });
    });
    
    it('should let you remove all entities from the state', () => {
        const withAll = borrowadapter.addAll(
            [georgethethief2, georgethethief3, peterwithglasses, johnwith],
            borrowstate
        );
        
        const withoutAll = borrowadapter.removeAll(withAll);
        
        expect(withoutAll).toEqual({
            ids: [],
            entities: {},
            keys: {}
        });
    });
    
    it('should let you update an entity in the state', () => {
        const withOne = borrowadapter.addOne(georgethethief1, borrowstate);
        const changes = {bookid: 'af'};
        
        expect(withOne).toEqual({
            ids: [georgethethief1.id],
            entities: {
                [georgethethief1.id]: georgethethief1,
            },
            keys: {
                book: {[georgethethief1.bookid]: [georgethethief1.id]},
                borrower: {[georgethethief1.borrowerid]: [georgethethief1.id]}
            }
            
        });
        
        const withUpdates = borrowadapter.updateOne(
            {
                id: georgethethief1.id,
                changes,
            },
            withOne
        );
        
        
        expect(withUpdates).toEqual({
            ids: [georgethethief1.id],
            entities: {
                [georgethethief1.id]: {
                    ...georgethethief1,
                    ...changes,
                },
            },
            keys: {
                book: {'af': [georgethethief1.id]},
                borrower: {'ggg': [georgethethief1.id]}
            }
        });
    });
    
    it('should not change state if you attempt to update an entity that has not been added', () => {
        const withUpdates = borrowadapter.updateOne(
            {
                id: georgethethief1.id,
                changes: {bookid: 'af'},
            },
            borrowstate
        );
        
        expect(withUpdates).toBe(borrowstate);
    });
    
    it('should not change ids state if you attempt to update an entity that has already been added', () => {
        const withOne = borrowadapter.addOne(georgethethief1, borrowstate);
        const changes = {desc: 'af'};
        
        const withUpdates = borrowadapter.updateOne(
            {
                id: georgethethief1.id,
                changes,
            },
            withOne
        );
        
        expect(withOne.ids).toEqual(withUpdates.ids);
    });
    
    it('should let you update the id of entity', () => {
        const withOne = borrowadapter.addOne(georgethethief1, borrowstate);
        const changes = {id: 'A New Id'};
        
        const withUpdates = borrowadapter.updateOne(
            {
                ...georgethethief1,
                changes,
            },
            withOne
        );
        console.log('withUpdates', withUpdates.keys['book'], withUpdates.keys['borrower']);
        expect(withUpdates).toEqual({
            ids: [changes.id],
            entities: {
                [changes.id]: {
                    ...georgethethief1,
                    ...changes,
                },
            },
            keys: {
                book: {'tgg': [changes.id]},
                borrower: {'ggg': [changes.id]}
            }
        });
    });
    
    it('should let you update many entities by id in the state', () => {
        const firstChange = {desc: 'First Change'};
        const secondChange = {desc: 'Second Change'};
        const withMany = borrowadapter.addAll([georgethethief1, georgethethief2], borrowstate);
        
        const withUpdates = borrowadapter.updateMany(
            [
                {id: georgethethief1.id, changes: firstChange},
                {id: georgethethief2.id, changes: secondChange},
            ],
            withMany
        );
        
        expect(withUpdates).toEqual({
            ids: [georgethethief1.id, georgethethief2.id],
            entities: {
                [georgethethief1.id]: {
                    ...georgethethief1,
                    ...firstChange,
                },
                [georgethethief2.id]: {
                    ...georgethethief2,
                    ...secondChange,
                },
            },
            keys: {
                book: {
                    'tgg': [georgethethief1.id],
                    'af': [georgethethief2.id],
                    
                },
                borrower: {
                    'ggg': [
                        georgethethief1.id,
                        georgethethief2.id,
                    ],
                }
            }
        });
    });
    
    it('should let you map over entities in the state', () => {
        const firstChange = {...georgethethief1, desc: 'First change'};
        const secondChange = {...georgethethief2, desc: 'Second change'};
        
        const withMany = borrowadapter.addAll(
            [georgethethief1, georgethethief2, georgethethief3],
            borrowstate
        );
        
        const withUpdates = borrowadapter.map(
            borrow =>
                borrow.desc === georgethethief1.desc
                    ? firstChange
                    : borrow.desc === georgethethief2.desc
                    ? secondChange
                    : borrow,
            withMany
        );
        
        expect(withUpdates).toEqual({
            ids: [georgethethief1.id, georgethethief2.id, georgethethief3.id],
            entities: {
                [georgethethief1.id]: {
                    ...georgethethief1,
                    ...firstChange,
                },
                [georgethethief2.id]: {
                    ...georgethethief2,
                    ...secondChange,
                },
                [georgethethief3.id]: georgethethief3,
            },
            keys: {
                book: {
                    'tgg': [georgethethief1.id],
                    'af': [georgethethief2.id],
                    'aco': [georgethethief3.id]
                },
                borrower: {
                    'ggg': [
                        georgethethief1.id,
                        georgethethief2.id,
                        georgethethief3.id
                    ],
                }
            }
        });
    });
    
    it('should let you add one entity to the state with upsert()', () => {
        const withOneEntity = borrowadapter.upsertOne(georgethethief1, borrowstate);
        expect(withOneEntity).toEqual({
            ids: [georgethethief1.id],
            entities: {
                [georgethethief1.id]: georgethethief1,
            },
            keys: {
                book: {'tgg': [georgethethief1.id]},
                borrower: {'ggg': [georgethethief1.id]}
            }
        });
    });
    
    it('should let you update an entity in the state with upsert()', () => {
        const withOne = borrowadapter.addOne(georgethethief1, borrowstate);
        const changes = {desc: 'A New Hope'};
        
        const withUpdates = borrowadapter.upsertOne(
            {...georgethethief1, ...changes},
            withOne
        );
        expect(withUpdates).toEqual({
            ids: [georgethethief1.id],
            entities: {
                [georgethethief1.id]: {
                    ...georgethethief1,
                    ...changes,
                },
            },
            keys: {
                book: {'tgg': [georgethethief1.id]},
                borrower: {'ggg': [georgethethief1.id]}
            }
        });
    });
    
    it('should let you upsert many entities in the state', () => {
        const firstChange = {desc: 'First Change'};
        const withMany = borrowadapter.addAll([georgethethief1, georgethethief3, peterwithglasses], borrowstate);
        
        const withUpserts = borrowadapter.upsertMany(
            [{...georgethethief1, ...firstChange}, {...georgethethief2, bookid: 'tgg'}],
            withMany
        );
        
        // console.log('keys', withUpserts.keys.book, georgethethief1.bookid, georgethethief2.bookid);
        expect(withUpserts).toEqual({
            ids: [georgethethief1.id, georgethethief3.id, peterwithglasses.id, georgethethief2.id],
            entities: {
                [georgethethief1.id]: {
                    ...georgethethief1,
                    ...firstChange,
                },
                [georgethethief2.id]: {
                    ...georgethethief2,
                    bookid: 'tgg'
                },
                [georgethethief3.id]: {
                    ...georgethethief3
                },
                [peterwithglasses.id]: {
                    ...peterwithglasses
                }
            },
            keys: {
                book: {
                    'tgg': [georgethethief1.id, peterwithglasses.id, georgethethief2.id],
                    'aco': [georgethethief3.id]
                    
                },
                borrower: {
                    'ggg': [
                        georgethethief1.id,
                        georgethethief3.id,
                        peterwithglasses.id,
                        georgethethief2.id,
                    ],
                }
            }
        });
        const secondChange = {bookid: 'FFFF'};
        
        const secondUpserts = borrowadapter.upsertMany(
            [{...georgethethief1, ...firstChange, ...secondChange},
                {...peterwithglasses, borrowerid: 'egg'}],
            withUpserts
        );
        
        // console.log('keys', secondUpserts.keys);
        // console.log('ids', secondUpserts.ids);
        // console.log('entities', secondUpserts.entities);
        // console.log('george1', georgethethief1);
        // console.log('george2', georgethethief2);
        expect(secondUpserts).toEqual({
            ids: [georgethethief1.id, georgethethief3.id, peterwithglasses.id, georgethethief2.id],
            entities: {
                [georgethethief1.id]: {
                    ...georgethethief1,
                    ...firstChange,
                    ...secondChange
                },
                [georgethethief3.id]: {
                    ...georgethethief3
                },
                [peterwithglasses.id]: {
                    ...peterwithglasses,
                    borrowerid: 'egg'
                },
                [georgethethief2.id]: {
                    ...georgethethief2,
                    bookid: 'tgg'
                },
            },
            keys: {
                book: {
                    'FFFF': [georgethethief1.id],
                    'tgg': [peterwithglasses.id, georgethethief2.id],
                    'aco': [georgethethief3.id]
                    
                },
                borrower: {
                    'ggg': [
                        georgethethief1.id,
                        georgethethief3.id,
                        georgethethief2.id,
                    ],
                    'egg': [peterwithglasses.id]
                }
            }
        });
        
    });
    
    
});