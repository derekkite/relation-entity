
export interface BookModel {
  id: string;
  title: string;
}

export interface BorrowModel {
  id: string;
  borrowerid: string;
  bookid: string;
  desc: string;
}

export interface BorrowerModel {
  id: string;
  name: string;
}

export const AClockworkOrange: BookModel = {
  id: 'aco',
  title: 'A Clockwork Orange',
};

export const AnimalFarm: BookModel = {
  id: 'af',
  title: 'Animal Farm',
};

export const TheGreatGatsby: BookModel = {
  id: 'tgg',
  title: 'The Great Gatsby',
};


export const george: BorrowerModel = {
  id: 'ggg',
  name: 'george'
};

export const peter: BorrowerModel = {
  id: 'ppp',
  name: 'peter'
};

export const john: BorrowerModel = {
  id: 'jjj',
  name: 'john'
};

export const georgethethief1: BorrowModel = {
    id: '332',
    bookid: 'tgg',
    borrowerid: 'ggg',
    desc: 'check pockets'
};

export const georgethethief2: BorrowModel = {
  id: '333',
  bookid: 'af',
  borrowerid: 'ggg',
  desc: 'check socks'
};

export const georgethethief3: BorrowModel = {
  id: '334',
  bookid: 'aco',
  borrowerid: 'ggg',
  desc: 'check backpack'
};

export const peterwithglasses: BorrowModel = {
  id: '435',
  bookid: 'tgg',
  borrowerid: 'ggg',
  desc: 'reads too much'
};

export const johnwith: BorrowModel = {
  id: '436',
  bookid: 'af',
  borrowerid: 'jjj',
  desc: 'never alone'
};
