export const upsertItem = <T>(
  arr: T[],
  predicate: (item: T) => boolean,
  object: Partial<T>,
) => {
  const item = arr.find(predicate);

  if (item) {
    Object.assign(item, object);

    return;
  }

  arr.push(object as T);
};
