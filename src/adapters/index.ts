import { BcryptAdapter } from './bcrypt.adapter';
import type { IHashAdapter } from './hash.interface';

export const HASH_ADAPTER = 'HASH_ADAPTER';

export type { IHashAdapter };
export { BcryptAdapter };
