import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as firebase from 'firebase-admin';
import { Timestamp } from '@google-cloud/firestore';
import { Gender } from './gender.enum';
import { async } from 'rxjs';
import { SortBy } from '../common/pagination/pagination.dto';

const userId = '1ZqHyyz4snQlUtXogIN6';
const user = {
  userId: '1ZqHyyz4snQlUtXogIN6',
  gender: 'male',
  createdAt: 1655091727976,
  age: 18,
  phone: '09666666666',
  name: 'joy',
};
const docData = {
  userId: '1ZqHyyz4snQlUtXogIN6',
  gender: 'male',
  createdAt: 1655091727976,
  age: 18,
  phone: '09666666666',
  name: 'joy',
};
const docData2 = [
  {
    userId: 'IIkrMXI7D3aTXiTiySxB',
    name: 'alex',
    gender: 'male',
    phone: '0834578952',
    createdAt: 1655089947512,
    age: 4,
  },
  {
    userId: '1ZqHyyz4snQlUtXogIN6',
    gender: 'male',
    createdAt: 1655091727976,
    age: 18,
    phone: '09666666666',
    name: 'joy',
  },
  {
    userId: 'yIHMojobxubHIPRyUJ58',
    phone: '09666666668',
    name: 'lam',
    gender: 'female',
    createdAt: 1655091741674,
    age: 20,
  },
  {
    userId: 'nFF8xhqftsh4gLaInQlW',
    name: 'daniel',
    age: 22,
    phone: '0866843733',
    gender: 'male',
    createdAt: 1655091760469,
  },
];
const docData3 = [
  {
    userId: '1ZqHyyz4snQlUtXogIN6',
    phone: '09666666666',
    age: 18,
    name: 'joy',
    gender: 'male',
    createdAt: 1655091727976,
  },
];
const notFoundData = {
  message: 'Cannot find this user',
  statusCode: 401,
};

const docResult = {
  exists: true,
  docs: {
    map: () => docData2,
  },
  data: () => docData,
};
// const docResultStartAfter = {
//   exists: true,
//   docs: {
//     map: () => docData3,
//   },
//   data: () => docData,
//   forEach: jest.fn(),
// };
const notExistResult = {
  exists: false,
  docs: null,
  data: () => null,
  forEach: jest.fn(),
};
const mockedGet = {
  get: jest.fn(() => Promise.resolve(docResult)),
};
// const mockedGet2 = {
//   get: jest.fn(() => Promise.resolve(docResultStartAfter)),
// };
jest.mock('firebase-admin', () => {
  return {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            get: mockedGet.get,
            // get: jest.fn(() => ({
            //   docs: {
            //     map: jest.fn(() => docData2),
            //   },
            // })),
          })),
          startAfter: jest.fn(() => ({
            limit: jest.fn(() => ({
              // get: jest.fn(() => ({
              //   docs: mockedGet.get,
              // })),
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
// jest.mock('firebase-admin', () => {
//   return {
//     firestore: jest.fn(() => ({
//       collection: jest.fn(() => ({
//         orderBy: jest.fn(() => ({
//           limit: jest.fn(() => ({
//             get: mockedGet2.get,
//           })),
//           startAfter: jest.fn(() => ({
//             limit: jest.fn(() => ({
//               get: mockedGet2.get,
//             })),
//           })),
//         })),
//       })),
//     })),
//     credential: {
//       cert: jest.fn(),
//     },
//     initializeApp: jest.fn(),
//   };
// });
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find 1 user', () => {
    it('should return user', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne');

      const res = await service.findOne(userId);
      expect(findOneSpy).toBeCalled();
      expect(res).toEqual(docData);
    });
    it('should return not found', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne');
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.findOne('123456546');
      expect(res.error).toBe('Not Found');
    });
  });

  describe('create 1 user', () => {
    it('create user', async () => {
      const createSpy = jest.spyOn(service, 'create');
      const res = await service.create({
        name: 'tung',
        age: 23,
        gender: Gender.MALE,
        phone: '739835095',
      });
      expect(res).toHaveProperty('message', 'Create user successfully');
    });
    it('should return error if age < 0 ', async () => {
      const res = await service.create({
        name: 'tung',
        age: -1,
        gender: Gender.MALE,
        phone: '739835095',
      });
      expect(res).toHaveProperty('statusCode', 401);
    });
  });

  describe('delete 1 user', () => {
    it('should return error', async () => {
      const deleteSpy = jest.spyOn(service, 'deleteUser');
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.deleteUser('12324354678');
      expect(res).toHaveProperty('message', 'Cannot find this user');
    });
    it('should return delete successfully', async () => {
      const deleteSpy = jest.spyOn(service, 'deleteUser');
      const res = await service.deleteUser(userId);
      // expect(res).toHaveProperty('statusCode', 200);
      expect(res).toHaveProperty('message', 'Delete successfully');
    });
  });

  describe('update user', () => {
    it('should return error', async () => {
      const updateSpy = jest.spyOn(service, 'updateUser');
      mockedGet.get.mockResolvedValueOnce(notExistResult);
      const res = await service.updateUser('123456', {
        name: 'tung',
        age: -1,
        gender: Gender.MALE,
        phone: '739835095',
      });

      expect(res.error).toBe('Not Found');
    });
    it('should return new user', async () => {
      const updateSpy = jest.spyOn(service, 'updateUser');
      const res = await service.updateUser(userId, {
        name: 'tung',
        age: 23,
        gender: Gender.MALE,
        phone: '739835095',
      });
      expect(res).toHaveProperty('message', 'Updated successfully');
    });
  });

  describe('get all user with pagination', () => {
    it('should return all record', async () => {
      const getAllSpy = jest.spyOn(service, 'getAllUser');
      const res = await service.getAllUser({
        limit: 10,
        sorted: SortBy.ASC,
      });
      expect(res).toEqual(expect.arrayContaining(docData2));
    });
    it('should return second record', async () => {
      const getAllSpy = jest.spyOn(service, 'getAllUser');
      const res = await service.getAllUser({
        limit: 1,
        startAfter: '1655089947512',
        sorted: SortBy.ASC,
      });
      expect(res).toEqual(expect.arrayContaining(docData3));
    });
  });
});
