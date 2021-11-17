import React, { useEffect, useState } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function PlayerLobby({socket}) {

  const [name, setName] = useState("");
  const [oracle, setOracle] = useState("");
  const [message, setMsg] = useState("Joined Successfully");
  if(oracle === ""){
    socket.emit("getOracleData");
  }
  useEffect(() => {
    let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
    setName(gameOptions.name);
    socket.on("oracle", (neworacle) => {
      setOracle(neworacle);
      if(neworacle === gameOptions.name){
        setMsg("Congratulations, You are selected as Oracle.")
      }
      else{
        setMsg("Joined Successfully")
      }
    })
  }, [socket]);

  return (
    <div className="bg playerLobby">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3 px-5">
            <img src={navImg} alt="" />
        </nav>
        <div className="tt-logo">
            <img src={headImg} alt="" />
        </div>
        <div className="player-name">Hi <span id="name">{name}</span></div>
        <h2 id="message">{message}</h2>
        <h1>Waiting for Host to Start the Game !</h1>
    </div>
  );
}

export default PlayerLobby;
