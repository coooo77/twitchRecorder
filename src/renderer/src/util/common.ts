/** @see https://tinyurl.com/2p8c8xms */
export function includes<T, U extends T>(
  arr: readonly U[],
  elem: T
): elem is U {
  return arr.includes(elem as any)
}
