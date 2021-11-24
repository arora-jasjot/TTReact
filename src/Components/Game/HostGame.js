
import React, { useEffect, useState } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function HostGame({ socket, round }) {

    const [time, setTime] = useState("");
    const [mode, setMode] = useState("indi");
    const [gameData, setData] = useState(null);
    const [players, setPlayers] = useState([]);
    const [words, setWords] = useState([]);
    const [clues, setClues] = useState({ clue1: "", clue2: "" });


    useEffect(() => {
        let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
        setData(gameOptions);
        return () => setData(null);
    }, []);

    useEffect(() => {
        if (gameData !== null) {
            setPlayers(gameData.players);
            setMode(gameData.mode);
            let newDate = new Date();
            newDate = newDate.getTime();
            let endDate = gameData.targetTimer;
            let seconds = (endDate - newDate) / 1000;
            seconds = Math.floor(seconds);
            setTime(seconds);
        }
    }, [gameData]);

    useEffect(() => {
        if (time > 0) {
            setTimeout(() => setTime(time - 1), 1000);
        }
    }, [time]);

    useEffect(() => {
        if (words.length === 0) {
            socket.emit("newWord");
        }

        socket.on("newWord", (oracleWords) => {
            setWords(oracleWords.words)
        });
        socket.on("clues", (clues) => {
            setClues(clues);
        })
        socket.on("answered", (name) => {
            let x = [...players];
            const index = x.indexOf(name);
            x.splice(index, 1);
            setPlayers(x);
        })
    }, [socket, players, words.length])

    useEffect(() => {
        let componentMounted = true;
        if (componentMounted) {
            socket.on('disconnected', (name) => {
                let x = [...players];
                const index = x.indexOf(name);
                x.splice(index, 1);
                setPlayers(x);
            })
            socket.on('gameProgress', () => {
                socket.emit("gameProgress", "game");
            });

        }

        return () => componentMounted = false;
    })

    const getResult = () => {
        socket.emit("compile", (gameData.round));
    }
    const newRound = () => {
        socket.emit("newRound");
    }

    return (
        <div className="bg hostGame">
            <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
                <img src={navImg} alt="" />
                <img src={headImg} alt="" />
            </nav>
            <div className="round-info">
                <p>To start game/ skip round, click on new round button.</p>
                Round #<span id="rno">{round}</span> <button className="next-round btn btn-info" onClick={() => newRound()}>New Round <i className="bi bi-arrow-bar-right"></i></button>
            </div>
            <div className="game-display">

                <div className="phrases py-2">
                    {words.map((word, index) =>
                        <div className="word" key={index}>
                            <span>{word}</span>
                            <div className="num">{index + 1}</div>
                        </div>
                    )}
                </div>
                <div className="awaited bg-secondary">
                    <h6>Answers Awaited</h6>
                    <h1>{players.length - 1}</h1>
                    <ul id="players">
                        {players.map((player, index) => (player !== gameData.oracle) && <li key={index}>{player}</li>)}
                    </ul>
                </div>
            </div>
            <div className="oracle-info p-2 rounded mb-3">
                <div className="name">Oracle : <span>{gameData !== null && gameData.oracle}</span></div>
                <div className="clues">Oracle's Clue : <span id="c1">{clues.clue1}</span> <span id="c2">{clues.clue1}</span></div>
            </div>
            <div className="container mt-2">
                {mode === 'team' && <div className="btn btn-outline-warning">Team Mode</div>}
                <button id="results" className="btn btn btn-warning px-3" onClick={() => getResult()}>Results <i className="bi bi-arrow-right-circle p-1"></i></button>
            </div>
            <div id="timer"><span id="sec">{time}</span> seconds left.</div>
        </div>
    );
}

export default HostGame;
