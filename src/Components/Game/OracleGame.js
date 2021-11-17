import React, { useEffect, useState } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function OracleGame({socket, time, setTime}) {

    const [clue1, setClue1] = useState("");
    const [clue2, setClue2] = useState("");
    const [readOnly, setReadOnly] = useState(false);
    const [words, setWords] = useState(null);

    useEffect(() => {
        if(time === ""){
            let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
            setTime(gameOptions.time * 60);
        }
        else{
            if (time > 0) {
                setTimeout(() => setTime(time - 1), 1000);
            }
        }
    }, [time, setTime, socket]);
    
    useEffect(() => {
        socket.emit("newWord");
        socket.on("newWord", (oracleWords) => {
            setWords(oracleWords);
        });
    }, [socket])


    const sendClues = () => {
        if(clue1 !== "" && clue2 !== "" && readOnly === false){
            let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
            let clues={
                clue1: clue1,
                clue2: clue2
            }
            let data = {
                name: gameOptions.name,
                clues: clues
            }
            socket.emit("clues", (data));
            setReadOnly(true);
        }
    }

  return (
    <div className="bg oracleGame">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <div className="game">
            <div className="greeting"> Hello Oracle <span id="or_name"></span></div>
            <h4>Guide the explorers with your clues</h4>
            <div className="codes">
                <h3>Treasure Code : <span className="ts-code"> {(words !== null) && words.codeNumbers.sort()} </span></h3>
                <h3>Trap code : <span className="tp-code">{(words !== null) && words.trapNumber}</span></h3>
            </div>
            <div className="phrases">
                { (words !== null) && words.words.map((word, index) => 
                    <div className={`word ${(index+1 === words.trapNumber) && 'trap'} ${(words.codeNumbers.includes(index+1)) && 'treasure'} `} key={index}>
                        <span>{word}</span>
                        <div className="num">{index + 1}</div>
                    </div>
                )}
            </div>
            <div className="clues">
                <h3>Oracle's Clue</h3>
                <input id="clue1" value={clue1} onChange={ (e) => setClue1(e.target.value) } readOnly={readOnly} />
                <input id="clue2" value={clue2} onChange={ (e) => setClue2(e.target.value) } readOnly={readOnly} />
                <p>Only one word per box. No special characters allowed</p>
                <button className="btn btn-lg btn-warning px-4" onClick={ () => sendClues()}>Send</button>
            </div>
        <div id="timer"><span id="sec">{time}</span> seconds left.</div>
        </div>
    </div>
  );
}

export default OracleGame;
