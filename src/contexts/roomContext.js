import { createContext, useEffect, useState } from "react";

export const RoomContext = createContext({
  room: null,
});

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(0);
  useEffect(function () {}, [room]);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
}
