import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../common/config/firebase.config';
import * as moment from 'moment';

import { BookDto } from './dto/book.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Injectable()
export class BooksService {
  async findOne(bookId: string) {
    try {
      const book = await db.collection('books').doc(`${bookId}`).get();
      if (!book.data()) {
        throw new NotFoundException(`Cannot find this book`);
      }
      return book.data();
    } catch (error) {
      return error.response;
    }
  }
  async create(bookDto: BookDto) {
    try {
      const { userId } = bookDto;
      const user = await db.collection('users').doc(`${userId}`).get();
      const userDoc = await user.data();
      if (!userDoc) {
        throw new NotFoundException(`Cannot find this user`);
      }
      const newBook = await db.collection('books').add({
        ...bookDto,
        userDoc,
        createdAt: +moment.utc().format('x'),
      });
      return {
        message: 'Create book successfully',
        bookId: newBook.id,
      };
    } catch (error) {
      return error.response;
    }
  }
  async update(bookId: string, bookDto: BookDto) {
    try {
      const book = await db.collection('books').doc(`${bookId}`).get();
      if (!book.exists) {
        throw new NotFoundException('Cannot find this book');
      }
      const { userId } = bookDto;
      if (userId) {
        const user = await db.collection('users').doc(`${userId}`).get();
        if (!user.exists) {
          throw new NotFoundException(`Cannot find this user`);
        }
      }
      const bookUpdate = await db
        .collection('books')
        .doc(`${bookId}`)
        .set(
          {
            ...bookDto,
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
  async delete(bookId: string) {
    try {
      const book = await db.collection('books').doc(`${bookId}`).get();
      if (!book.data()) {
        throw new NotFoundException(`Cannot find this book`);
      }
      await db.collection('books').doc(`${bookId}`).delete();
      return {
        message: 'Delete successfully',
      };
    } catch (error) {
      return error.response;
    }
  }
  async getAllBook(paginationDto: PaginationDto) {
    const { limit, startAfter, sorted } = paginationDto;
    // let userRef = db.collection('users').orderBy('createdAt', sorted);
    let bookRef;
    if (!startAfter) {
      bookRef = await db
        .collection('books')
        .orderBy('createdAt', sorted)
        .limit(+limit)
        .get();
    }
    if (startAfter) {
      bookRef = await db
        .collection('books')
        .orderBy('createdAt', sorted)
        .limit(+limit)
        .startAfter(+startAfter)
        .get();
    }
    const bookDocs = await bookRef.docs;
    return bookDocs.map((doc) => {
      return { bookId: doc.id, ...doc.data() };
    });
  }
  async getListBookByUserId(userId: string, paginationDto: PaginationDto) {
    try {
      console.log(userId);
      const { limit, startAfter, sorted } = paginationDto;
      const user = await db.collection('users').doc(`${userId}`).get();
      if (!user.exists) {
        throw new NotFoundException(`Cannot find this user`);
      }

      let bookRef = db.collection('books').orderBy('createdAt', sorted);

      if (!startAfter) {
        bookRef = bookRef.limit(+limit).where('userId', '==', userId);
      }

      if (startAfter) {
        bookRef = bookRef
          .limit(+limit)
          .where('userId', '==', userId)
          .startAfter(+startAfter);
      }
      const querySnapshot = await bookRef.get();
      const bookDocs = await querySnapshot.docs;

      // const books = [];
      const res = bookDocs.map((book) => {
        return { bookId: book.id, ...book.data() };
      });
      return res;
    } catch (error) {
      return error.response;
    }
  }
}
