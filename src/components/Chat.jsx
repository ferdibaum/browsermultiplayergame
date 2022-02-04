import { useEffect, useRef, useState } from "react";
import { getNameFromLocalStorage } from "../utils/getUserNameFromLocalStorage";
import { supabase } from "./../supabaseClient";

export function Chat({ chat, id }) {
  const ref = useRef();

  const [input, setInput] = useState("");

  const onFormSubmit = async (e) => {
    e.preventDefault();
    await supabase
      .from("rooms")
      .update({
        chat: chat
          ? [...chat, { msg: input, name: getNameFromLocalStorage() }]
          : [{ msg: input, name: getNameFromLocalStorage() }],
      })
      .match({ id: id });
    setInput("");
  };

  useEffect(
    function () {
      ref.current.scroll({ top: ref.current.scrollHeight, behavior: "smooth" });
    },
    [chat]
  );

  return (
    <div className="flex flex-col justify-between p-3 text-white border rounded-lg">
      <div className="text-lg font-bold">Chat</div>
      <div>
        <div ref={ref} className="overflow-y-hidden max-h-[50vh]">
          {chat &&
            chat.map((e, i) => (
              <div key={`e${i}`}>{`${e.name}: ${e.msg}`}</div>
            ))}
        </div>
        <form className="flex flex-col" onSubmit={onFormSubmit}>
          <input
            className="px-3 py-1 my-3 text-black bg-opacity-50 rounded-lg"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button
            type="submit"
            className="p-3 text-white bg-orange-600 rounded-lg cursor-pointer bg-opacity-80 min-w-[150px]"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
