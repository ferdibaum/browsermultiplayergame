import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chat } from "../components/Chat";
import { Game } from "../components/Game";
import { NewName } from "../components/NewName";
import { PlayerDisplay } from "../components/PlayerDisplay";
import { RoomContext } from "../contexts/roomContext";
import { supabase } from "../supabaseClient";
import {
  getNameFromLocalStorage,
  getUserFromLocalStorage,
} from "../utils/getUserNameFromLocalStorage";
import { PageTemplate } from "./PageTemplate";

export function GamePage() {
  const { room, setRoom } = useContext(RoomContext);

  const { id } = useParams();

  const connect = useCallback(
    function (id) {
      supabase
        .from("rooms:id=eq." + id)
        .on("UPDATE", (payload) => {
          async function updateRoom() {
            const { data } = await supabase
              .from("rooms")
              .select("*")
              .match({ id: id });

            setRoom(data[0]);
          }
          updateRoom();
        })
        .subscribe();
    },
    [setRoom]
  );

  useEffect(
    function () {
      console.log(room);
    },
    [room]
  );

  useEffect(
    function () {
      async function join() {
        const { data } = await supabase.from("rooms").select("*").eq("id", id);

        let playersInDatabase = data[0].players;

        if (
          playersInDatabase &&
          playersInDatabase.includes(getUserFromLocalStorage())
        ) {
          setRoom(data[0]);
        } else {
          let newPlayers = playersInDatabase
            ? [...playersInDatabase, getUserFromLocalStorage()]
            : [getUserFromLocalStorage()];

          const { data: newData } = await supabase
            .from("rooms")
            .update({ players: newPlayers })
            .match({ id: id });
          setRoom(newData[0]);
        }
      }
      if (getNameFromLocalStorage()) {
        join();
      }
    },
    [id, setRoom]
  );

  useEffect(
    function () {
      connect(id);
    },
    [id, connect]
  );

  const [name, setName] = useState(getNameFromLocalStorage());
  if (!name) {
    return <NewName setName={setName} />;
  }

  return (
    <PageTemplate>
      {room && (
        <div className="flex w-full p-3 grow">
          <PlayerDisplay players={room.players} />
          <Game />
          <Chat chat={room.chat} id={room.id} />
        </div>
      )}
    </PageTemplate>
  );
}
