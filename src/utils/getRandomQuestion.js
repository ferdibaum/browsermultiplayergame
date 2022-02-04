import { supabase } from "../supabaseClient";
import { getRandomInt } from "./getRandomInt";

export async function getRandomQuestion() {
  const { data } = await supabase
    .from("questions")
    .select("*")
    .match({ id: getRandomInt(6, 3900) });

  return data[0];
}
