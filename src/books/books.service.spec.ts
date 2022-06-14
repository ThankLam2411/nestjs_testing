import { Test, TestingModule } from '@nestjs/testing';
import { SortBy } from '../common/pagination/pagination.dto';
import { BooksService } from './books.service';

const docData = {
  bookId: 'ibAhY13ANnNrvpkuhHSn',
  createdAt: 1654676479195,
  userId: '11SHdFs0FLTC0rNmNLhb',
  author: 'nhieu tac gia',
  name: 'truyen co tich',
  publish: '2022-06-08T08:16:46.471Z',
  userDoc: {
    name: 'alex',
    phone: '098345123',
    gender: 'male',
    age: 3,
    createdAt: 1654669480930,
  },
};
const docData2 = [
  {
    bookId: '0mr4rbSAxRhqQNmbR0nd',
    author: 'nhieu tac gia',
    createdAt: 1654676304410,
    publish: '2022-06-08T08:16:46.471Z',
    userId: '11SHdFs0FLTC0rNmNLhb',
    userDoc: {
      phone: '098345123',
      createdAt: 1654669480930,
      gender: 'male',
      name: 'alex',
      age: 3,
    },
    name: 'nhung cau chuyen bo ich',
  },
  {
    bookId: 'ibAhY13ANnNrvpkuhHSn',
    publish: '2022-06-08T08:16:46.471Z',
    userId: '11SHdFs0FLTC0rNmNLhb',
    createdAt: 1654676479195,
    author: 'nhieu tac gia',
    name: 'truyen co tich',
    userDoc: {
      gender: 'male',
      createdAt: 1654669480930,
      phone: '098345123',
      name: 'alex',
      age: 3,
    },
  },
];

const docData3 = [
  {
    author: 'nhieu tac gia',
    bookId: 'ibAhY13ANnNrvpkuhHSn',
    createdAt: 1654676479195,
    name: 'truyen co tich',
    publish: '2022-06-08T08:16:46.471Z',
    userDoc: {
      age: 3,
      createdAt: 1654669480930,
      gender: 'male',
      name: 'alex',
      phone: '098345123',
    },
    userId: '11SHdFs0FLTC0rNmNLhb',
  },
];

const docResult = {
  exists: true,
  docs: {
    map: () => docData2,
  },
  data: () => docData,
  forEach: jest.fn(),
};

const notExistResult = {
  exists: false,
  docs: null,
  data: () => null,
  forEach: jest.fn(),
  map: jest.fn(),
};
const mockedGet = {
  get: jest.fn(() => Promise.resolve(docResult)),
};
jest.mock('firebase-admin', () => {
  return {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            where: jest.fn(() => ({
              startAfter: jest.fn(() => ({
                get: mockedGet.get,
              })),
              get: mockedGet.get,
            })),
            get: mockedGet.get,
            startAfter: jest.fn(() => ({
              get: mockedGet.get,
            })),
          })),
        })),

        doc: jest.fn(() => ({
          get: mockedGet.get,
          set: mockedGet.get,
          collection: jest.fn(() => ({
            doc: jest.fn(() => ({
              set: mockedGet.get,
              get: mockedGet.get,
              delete: jest.fn(),
            })),
            add: jest.fn(() => ({
              get: mockedGet.get,
            })),
            get: mockedGet.get,
          })),
          delete: jest.fn(),
        })),
        add: jest.fn(() => ({
          collection: jest.fn(() => ({
            add: jest.fn(() => ({
              get: mockedGet.get,
            })),
          })),
        })),
      })),
    })),
    credential: {
      cert: jest.fn(),
    },
    initializeApp: jest.fn(),
  };
});
describe('BooksService', () => {
  let service: BooksService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();
    service = module.get<BooksService>(BooksService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('find 1 book', () => {
    it('should return book', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne');
      const res = await service.findOne('8ETtoEC5FczG8X6FfomF');
      expect(findOneSpy).toBeCalled();
      expect(res).toHaveProperty('name', 'truyen co tich');
    });
    it('should return not found', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne');
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.findOne('123456789');
      expect(res.error).toBe('Not Found');
    });
  });

  describe('create book', () => {
    it('create user successfully', async () => {
      const createSpy = jest.spyOn(service, 'create');
      const res = await service.create({
        name: 'truyen tranh',
        author: 'nhieu tac gia',
        publish: '2022-06-08T08:16:46.471Z',
        userId: '11SHdFs0FLTC0rNmNLhb',
      });
      expect(res).toHaveProperty('message', 'Create book successfully');
    });
    it('should be return error from user', async () => {
      const createSpy = jest.spyOn(service, 'create');
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.create({
        name: 'truyen tranh',
        author: 'nhieu tac gia',
        publish: '2022-06-08T08:16:46.471Z',
        userId: '123456',
      });
      expect(res.error).toBe('Not Found');
    });
  });

  describe('update book', () => {
    it('should be return book not found', async () => {
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.update('123456', {
        name: 'truyen tranh',
        author: 'nhieu tac gia',
        publish: '2022-06-08T08:16:46.471Z',
        userId: '11SHdFs0FLTC0rNmNLhb',
      });
      expect(res.error).toBe('Not Found');
    });
    it('should be return user not found', async () => {
      const updateSpy = jest.spyOn(service, 'update');
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.update('8ETtoEC5FczG8X6FfomF', {
        name: 'truyen tranh',
        author: 'nhieu tac gia',
        publish: '2022-06-08T08:16:46.471Z',
        userId: '1234567',
      });
      console.log(res);
      // expect(updateSpy).toBeCalled();
      expect(res.error).toBe('Not Found');
      expect(res.statusCode).toBe(404);
      // expect(res.message).toBe()
    });
    it('should be return successfully', async () => {
      const updateSpy = jest.spyOn(service, 'update');
      const res = await service.update('8ETtoEC5FczG8X6FfomF', {
        name: 'truyen tranh',
        author: 'nhieu tac gia',
        publish: '2022-06-08T08:16:46.471Z',
        userId: '11SHdFs0FLTC0rNmNLhb',
      });
      expect(res.message).toBe('Updated successfully');
    });
  });

  describe('delete book', () => {
    it('should be return not found book', async () => {
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.delete('12345678');
      expect(res.error).toBe('Not Found');
    });
    it('should be return successfully', async () => {
      const deleteSpy = jest.spyOn(service, 'delete');
      const res = await service.delete('8ETtoEC5FczG8X6FfomF');
      expect(deleteSpy).toBeCalled();
      expect(res.message).toEqual('Delete successfully');
    });
  });

  describe('get all book', () => {
    it('should be return all record', async () => {
      const getAllSpy = jest.spyOn(service, 'getAllBook');
      const res = await service.getAllBook({
        limit: 10,
        sorted: SortBy.ASC,
      });
      expect(res).toEqual(expect.arrayContaining(docData2));
    });
    it('should be return second record or more', async () => {
      const getAllSpy = jest.spyOn(service, 'getAllBook');
      const res = await service.getAllBook({
        limit: 1,
        startAfter: '1654676226522',
        sorted: SortBy.ASC,
      });
      expect(res).toEqual(expect.arrayContaining(docData3));
    });
  });

  describe('get list book by user id', () => {
    it('should be return error', async () => {
      const getAllSpy = jest.spyOn(service, 'getListBookByUserId');
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.getListBookByUserId('123456', {
        limit: 10,
        sorted: SortBy.ASC,
      });
      // console.log('123', res);
      expect(getAllSpy).toBeCalled();
      expect(res.statusCode).toBe(404);
    });
    it('should be return list book', async () => {
      const getAllSpy = jest.spyOn(service, 'getListBookByUserId');
      const res = await service.getListBookByUserId('11SHdFs0FLTC0rNmNLhb', {
        limit: 10,
        sorted: SortBy.ASC,
      });
      expect(res).toEqual(docData2);
    });
    it('should be return list book with startAfter', async () => {
      const getAllSpy = jest.spyOn(service, 'getListBookByUserId');
      const res = await service.getListBookByUserId('11SHdFs0FLTC0rNmNLhb', {
        limit: 1,
        startAfter: '1654676226522',
        sorted: SortBy.ASC,
      });
      expect(res).toEqual(expect.arrayContaining(docData3));
    });
  });
});
