import React, { useState, useEffect } from 'react'

import Landing from "./Components/Landing/Landing";
import Home from "./Components/Home/Home";
import Join from "./Components/Home/Join";
import Lobby from "./Components/Lobby/Lobby";
import SelectOracle from "./Components/Lobby/SelectOracle";
import PlayerLobby from "./Components/Lobby/PlayerLobby";
import HostGame from "./Components/Game/HostGame";
import PlayerGame from "./Components/Game/PlayerGame";
import OracleGame from "./Components/Game/OracleGame";
import Result from "./Components/Results/Result";
import Score from "./Components/Results/Score";

function Play({socket}) {
    
    const [component, changeComponent] = useState("/");
    const [time, setTime] = useState("");

    const moveGame = (type) =>{
        if(type === "host") changeComponent("home");
        else if(type === "join") changeComponent("join");
        else if(type === "lobby") changeComponent("lobby");
        else if(type === "playLobby") {
            let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
            if(gameOptions.game === "host")     changeComponent("selectOracle");
            else if(gameOptions.game === "play")    changeComponent("playerLobby");
        }
        else if(type === "startGame") {
            let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
            if(gameOptions.game === "host")     changeComponent("hostGame");
            else if(gameOptions.game === "play")    changeComponent("playerGame");
        }
        else if(type === "results") changeComponent("results");
        else if(type === "scores") changeComponent("scores");
    }

    useEffect(() => {
        if(socket !== null){
            socket.on("entered", ()=> {
                moveGame('playLobby');
            });
            socket.on("started", (oracle) => {
                let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
                gameOptions.oracle = oracle;
                window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
                setTime("");
                if(gameOptions.name === oracle) changeComponent("oracleGame");
                else moveGame('startGame');
            })
            socket.on("compiled", () => {
                setTime(0);
                moveGame("results");
            });
            socket.on("scores", () => {
                moveGame("scores");
            });
            socket.on("newRound", () => {
                let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
                if(gameOptions.game === "host"){
                    gameOptions.round = Number(gameOptions.round) + 1;
                    window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
                }
                moveGame('playLobby');
            });
            socket.on("endGame", () => {
                window.sessionStorage.removeItem("tt-game");
                window.location.reload(true);
            });
        }
    }, [socket]);

    switch (component){
        case "home" : return( <Home moveGame={moveGame} />);
        case "join" : return( <Join socket={socket} moveGame={moveGame}/>);
        case "lobby" : return( <Lobby socket={socket} />);
        case "selectOracle" : return( <SelectOracle socket={socket} />);
        case "playerLobby" : return( <PlayerLobby socket={socket} />);
        case "hostGame" : return( <HostGame socket={socket} time={time} setTime={setTime} />);
        case "oracleGame" : return( <OracleGame socket={socket} time={time} setTime={setTime} />);
        case "playerGame" : return( <PlayerGame socket={socket} time={time} setTime={setTime} />);
        case "results" : return( <Result socket={socket} />);
        case "scores" : return( <Score socket={socket} />);
        default : return( <Landing moveGame={moveGame} />);
    }
}

export default Play