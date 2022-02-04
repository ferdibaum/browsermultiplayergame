import { supabase } from "../supabaseClient";

export async function updateGameState(data, room) {
  await supabase
    .from("rooms")
    .update({
      gameData: data,
    })
    .match({ id: room.id });
}
