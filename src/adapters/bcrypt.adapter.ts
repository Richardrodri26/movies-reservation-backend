import { IHashAdapter } from './hash.interface';
import * as bcrypt from 'bcrypt';

export class BcryptAdapter implements IHashAdapter {
  private readonly rounds = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.rounds);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}
