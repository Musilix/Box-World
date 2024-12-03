export type User = {
  id: string;
  socketId: string;
  colorId: string;
  pos: UserPosition;
};

export type UserChange = {
  id: string;
  add: boolean;
  remove: boolean;
};

export type UserPositionChange = {
  id: string;
  pos: UserPosition;
};

export type UserPosition = {
  x: number;
  y: number;
};
