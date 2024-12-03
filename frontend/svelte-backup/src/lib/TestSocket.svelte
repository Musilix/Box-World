<script lang="ts">
  import { diffArrays, type ArrayChange } from "diff";
  import { io, Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import type { User, UserChange } from "../types/User";
  import { diffCheck } from "../utils/diffCheck";
  import ChatRoomMessage from "./ChatRoomMessage.svelte";

  let newMessage: string = "";
  let chatRoomMessages: string[] = $state([]);
  let socket: Socket = io("http://localhost:3000/");

  let userID: string = $state("");
  let clientUsers: User[] = $state([]);

  /* Move this to utils or lib folder*/
  /* Cookie Logic */
  // let sessionCook: Object;
  // const setCookie = () => {
  //   const expires = new Date(
  //     Date.now() + 30 * 24 * 60 * 60 * 1000
  //   ).toUTCString();
  // };

  /* Connection Event Handlers */
  socket.on("connect", function () {
    console.log("Connected");

    // socket.emit("events", { test: "test" });
    // socket.emit("identity", 0, (response) =>
    //   console.log("Identity:", response)
    // );
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

  socket.on("assignId", (data) => {
    //Take session ID for user and store in cook

    userID = data;
  });

  socket.on("updateUsers", (data) => {
    const serverUsers: User[] = data;
    const arrayDiff = diffCheck(clientUsers, serverUsers);

    // Prune entries from the clientUsers list that are no longer in the serverUsers list
    // Add new entries from the serverUsers to our clientUsers list
    arrayDiff.forEach((change: UserChange) => {
      if (change.add) {
        clientUsers.push({
          id: change.id,
          socketId: change.socketId,
          colorId: change.colorId,
        });
      } else if (change.remove) {
        const usrToRemoveIdx = clientUsers.findIndex(
          (user) => user.id === change.id
        );

        if (usrToRemoveIdx !== -1) {
          clientUsers.splice(usrToRemoveIdx, 1);
        }
      }
    });
  });

  onMount(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  });

  const sendTestData = () => {
    // check message first
    if (!newMessage || newMessage === undefined) {
      throw Error("Your message violates are terms.");
    }

    //call backend
    try {
      socket.emit("sendMessage", newMessage);
    } catch (e) {
      console.error(`There was an issue sending your message: ${e}`);
    }
  };
</script>

<div id="socket-wrap">
  <div id="messages">
    {#each chatRoomMessages as message}
      <ChatRoomMessage body={message} />
    {/each}
  </div>

  <div id="room-users">
    {#each clientUsers as user}
      <div class="userBubble" style={`background-color: ${user.colorId}`}></div>
    {/each}
  </div>

  <div id="input-wrap">
    <input placeholder="What would you like to say?" bind:value={newMessage} />
    <button onclick={sendTestData}>send</button>
  </div>
</div>

<style>
  #socket-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
  }

  #socket-wrap > * {
    padding: 5px;
    margin: 15px;
  }

  #messages {
    border-radius: 15px;
    box-shadow: 0px 0.5px 20px -5px gray;

    max-height: 500px;
    min-height: 500px;
    height: 100%;

    width: 75%;
    max-width: 500px;

    background-color: beige;
  }

  #room-users {
    display: flex;
    flex-direction: row;

    flex-wrap: wrap;
    justify-content: center;
  }

  .userBubble {
    border-radius: 999px;
    height: 20px;
    width: 20px;

    border: 3px solid black;

    margin: 5px;
  }
</style>
