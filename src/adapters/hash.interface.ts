export interface IHashAdapter {
  hash(value: string): Promise<string>;
  compare(value: string, hashed: string): Promise<boolean>;
}
