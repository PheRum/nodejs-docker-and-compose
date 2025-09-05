import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  SomethingWrong = 99,
  LoginOrPasswordIncorrect = 100,
  UserAlreadyExists,
  UserNotFound = 102,
  WishNotFound = 203,
  WishCanEditOwn = 204,
  WishCanNotEditWithOffers = 205,
  WishCanNotDelete = 206,
  OfferNotFound = 306,
  OfferAmount = 307,
  OfferCanNotOwnEdit = 308,
  WishlistNotFound = 407,
  WishlistCanNotEdit = 408,
  WishlistCanNotDelete = 409,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.SomethingWrong, 'Something is wrong... Try it later.'],
  // user
  [ErrorCode.LoginOrPasswordIncorrect, 'Login or password is incorrect'],
  [
    ErrorCode.UserAlreadyExists,
    'User with current email or username already exists',
  ],
  [ErrorCode.UserNotFound, 'User not found'],
  // wish
  [ErrorCode.WishNotFound, 'Wish not found'],
  [ErrorCode.WishCanEditOwn, 'You can edit only your wish'],
  [ErrorCode.WishCanNotEditWithOffers, 'You can edit wish without offers only'],
  [ErrorCode.WishCanNotDelete, 'You can delete only your wish'],
  // offer
  [ErrorCode.OfferNotFound, 'Offer not found'],
  [ErrorCode.OfferCanNotOwnEdit, 'You can not send offer on you own wish'],
  [
    ErrorCode.OfferAmount,
    'You cant create offer, because amount higher then price',
  ],
  // wishlist
  [ErrorCode.WishlistNotFound, 'Wishlist not found'],
  [ErrorCode.WishlistCanNotEdit, 'You can edit only your wishlist'],
  [ErrorCode.WishlistCanNotDelete, 'You can delete only your wishlist'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.SomethingWrong, HttpStatus.INTERNAL_SERVER_ERROR],
  [ErrorCode.LoginOrPasswordIncorrect, HttpStatus.BAD_REQUEST],
  [ErrorCode.UserAlreadyExists, HttpStatus.BAD_REQUEST],
  [ErrorCode.UserNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishCanEditOwn, HttpStatus.FORBIDDEN],
  [ErrorCode.WishCanNotEditWithOffers, HttpStatus.FORBIDDEN],
  [ErrorCode.WishCanNotDelete, HttpStatus.FORBIDDEN],
  [ErrorCode.OfferNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.OfferAmount, HttpStatus.BAD_REQUEST],
  [ErrorCode.OfferCanNotOwnEdit, HttpStatus.BAD_REQUEST],
  [ErrorCode.WishlistNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishlistCanNotEdit, HttpStatus.FORBIDDEN],
  [ErrorCode.WishlistCanNotDelete, HttpStatus.FORBIDDEN],
]);
