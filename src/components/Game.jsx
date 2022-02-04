import { useContext, useState } from "react";
import { RoomContext } from "../contexts/roomContext";
import { getRandomQuestion } from "../utils/getRandomQuestion";
import {
  getNameFromLocalStorage,
  getUserFromLocalStorage,
} from "../utils/getUserNameFromLocalStorage";
import { updateGameState } from "../utils/updateGameState";
import { supabase } from "./../supabaseClient";

export function Game() {
  const { room } = useContext(RoomContext);

  const [input, setInput] = useState("");

  function getNextPlayer() {
    if (
      room.players.indexOf(room.gameData.currentPlayer) + 1 <
      room.players.length
    ) {
      return room.players[
        room.players.indexOf(room.gameData.currentPlayer) + 1
      ];
    } else return room.players[0];
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();

    let msg = `${
      room.gameData.currentQuestion.question
    }\n${getNameFromLocalStorage()} hat ${input} geantwortet!\n`;
    let name = "Game Log";

    let newPoints = { ...room.gameData.points };

    if (input === room.gameData.currentQuestion.answer) {
      if (newPoints.hasOwnProperty(getUserFromLocalStorage())) {
        newPoints[getUserFromLocalStorage()] += 1;
      } else newPoints[getUserFromLocalStorage()] = 1;
      msg = msg + "Die Antwort war Richtig.";
    } else {
      msg =
        msg +
        `Die Antwort war falsch. Kein Punkt!!\nDie richtige Antwort war: ${room.gameData.currentQuestion.answer}`;
    }

    await supabase
      .from("rooms")
      .update({
        chat: room.chat
          ? [...room.chat, { msg: msg, name: name }]
          : [{ msg: msg, name: name }],
      })
      .match({ id: room.id });

    setInput("");

    updateGameState(
      {
        currentPlayer: getNextPlayer(),
        points: newPoints,
        currentQuestion: await getRandomQuestion(),
      },
      room
    );
  };

  async function startGame() {
    await supabase
      .from("rooms")
      .update({
        gameData: {
          currentPlayer: room.owner,
          points: {},
          currentQuestion: await getRandomQuestion(),
        },
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
        <div>
          <div> Currentplayer: </div>
          <div className="mb-3">
            {" "}
            {room.gameData.currentPlayer.split("#")[0]}
          </div>
          <div> Next PLayer: </div>
          <div className="mb-3"> {getNextPlayer().split("#")[0]}</div>
          <div> Current Question: </div>
          <div className="mb-3"> {room.gameData.currentQuestion.question}</div>

          {/* <div> Current Answer: </div>
          <div className="mb-3"> {room.gameData.currentQuestion.answer}</div>*/}

          <div> Current Points: </div>
          {room.players.map((player, i) => (
            <div key={i}>
              {player.split("#")[0]}
              {": "}
              {room.gameData.points[player] ? room.gameData.points[player] : 0}
            </div>
          ))}
          {room.gameData.currentPlayer === getUserFromLocalStorage() && (
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
          )}
        </div>
      )}
    </div>
  );
}
