
import React, { useEffect, useState } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function HostGame({socket, time, setTime}) {

    const [gameData, setData] = useState({});
    const [players, setPlayers] = useState([]);
    const [words, setWords] = useState([]);
    const [clues, setClues] = useState({clue1 : "", clue2 : ""});
    
    useEffect(() => {
        if(time === ""){
            let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
            setTime(gameOptions.time * 60);
            setPlayers(gameOptions.players);
            setData(gameOptions);
            socket.emit("newWord");
        }
        else{
            if (time > 0) {
                setTimeout(() => setTime(time - 1), 1000);
            }
        }
    }, [time, setTime, socket]);
    
    useEffect(() => {
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
    }, [socket, players])

    const getResult = () => {
        socket.emit("compile", (gameData.round));
    }

  return (
    <div className="bg hostGame">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <div className="round-info">
            <p>To start game/ skip round, click on new round button.</p>
            Round #<span id="rno">{gameData.round}</span> <button className="next-round btn btn-info">New Round <i className="bi bi-arrow-bar-right"></i></button>
        </div>
        <div className="game-display">

            <div className="phrases py-2">
                { words.map((word, index) => 
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
                    { players.map((player, index) => (player !== gameData.oracle) && <li key={index}>{player}</li>)}
                </ul>
            </div>
        </div>
        <div className="oracle-info p-2 rounded mb-3">
            <div className="name">Oracle : <span>{gameData.oracle}</span></div>
            <div className="clues">Oracle's Clue : <span id="c1">{clues.clue1}</span> <span id="c2">{clues.clue1}</span></div>
        </div>
        <div className="container mt-2">
            <div className="btn btn-outline-warning">Team Mode</div>
            <button id="results" className="btn btn btn-warning px-3" onClick={() => getResult()}>Results <i className="bi bi-arrow-right-circle p-1"></i></button>
        </div>
        <div id="timer"><span id="sec">{time}</span> seconds left.</div>
    </div>
  );
}

export default HostGame;
