import { EntityRelationAdapter, EntityRelationState } from '../';
import { EntityRelationSelectors } from '../models';
import {
  BookModel,
  AClockworkOrange,
  AnimalFarm,
  TheGreatGatsby,
  BorrowerModel,
  BorrowModel,
  george,
  peter,
  john,
  georgethethief2,
  georgethethief3,
  peterwithglasses,
  johnwith, georgethethief1,
} from './book';
import {createEntityRelationAdapter} from "../create_adapter";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {EntitySelectors} from "@ngrx/entity/src/models";

describe('Entity State Selectors', () => {
  describe('Composed Selectors', () => {
    interface State {
      books: EntityState<BookModel>;
      borrowers: EntityState<BorrowerModel>;
      borrows: EntityRelationState<BorrowModel>;
    }

    let bookadapter: EntityAdapter<BookModel>;
    let bookselectors: EntitySelectors<BookModel, State>;
    let borroweradapter: EntityAdapter<BorrowerModel>;
    let borrowerSelectors: EntitySelectors<BorrowerModel, State>;
    let borrowadapter: EntityRelationAdapter<BorrowModel>;
    let borrowSelectors: EntityRelationSelectors<BorrowModel, State>;
    let state: State;

    beforeEach(() => {
      bookadapter = createEntityAdapter({
        selectId: (book: BookModel) => book.id,
      });
      
      borroweradapter = createEntityAdapter({
        selectId: (borrower: BorrowerModel) => borrower.id
      });
      
      borrowadapter = createEntityRelationAdapter({
        selectId: (borrow: BorrowModel) => borrow.id,
        selectKey: {
          book: (borrow: BorrowModel) => borrow.bookid,
          borrower: (borrow: BorrowModel) => borrow.borrowerid
        }
      });

      state = {
        books: bookadapter.addAll(
          [AClockworkOrange, AnimalFarm, TheGreatGatsby],
          bookadapter.getInitialState()
        ),
        borrowers: borroweradapter.addAll(
            [george, peter, john],
            borroweradapter.getInitialState()
        ),
        borrows: borrowadapter.addAll(
            [georgethethief1, georgethethief2, georgethethief3, peterwithglasses, johnwith],
            borrowadapter.getInitialState()
        )
      };

      bookselectors = bookadapter.getSelectors((state: State) => state.books);
      borrowerSelectors = borroweradapter.getSelectors((state: State) => state.borrowers);
      borrowSelectors = borrowadapter.getSelectors((state: State) => state.borrows);
    });

    it('should create a selector for selecting the ids', () => {
      const ids = bookselectors.selectIds(state);

      expect(ids).toEqual(state.books.ids);
    });

    it('should create a selector for selecting the entities', () => {
      const entities = bookselectors.selectEntities(state);

      expect(entities).toEqual(state.books.entities);
    });

    it('should create a selector for selecting the list of models', () => {
      const models = bookselectors.selectAll(state);

      expect(models).toEqual([AClockworkOrange, AnimalFarm, TheGreatGatsby]);
    });

    it('should create a selector for selecting the count of models', () => {
      const total = bookselectors.selectTotal(state);

      expect(total).toEqual(3);
    });
  });

  describe('Uncomposed Selectors', () => {
    type State = EntityRelationState<BookModel>;

    let adapter: EntityRelationAdapter<BookModel>;
    let selectors: EntityRelationSelectors<BookModel, EntityRelationState<BookModel>>;
    let state: State;

    beforeEach(() => {
      adapter = createEntityRelationAdapter({
        selectId: (book: BookModel) => book.id,
      });

      state = adapter.addAll(
        [AClockworkOrange, AnimalFarm, TheGreatGatsby],
        adapter.getInitialState()
      );

      selectors = adapter.getSelectors();
    });

    it('should create a selector for selecting the ids', () => {
      const ids = selectors.selectIds(state);

      expect(ids).toEqual(state.ids);
    });

    it('should create a selector for selecting the entities', () => {
      const entities = selectors.selectEntities(state);

      expect(entities).toEqual(state.entities);
    });

    it('should create a selector for selecting the list of models', () => {
      const models = selectors.selectAll(state);

      expect(models).toEqual([AClockworkOrange, AnimalFarm, TheGreatGatsby]);
    });

    it('should create a selector for selecting the count of models', () => {
      const total = selectors.selectTotal(state);

      expect(total).toEqual(3);
    });
  });
});
