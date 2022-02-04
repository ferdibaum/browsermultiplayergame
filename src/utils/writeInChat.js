import { supabase } from "../supabaseClient";

export async function writeInChat(msg, room, name) {
  await supabase
    .from("rooms")
    .update({
      chat: room.chat
        ? [...room.chat, { msg: msg, name: name }]
        : [{ msg: msg, name: name }],
    })
    .match({ id: room.id });
}
