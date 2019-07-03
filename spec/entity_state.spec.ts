import {EntityRelationAdapter} from '../';
import { BookModel } from './book';
import {createEntityRelationAdapter} from "../create_adapter";

describe('Entity State', () => {
  let adapter: EntityRelationAdapter<BookModel>;

  beforeEach(() => {
    adapter = createEntityRelationAdapter({
      selectId: (book: BookModel) => book.id,
    });
  });

  it('should let you get the initial state', () => {
    const initialState = adapter.getInitialState();

    expect(initialState).toEqual({
      ids: [],
      entities: {},
      keys: {}
    });
  });

  it('should let you provide additional initial state properties', () => {
    const additionalProperties = { isHydrated: true };

    const initialState = adapter.getInitialState(additionalProperties);

    expect(initialState).toEqual({
      ...additionalProperties,
      ids: [],
      entities: {},
      keys: {}
    });
  });
});
