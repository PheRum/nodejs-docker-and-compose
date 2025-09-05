import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, code2message, code2status } from './error-codes';

export class ServerException extends HttpException {
  public code: ErrorCode;

  constructor(code: ErrorCode) {
    super(
      code2message.get(code) || 'Error occurred, please try again later',
      code2status.get(code) || HttpStatus.INTERNAL_SERVER_ERROR,
    );

    this.code = code;
  }
}
