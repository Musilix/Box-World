import type { User, UserChange } from "../types/User";

export const diffCheck = (oldArr: string[], newArr: string[]): UserChange[] => {
  const toAdd = newArr
    .filter((newItem: string) => {
      return !oldArr.some((oldItem) => oldItem === newItem);
    })
    .map((eleToAdd) => ({ id: eleToAdd, add: true, remove: false }));

  const toRemove = oldArr
    .filter((oldItem: string) => {
      return !newArr.some((newItem) => newItem === oldItem);
    })
    .map((eleToRemove) => ({ id: eleToRemove, add: false, remove: true }));

  const diffStatus = toAdd.concat(toRemove);

  return diffStatus;
};
