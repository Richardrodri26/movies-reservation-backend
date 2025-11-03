import { Logger } from '@nestjs/common';
import { HttpException, InternalServerErrorException } from '@nestjs/common';

/**
 * TryCatch helper
 *
 * Usage:
 * const result = await TryCatch(() => service.doSomething(), {
 *   logger: new Logger('SomeService'),
 *   onError: (err) => console.error(err),
 * });
 *
 * It returns the resolved value of the passed function or throws an HttpException
 * (mapped by onError) or an InternalServerErrorException by default.
 */
export type TryCatchOptions<E = any> = {
  logger?: Logger;
  /**
   * Optional mapper to convert the caught error into another shape/value that will be
   * returned as the `error` slot. Return a value (or a Promise of a value) to replace
   * the original error.
   */
  onError?: (err: unknown) => E | void | Promise<E | void>;
};

export type TryCatchResult<T, E = any> = [T | null, E | null];

export async function tryCatch<T = any, E = any>(
  fn: () => Promise<T> | T,
  options: TryCatchOptions<E> = {},
): Promise<TryCatchResult<T, E | unknown>> {
  const { logger, onError } = options;
  try {
    const result = await Promise.resolve(fn());
    return [result as T, null];
  } catch (err) {
    if (logger) {
      logger.error((err as Error)?.message ?? 'Unknown error', (err as Error)?.stack);
    }

    if (onError) {
      const mapped = await Promise.resolve(onError(err));
      if (mapped !== undefined) {
        return [null, mapped as E];
      }
    }

    // Return the caught error to the caller to handle it there
    return [null, err as unknown];
  }
}
