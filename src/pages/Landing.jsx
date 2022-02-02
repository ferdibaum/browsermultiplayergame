import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewName } from "../components/NewName";
import { supabase } from "./../supabaseClient";
import { PageTemplate } from "./PageTemplate";

export function Landing() {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem("name"));

  if (!name) {
    return <NewName setName={setName} />;
  }

  return (
    <PageTemplate>
      <div
        className="p-3 text-white text-center bg-orange-600 rounded-lg cursor-pointer bg-opacity-80 min-w-[150px]"
        onClick={async () => {
          const owner = name + "#" + localStorage.getItem("rand");
          const { data } = await supabase.from("rooms").insert([
            {
              players: [owner],
              owner: owner,
            },
          ]);
          console.log(data);
          navigate(`/game/${data[0].id}`);
        }}
      >
        New Game
      </div>
    </PageTemplate>
  );
}
