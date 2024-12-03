import type { User, UserChange } from "../types/User";

export const diffCheck = (
  oldArr: User[],
  newArr: User[],
  key: string = "id"
): UserChange[] => {
  const toAdd = newArr
    .filter((newItem) => {
      return !oldArr.some((oldItem) => oldItem.id === newItem.id);
    })
    .map((eleToAdd) => ({ ...eleToAdd, add: true, remove: false }));

  const toRemove = oldArr
    .filter((oldItem) => {
      return !newArr.some((newItem) => newItem.id === oldItem.id);
    })
    .map((eleToRemove) => ({ ...eleToRemove, add: false, remove: true }));

  const diffStatus = toAdd.concat(toRemove);

  return diffStatus;
};
