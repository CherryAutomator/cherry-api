import { IHasher } from "../../application/interfaces/IHasher";
import bcrypt from 'bcrypt';

export class Bcrypt implements IHasher {
  async hash(value: string) {
    return bcrypt.hash(value, 10);
  }

  async equals(plainText: string, hash: string) {
    return bcrypt.compare(plainText, hash);
  }
}