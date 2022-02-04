import { supabase } from "../supabaseClient";
import { getRandomInt } from "./getRandomInt";

export async function getRandomQuestion() {
  let question = null;
  const { data } = await supabase
    .from("questions")
    .select("*")
    .match({ id: getRandomInt(1, 3930) });
  question = data[0];
  console.log(question);
  while (!question || !question.question || !question.answer) {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .match({ id: getRandomInt(1, 3930) });
    question = data[0];
    console.log(question);
  }

  return question;
}
