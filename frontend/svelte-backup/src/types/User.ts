export type User = {
  id: string;
  socketId: string;
  colorId: string;
};

export type UserChange = User & {
  add: boolean;
  remove: boolean;
};
