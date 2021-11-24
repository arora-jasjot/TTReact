import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { io } from "socket.io-client";

import "./index.css";
import Play from "./Play";

function App() {
  // document.addEventListener('contextmenu', (e) => {
  //   e.preventDefault();
  // });
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // const newSocket = io(`http://localhost:8888/`);
    const newSocket = io(`https://backendttgame.herokuapp.com/`);
    setSocket(newSocket);
    newSocket.on('connected', () => setConnected(true));

    return () => newSocket.close();
  }, [setSocket]);

  if (connected) {
    return (
      <Play socket={socket} />
    );
  }
  else{
    return (
      <> </>
    )
  }
}

export default App;
