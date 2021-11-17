import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { io } from "socket.io-client";

// import Landing from "./Components/Landing/Landing";
// import Home from "./Components/Home/Home";
// import Join from "./Components/Home/Join";
// import Lobby from "./Components/Lobby/Lobby";
// import SelectOracle from "./Components/Lobby/SelectOracle";
// import PlayerLobby from "./Components/Lobby/PlayerLobby";
// import HostGame from "./Components/Game/HostGame";
// import PlayerGame from "./Components/Game/PlayerGame";
// import OracleGame from "./Components/Game/OracleGame";
// import Result from "./Components/Results/Result";
// import Score from "./Components/Results/Score";
// import Teams from "./Components/Teams/Teams";
// import TeamGame from "./Components/Teams/TeamGame";
import "./index.css";
import Play from "./Play";

function App() {

  const [socket, setSocket] = useState(null);
    useEffect(() => {
      const newSocket = io(`https://backendttgame.herokuapp.com/`);
      setSocket(newSocket);
      return () => newSocket.close();
    }, [setSocket]);

  return (
    <Play socket = {socket} />
  );
}

export default App;
