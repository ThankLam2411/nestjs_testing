import { CollectionReference } from '@google-cloud/firestore';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { db } from '../common/config/firebase.config';
import { CreateUserDto } from './dto/create-users.dto';
import { GetUserDto } from './dto/get-user.dto';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  async findOne(id: string) {
    try {
      const user = await db.collection('users').doc(`${id}`).get();
      if (!user.data()) {
        throw new NotFoundException(`Cannot find this user`);
      }
      return user.data();
    } catch (error) {
      return error.response;
    }
  }
  async create(createUserDto: CreateUserDto) {
    const { age } = createUserDto;
    if (age < 0 || age % 1 != 0) {
      return {
        message: 'Please check input',
        statusCode: 401,
      };
    }
    const currentDate = new Date();
    const newUserDoc = await db
      .collection('users')
      .add({ ...createUserDto, createdAt: +moment.utc().format('x') });
    return {
      message: 'Create user successfully',
      userId: newUserDoc.id,
    };
  }
  async updateUser(userId: string, createUserDto: CreateUserDto) {
    try {
      const checkUser = await db.collection('users').doc(`${userId}`).get();

      if (!checkUser.data()) {
        throw new NotFoundException(`Cannot find this user`);
      }
      const userUpdate = await db
        .collection('users')
        .doc(`${userId}`)
        .set(
          {
            ...createUserDto,
          },
          {
            merge: true,
          },
        );
      return {
        message: 'Updated successfully',
      };
    } catch (error) {
      return error.response;
    }
  }
  async getAllUser(paginationDto: PaginationDto) {
    const { limit, startAfter, sorted } = paginationDto;
    let userRef = db.collection('users').orderBy('createdAt', sorted);
    if (startAfter) {
      userRef = userRef.startAfter(+startAfter).limit(+limit);
    }

    if (!startAfter) {
      userRef = userRef.limit(+limit);
    }

    const querySnapshot = await userRef.get();

    const userDocs = await querySnapshot.docs;
    const res = userDocs.map((doc) => {
      return { userId: doc.id, ...doc.data() };
    });
    return res;
  }
  async deleteUser(userId: string) {
    const user = await db.collection('users').doc(`${userId}`);
    const userFind = await user.get();

    if (!userFind.data()) {
      return {
        message: 'Cannot find this user',
        statusCode: 401,
      };
    }
    const userDelete = await user.delete();
    return {
      message: 'Delete successfully',
      statusCode: 200,
    };
  }
}
