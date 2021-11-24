
import React, { useState, useEffect } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function PlayerGame({ socket }) {

    const [time, setTime] = useState("");
    const [flag, setFlag] = useState(true);
    const [err, setError] = useState("");
    const [code, setCode] = useState([]);
    const [words, setWords] = useState([]);
    const [clues, setClues] = useState({ clue1: "", clue2: "" });
    const [gameData, setData] = useState(null);


    useEffect(() => {
        let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
        setData(gameOptions);
        return () => setData(null);
    }, []);

    useEffect(() => {
        if (gameData !== null) {
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
        if(words.length === 0){
            socket.emit("newWord");
        }
        socket.on("newWord", (oracleWords) => {
            setWords(oracleWords.words);
        });
        socket.on("clues", (clues) => {
            setClues(clues);
        })
    }, [socket, words.length])

    const selectWord = (num) => {
        if (clues.clue1 !== "" && flag === true) {
            let x = [...code];
            if (x.includes(num)) {
                let index = x.indexOf(num);
                x.splice(index, 1);
                setCode(x);
            }
            else if (x.length < 4) {
                x.push(num);
                setCode(x);
            }
            let y = [...document.getElementsByClassName("word")];
            y.forEach((word, index) => {
                if (x.includes(index + 1)) word.classList.add("selected");
                else word.classList.remove("selected");
            });
        }
    }

    const sendAnswer = () => {
        if (flag === true) {
            if (clues.clue1 === "") setError("Please wait for clues")
            else if (code.length < 4) setError("Please select 4 words");
            else {
                let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
                socket.emit("answer", ({
                    name: gameOptions.name,
                    tcode: code
                }));
                setFlag(false);
                setError("");
                document.getElementById('sendans').classList.add('disabled', 'btn-secondary')
                document.getElementById('sendans').classList.remove('btn-warning')
            }
        }
    }

    return (
        <div className="bg playerGame">
            <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
                <img src={navImg} alt="" />
                <img src={headImg} alt="" />
            </nav>
            <div className="game">
                <div className="toggle">
                    <p>Do you wish to be oracle in Future Rounds ?</p>
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="greeting"> Hello Explorer <span id="player_name"></span></div>
                <h4>Find the 4 word passphrase</h4>
                <div className="phrases">
                    {words.map((word, index) =>
                        <div className="word" key={index} onClick={() => selectWord(index + 1)}>
                            <span>{word}</span>
                            <div className="num">{index + 1}</div>
                        </div>
                    )}
                </div>
                <div className="clues">
                    <h4>Oracle's Clue: <span id="c1">{clues.clue1}</span> <span id="c2">{clues.clue2}</span></h4>
                </div>
                <div className="code">
                    <h4>Your Treasure Code:</h4>
                    <span className="input">{code.sort()}</span>
                    <p id="error">{err}</p>
                    <p>Order doesn't matter</p>
                    <button onClick={() => sendAnswer()} id='sendans' className="btn btn-lg btn-warning px-4"> Send Code </button>
                </div>
                <div id="timer"><span id="sec">{time}</span> seconds left.</div>
            </div>
        </div>
    );
}

export default PlayerGame;
