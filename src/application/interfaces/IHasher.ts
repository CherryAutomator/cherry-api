export interface IHasher {
  hash(value: string): Promise<string>;
  equals(plainText: string, hash: string): Promise<boolean>;
}