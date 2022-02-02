import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chat } from "../components/Chat";
import { NewName } from "../components/NewName";
import { PlayerDisplay } from "../components/PlayerDisplay";
import { supabase } from "./../supabaseClient";
import { PageTemplate } from "./PageTemplate";

export function Game() {
  const [name, setName] = useState(localStorage.getItem("name"));
  const [room, setRoom] = useState(null);

  const { id } = useParams();

  function connect(id) {
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
  }

  useEffect(
    function () {
      console.log(room);
    },
    [room]
  );

  useEffect(
    function () {
      async function getDate() {
        const { data } = await supabase.from("rooms").select("*").eq("id", id);

        let playersInDatabase = data[0].players;

        if (
          playersInDatabase &&
          playersInDatabase.includes(name + "#" + localStorage.getItem("rand"))
        ) {
          setRoom(data[0]);
        } else {
          let newPlayers = playersInDatabase
            ? [
                ...playersInDatabase,
                name.replace("#", "") + "#" + localStorage.getItem("rand"),
              ]
            : [name + "#" + localStorage.getItem("rand")];

          const { data: newData } = await supabase
            .from("rooms")
            .update({ players: newPlayers })
            .match({ id: id });
          setRoom(newData[0]);
        }
      }
      if (name) {
        getDate();
      }
    },
    [name, id]
  );

  useEffect(
    function () {
      connect(id);
    },
    [id]
  );

  if (!name) {
    return <NewName setName={setName} />;
  }

  return (
    <PageTemplate>
      <div className="flex w-full p-3 grow">
        {room && <PlayerDisplay players={room.players} />}
        <div className="flex mx-3 border rounded-lg grow"></div>
        {room && <Chat chat={room.chat} name={name} id={room.id} />}
      </div>
    </PageTemplate>
  );
}
