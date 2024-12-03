import { io, Socket } from "socket.io-client";
import type { User, UserChange, UserPosition } from "../types/User";
import { diffCheck } from "./diffCheck";
import GameStateEmitter from "./EventBus";

let newMessage: string = "";
let chatRoomMessages: string[] = [];
let socket: Socket = io("http://localhost:8000/");

let user: User;
let clientUsers: Map<string, User> = new Map();

/* Connection Event Handlers */
socket.on("connect", function () {
  console.log("Connected");
});

socket.on("exception", function (data) {
  console.log("event", data);
});

socket.on("disconnect", function () {
  console.log("Disconnected");
});

/* Domain Specific Event Handlers */
socket.on("newMessage", (data) => {
  chatRoomMessages.push(data);
});

socket.on("intializeUser", (data) => {
  // TODO - Take session ID for user and store in cook?
  user = data;
  GameStateEmitter.emit("initializeUser", user);
});

/* Handle Users joining or leaving game */
socket.on("updateUsersPresence", (data: [string, User][]) => {
  const serverUsers = new Map<string, User>(data);
  const serverUserIds = [...serverUsers.keys()];
  const clientUserIds = [...clientUsers.keys()];
  const arrayDiff = diffCheck(clientUserIds, serverUserIds);

  /* 
    Go through differences (should usually just be 1 diff - either a user is removed or added)
    Prune entries from the clientUsers list that are no longer in the serverUsers list
    Add new entries from the serverUsers to our clientUsers list
  */
  arrayDiff.forEach((change: UserChange) => {
    if (change.add) {
      const toAdd = serverUsers.get(change.id);
      if (toAdd && change.id !== socket.id) {
        clientUsers.set(change.id, toAdd);
      }
    } else if (change.remove) {
      const toRemove = serverUsers.get(change.id);
      if (toRemove) {
        clientUsers.delete(change.id);
      }
    }
  });
});

/* Handle Users moving in the world */
/* We want to restrict this to only iterate + update positions for Users in the current User's chunk */
socket.on("updateUsersPosition", (data: [string, User][]) => {
  const serverUsers = new Map<string, User>(data);
  GameStateEmitter.emit("usersPositionsUpdated", serverUsers);
});

const sendUpdatedMovement = ({ x, y }) => {
  if (
    x === null ||
    y === null ||
    x === undefined ||
    y === undefined ||
    Number.isNaN(x) ||
    Number.isNaN(y)
  ) {
    // throw Error("Your moving outside our realm of existence.");
    console.log(`Something weird is happening: (x: ${x}, y: ${y})`);
  }

  //call backend
  try {
    console.log("trying to emit...");
    socket.emit("updateUserPos", { x, y });
  } catch (e) {
    console.error(`There was an issue sending your message: ${e}`);
  }
};

export { socket as clientSocket, clientUsers, sendUpdatedMovement, user };
