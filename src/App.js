import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomProvider } from "./contexts/roomContext";
import { GamePage } from "./pages/GamePage";
import { Landing } from "./pages/Landing";

export default function App() {
  return (
    <RoomProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="game/:id" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </RoomProvider>
  );
}
