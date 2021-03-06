import * as ngCore from '@angular/core';
import { selectIdValue } from '../utils';
import { BookModel, AClockworkOrange } from './book';

describe('Entity utils', () => {
  describe(`selectIdValue()`, () => {
    it('should not warn when key does exist', () => {
      const spy = spyOn(console, 'warn');

      const key = selectIdValue(AClockworkOrange, book => book.id);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should warn when key does not exist in dev mode', () => {
      const spy = spyOn(console, 'warn');

      const key = selectIdValue(AClockworkOrange, (book: any) => book.foo);

      expect(spy).toHaveBeenCalled();
    });

    
  });
});
