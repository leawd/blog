import { Injectable } from '@nestjs/common';

// VALIDADOR DE EMAIL -----
@Injectable()
export class EmailValidationService {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
