import React, {useState, useEffect} from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function Score({socket}) {

    const [result, setResult] = useState(null);
    const [host, setHost] = useState(false);
    const [exp, setExp] = useState(null);
    let [dp, setDp] = useState("crnt");

    useEffect(() => {
        if(result === null){
            let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
            if(gameOptions.game === "host") setHost(true);
            socket.emit("results");
        }
        socket.on("results", (result) => {
            setResult(result);
            let arr = result.explorers;
            arr.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
            setExp(arr);
        })
    }, [socket, setHost, result])

    const changeScore = (x) => {
        if(x === "ovrl"){
            let arr = exp;
            arr.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
            setExp(arr);
            document.querySelector("#crnt").classList.remove("slt");
            document.querySelector("#ovrl").classList.add("slt");
            setDp("ovrl");
        }
        else{
            let arr = exp;
            arr.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
            setExp(arr);
            document.querySelector("#ovrl").classList.remove("slt");
            document.querySelector("#crnt").classList.add("slt");
            setDp("crnt");
        }
    }

    const game = (x) => {
    if(x === "next") socket.emit("newRound");
    else socket.emit("endGame");
    }


  return (
    <div className="bg container-fluid score">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <h1>Round #<span id="round">{(result !== null) && result.round }</span></h1>
        <div className="oracle">
            <h1>Oracle's Score</h1>
            <h2><span>{(result !== null) && result.oracle.name}</span> <span>{(result !== null) && result.oracle.score}</span></h2>
        </div>
        <div className="explorer">
            <h1>Top explorer's</h1>
            <button className="btn-score-info slt" id="crnt" onClick={() => changeScore("crnt")}>Current Round</button>
            <button className="btn-score-info" id="ovrl" onClick={() => changeScore("ovrl")}>Overall</button>
            <div className="list">
                {(exp !== null) && 
                    exp.map((explorer, index) => (dp === "crnt") ? (explorer.name !== result.oracle.name) && <h2 key={index}><span>{explorer.name}</span> <span>{explorer.score}</span></h2> : <h2 key={index}><span>{explorer.name}</span> <span>{explorer.total}</span></h2>)
                }
            </div> 
            {host && 
            <div className="btn">
                <button className="nextRound" onClick={() => game("next")}>Next Round</button>
                <button className="endGame" onClick={() => game("end")}>End Game</button>
            </div> }
        </div>
    </div>
  );
}

export default Score;
