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
    const [round, setRound] = useState(1);

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
        else if(type === "orGame") changeComponent("oracleGame");
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
                const time = gameOptions.time;
                let date = new Date();
                date = new Date(date.getTime() + time*60000);
                date = date.getTime();
                socket.emit("setTimer", date);
                socket.on("setTimer", date =>{
                    gameOptions.targetTimer = date;
                    window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
                    if(gameOptions.name === oracle) changeComponent("oracleGame");
                    else moveGame('startGame');
                })
            })
            socket.on("compiled", () => {
                moveGame("results");
            });
            socket.on("scores", () => {
                moveGame("scores");
            });
            socket.on("newRound", () => {
                let xxx = round;
                xxx = xxx + 1;
                setRound(xxx);
                let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
                if(gameOptions.game === "host"){
                    gameOptions.round = xxx;
                    window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
                }
                moveGame('playLobby');
            });
            socket.on("endGame", () => {
                window.sessionStorage.removeItem("tt-game");
                window.location.reload(true);
            });
            socket.on('disconnected', (name) => {
                let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
                if(gameOptions.game === "host" && gameOptions.players.length !== 0){
                    let x = gameOptions.players;
                    const index = x.indexOf(name);
                    x.splice(index, 1);
                    gameOptions.players = x;
                    window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
                }
            })

            socket.on("rejoined", (name) => {
                let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
                if(gameOptions.game === "host"){
                    let x = gameOptions.players;
                    if(x.includes(name) === false){
                        x.push(name);
                        gameOptions.players = x;
                        window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
                    }
                }
            })
        }
    }, [socket, round]);

    switch (component){
        case "home" : return( <Home moveGame={moveGame} />);
        case "join" : return( <Join socket={socket} moveGame={moveGame}/>);
        case "lobby" : return( <Lobby socket={socket} />);
        case "selectOracle" : return( <SelectOracle socket={socket} />);
        case "playerLobby" : return( <PlayerLobby socket={socket} />);
        case "hostGame" : return( <HostGame socket={socket} round={round}/>);
        case "oracleGame" : return( <OracleGame socket={socket} />);
        case "playerGame" : return( <PlayerGame socket={socket} />);
        case "results" : return( <Result socket={socket} />);
        case "scores" : return( <Score socket={socket} />);
        default : return( <Landing moveGame={moveGame} socket={socket} />);
    }
}

export default Play