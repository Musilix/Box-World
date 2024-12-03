import kaplay, { GameObj, KAPLAYCtx, PosComp, SpriteComp, Vec2 } from "kaplay";
import { User } from "./types/User";
import GameStateEmitter from "./utils/EventBus";
import {
  clientSocket,
  clientUsers,
  sendUpdatedMovement,
  user,
} from "./utils/sockets";

let hasMoved = false;
const SPEED = 250;
const POLL_SPEED = 350;

let player;
let userGameObjects: Map<string, GameObj<PosComp | SpriteComp>> = new Map();

GameStateEmitter.on(
  "usersPositionsUpdated",
  (serverUsers: Map<string, User>) => {
    // Go through each server user that got updated and update their User record accordingly
    serverUsers.forEach((serverUser: User, socketId) => {
      // Dont update the current user this way
      if (socketId === clientSocket.id) {
        return;
      }

      const clientUser = clientUsers.get(socketId);

      if (!clientUser) {
        // Some reason a user is saved on the server, but not on the clients side
        // Add them in and thats it
        clientUsers.set(socketId, serverUser);
        return;
      }

      const { pos: serverPos } = serverUser;
      const { pos: clientPos } = clientUser;

      if (serverPos.x !== clientPos.x || serverPos.y !== clientPos.y) {
        clientUsers.set(socketId, { ...clientUser, pos: { ...serverPos } });
      }
    });

    /* After we've gone through the server-provided users, we can go ahead and draw
       what we have stored in our updated client side list of users */
    clientUsers.forEach((user, socketId) => {
      if (socketId === clientSocket.id) {
        return;
      }

      const userGameObject = userGameObjects.get(socketId);

      /* If the user in our lists of users on the client side does have a gameobject yet, then update its position */
      if (userGameObject) {
        // TODO - tween a 3d model to this pos
      } else {
        /* If the user in our lists of users on the client side doesnt have a gameobject yet, make one */
        // TODO - add 3d model or ID for it in our gameobject array
        // userGameObjects.set(
        //   socketId,
        //   {}
        // );
      }
    });
  }
);

GameStateEmitter.on("initializeUser", (user: User) => {
  // TODO - set player on coords given by server
  //player =
});
/* ========================================================================================== */

const movementPoll = setInterval(() => {
  if (hasMoved) {
    try {
      sendUpdatedMovement({
        ...player.pos,
      });

      hasMoved = false;
    } catch (e) {
      console.error(`Error communicating with server!`, e);
    }
  }
}, POLL_SPEED);

// k.onUpdate(() => {
//   // Set the viewport center to player.pos
//   k.camPos(player.pos);
// });
