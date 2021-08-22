export const updateItem = <T>(
  arr: T[],
  predicate: (item: T) => boolean,
  object: Partial<T>,
) => {
  const item = arr.find(predicate);

  if (!item) {
    return;
  }

  Object.assign(item, object);
};
