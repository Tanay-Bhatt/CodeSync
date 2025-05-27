import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Room from "./pages/Room"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
}

export default App;
