import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewName } from "../components/NewName";
import {
  getNameFromLocalStorage,
  getUserFromLocalStorage,
} from "../utils/getUserNameFromLocalStorage";
import { supabase } from "./../supabaseClient";
import { PageTemplate } from "./PageTemplate";

export function Landing() {
  const navigate = useNavigate();
  const [name, setName] = useState(getNameFromLocalStorage());

  async function newGame() {
    const owner = getUserFromLocalStorage();
    const { data } = await supabase.from("rooms").insert([
      {
        players: [owner],
        owner: owner,
      },
    ]);
    navigate(`/game/${data[0].id}`);
  }

  if (!name) {
    return <NewName setName={setName} />;
  }

  return (
    <PageTemplate>
      <div
        className="p-3 text-white text-center bg-orange-600 rounded-lg cursor-pointer bg-opacity-80 min-w-[150px]"
        onClick={newGame}
      >
        New Game
      </div>
    </PageTemplate>
  );
}
