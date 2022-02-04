import { useContext, useState } from "react";
import { RoomContext } from "../contexts/roomContext";
import { getRandomQuestion } from "../utils/getRandomQuestion";
import {
  getNameFromLocalStorage,
  getUserFromLocalStorage,
} from "../utils/getUserNameFromLocalStorage";
import { updateGameState } from "../utils/updateGameState";
import { writeInChat } from "../utils/writeInChat";
import { supabase } from "./../supabaseClient";

export function Game() {
  const { room } = useContext(RoomContext);
  const [loading, setLoading] = useState(false);

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

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!input) return;
    setLoading(true);

    let msg = `${
      room.gameData.currentQuestion.question
    }\n${getNameFromLocalStorage()} hat ${input} geantwortet!\n`;
    let name = "Game Log";

    let newPoints = { ...room.gameData.points };

    if (
      input.toLowerCase() === room.gameData.currentQuestion.answer.toLowerCase()
    ) {
      if (newPoints.hasOwnProperty(getUserFromLocalStorage())) {
        newPoints[getUserFromLocalStorage()] += 1;
      } else newPoints[getUserFromLocalStorage()] = 1;
      msg = msg + "Die Antwort war Richtig.";

      updateGameState(
        {
          ...room.gameData,
          currentPlayer: getNextPlayer(),
          points: newPoints,
          currentQuestion: await getRandomQuestion(),
        },
        room
      );
    } else {
      msg =
        msg +
        `Die Antwort war falsch.\nDie richtige Antwort war: ${room.gameData.currentQuestion.answer}\nPlease Vote!`;

      updateGameState(
        {
          ...room.gameData,
          votingPhase: {
            inVoting: true,
            givenAnswer: input,
            votes: { richtig: [], falsch: [] },
          },
        },
        room
      );
    }
    setInput("");
    await supabase
      .from("rooms")
      .update({
        chat: room.chat
          ? [...room.chat, { msg: msg, name: name }]
          : [{ msg: msg, name: name }],
      })
      .match({ id: room.id });
    setLoading(false);
  };

  async function startGame() {
    if (loading) return;
    setLoading(true);

    await supabase
      .from("rooms")
      .update({
        gameData: {
          currentPlayer: room.owner,
          points: {},
          votingPhase: {
            inVoting: false,
            givenAnswer: "",
            votes: { richtig: [], falsch: [] },
          },
          currentQuestion: await getRandomQuestion(),
        },
        game_started: true,
      })
      .match({ id: room.id });
    setLoading(false);
  }

  async function vote(givenVote) {
    if (loading) return;
    setLoading(true);
    let newVotes = { ...room.gameData.votingPhase.votes };

    if (givenVote) {
      newVotes.richtig.push(getUserFromLocalStorage());
    } else {
      newVotes.falsch.push(getUserFromLocalStorage());
    }

    if (
      newVotes.falsch.length + newVotes.richtig.length >=
      room.players.length - 1
    ) {
      let msg = "Es wurde gevoted!\n";

      let newPoints = { ...room.gameData.points };

      if (newVotes.falsch.length <= newVotes.richtig.length) {
        if (newPoints.hasOwnProperty(room.gameData.currentPlayer)) {
          newPoints[room.gameData.currentPlayer] += 1;
        } else newPoints[room.gameData.currentPlayer] = 1;
        msg = msg + "Der Vote hat entschieden, dass die Antwort richtig war.";

        await updateGameState(
          {
            ...room.gameData,
            currentPlayer: getNextPlayer(),
            points: newPoints,
            votingPhase: {
              inVoting: false,
              givenAnswer: input,
              votes: { richtig: [], falsch: [] },
            },
            currentQuestion: await getRandomQuestion(),
          },
          room
        );
      } else {
        msg = msg + "Der Vote hat entschieden, dass die Antwort falsch war.";
        await updateGameState(
          {
            ...room.gameData,
            currentPlayer: getNextPlayer(),
            points: newPoints,
            votingPhase: {
              inVoting: false,
              givenAnswer: input,
              votes: { richtig: [], falsch: [] },
            },
            currentQuestion: await getRandomQuestion(),
          },
          room
        );
      }

      writeInChat(msg, room, "Game Log");
    } else {
      await updateGameState(
        {
          ...room.gameData,
          votingPhase: { ...room.gameData.votingPhase, votes: newVotes },
        },
        room
      );
    }
    setLoading(false);
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
          {room.gameData.currentPlayer === getUserFromLocalStorage()
            ? !room.gameData.votingPhase.inVoting && (
                <form className="flex flex-col" onSubmit={submitAnswer}>
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
              )
            : room.gameData.votingPhase.inVoting &&
              !room.gameData.votingPhase.votes.falsch.includes(
                getUserFromLocalStorage()
              ) &&
              !room.gameData.votingPhase.votes.richtig.includes(
                getUserFromLocalStorage()
              ) && (
                <div className="flex flex-col mt-3">
                  <p>Bitte Voten</p>
                  <p>
                    {`${room.gameData.currentPlayer.split("#")[0]} hat ${
                      room.gameData.votingPhase.givenAnswer
                    } geantwortet.`}
                  </p>
                  <p>
                    {`Die richtige antwort war: ${room.gameData.currentQuestion.answer}.`}
                  </p>
                  <div className="flex mt-3">
                    <div
                      onClick={() => {
                        vote(true);
                      }}
                      className="px-3 py-1 mr-3 bg-green-500 rounded-lg shadow-md cursor-pointer"
                    >
                      Die Antwort war richtig genug!
                    </div>
                    <div
                      onClick={() => {
                        vote(false);
                      }}
                      className="px-3 py-1 ml-3 bg-red-500 rounded-lg shadow-md cursor-pointer"
                    >
                      Die Antwort war falsch!
                    </div>
                  </div>
                </div>
              )}
        </div>
      )}
    </div>
  );
}
