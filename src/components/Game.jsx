import { useContext } from "react";
import { RoomContext } from "../contexts/roomContext";
import { getUserFromLocalStorage } from "../utils/getUserNameFromLocalStorage";
import { supabase } from "./../supabaseClient";

export function Game() {
  const { room } = useContext(RoomContext);

  async function startGame() {
    await supabase
      .from("rooms")
      .update({
        gameData: {},
        game_started: true,
      })
      .match({ id: room.id });
  }

  return (
    <div className="flex items-center justify-center mx-3 border rounded-lg grow">
      {!room.game_started ? (
        room.owner === getUserFromLocalStorage() ? (
          <div
            className="p-3 text-white text-center bg-orange-600 rounded-lg cursor-pointer bg-opacity-80 min-w-[150px]"
            onClick={startGame}
          >
            Start Game
          </div>
        ) : (
          <div>Wait for owner to start game.</div>
        )
      ) : (
        <div> Game has Started</div>
      )}
    </div>
  );
}
