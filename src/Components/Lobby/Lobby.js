import React, { useEffect, useState } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function Lobby({ socket }) {


    const [host, setHost] = useState(false);
    const [code, setCode] = useState(" ");
    const [players, addPlayer] = useState([]);

    useEffect(() => {
        let gameOptions = window.sessionStorage.getItem("tt-game");
        gameOptions = JSON.parse(gameOptions);
        if (gameOptions.game === "host") {
            setHost(true);
            const codeListener = (gameData) => {
                setCode(Number(gameData.code));
                socket.emit("join", Number(gameData.code));
            }
            socket.emit("hostGame", gameOptions);
            socket.on("gameCode", codeListener);

        }
        if (gameOptions.game === "play") {
            setCode(Number(gameOptions.code));
            socket.emit("join", Number(gameOptions.code));
            socket.emit("getGameData");
            socket.on("playerGameData", (gameData) => {
                gameOptions.time = gameData.time;
                window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
                addPlayer(gameData.players);
                socket.emit("newPlayer", gameOptions.name);
            })

        }
    }, [socket]);

    useEffect(() => {
        let gameOptions = window.sessionStorage.getItem("tt-game");
        gameOptions = JSON.parse(gameOptions);
        if (gameOptions.game === "host") {
            socket.on("newPlayer", (newPlayer) => {
                let x = [...players];
                x.push(newPlayer);
                addPlayer(x);
            });
        }
        if (gameOptions.game === "play") {
            socket.on("newPlayer", (newPlayer) => {
                if (newPlayer !== gameOptions.name) {
                    let x = [...players];
                    x.push(newPlayer);
                    addPlayer(x);
                }
            });
        }
    }, [socket, players])

    useEffect(() => {
        let componentMounted = true;
        let gameOptions = window.sessionStorage.getItem("tt-game");
        gameOptions = JSON.parse(gameOptions);
        if(componentMounted && gameOptions.game === 'host'){
            socket.on('disconnected', (name) => {
                let x = [...players];
                const index = x.indexOf(name);
                x.splice(index, 1);
                addPlayer(x);
            })
        }

        return () => componentMounted = false;
    })

    const enterGame = () => {
        let gameOptions = window.sessionStorage.getItem("tt-game");
        gameOptions = JSON.parse(gameOptions);
        gameOptions.players = players;
        window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
        socket.emit("entered");
    }



    return (
        <div className="bg container-fluid lobby">
            <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3 px-5">
                <img src={navImg} alt="" />
                <img src={headImg} alt="" />
            </nav>
            <div className="game-code container mb-3 bg-light rounded col-12 col-md-4 offset-md-4 p-3">
                <div className="fs-4 d-block">Login to <span className="text-decoration-underline">ttgame.netlify.app</span> and use</div>
                <div className="d-flex justify-content-evenly align-items-center mt-2"><div className="fs-4">Game Code</div><div className="code fs-1 d-inline fw-bold">{code}</div></div>
            </div>


            <div className="container col-12 col-md-8 offset-md-2 bg-light rounded p-2">
                <div className="ptext fs-2 fw-bold col-12 pb-2">Explorers</div>
                <div className="player-div">
                    {players.map((player, index) =>
                        <div className="player d-flex justify-content-center align-items-center rounded p-auto m-1" key={index}>
                            <div className="icon rounded-circle fs-3">{player.charAt(0)}</div>
                            <div className="name d-flex justify-content-center align-items-center rounded border-dark border-2 border p-1 ps-4 pe-3">{player}</div>
                        </div>
                    )}

                </div>

            </div>
            {host && <div className="text-center p-3"><button className="btn btn-lg btn-outline-warning start-btn" onClick={() => enterGame()}>Choose Oracle</button></div>}



        </div>
    );
}

export default Lobby;
