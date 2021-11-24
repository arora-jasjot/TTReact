import React, {useState, useEffect} from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function Score({socket}) {

    const [result, setResult] = useState(null);
    const [host, setHost] = useState(false);
    const [exp, setExp] = useState(null);
    let [dp, setDp] = useState("crnt");

    useEffect(() => {        
        let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
        if(gameOptions.game === "host") setHost(true);
        else setHost(false);

        return () => setHost(false);
    }, [])

    useEffect(() => {
        if(result === null){
            socket.emit("results");
        }
        socket.on("results", (res) => {
            setResult(res);
            let arr = res.explorers;
            arr.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
            setExp(arr);
        })
    }, [socket, result])

    useEffect(() => {
        let componentMounted = true;
        if(componentMounted){
            socket.on('gameProgress', () => {
                socket.emit("gameProgress", "score");
            });
        }

        return () => componentMounted = false;
    })

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
    <div className="bg container score">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <h1>Round #<span id="round">{(result !== null) && result.round }</span></h1>
        <div className="bg-light text-dark col-md-4 offset-md-4 col-12 rounded p-2 pb-3 mb-3">
            <h1 className='border-bottom border-dark pb-2 '>Oracle's Score</h1>
            <h2 className="text-dark"><span>{(result !== null) && result.oracle.name}</span> <span>{(result !== null) && result.oracle.score}</span></h2>
        </div>
        <div className="bg-light text-dark rounded col-md-6 offset-md-3 col-12 p-2 pb-3">
            <h1 className='border-bottom border-dark pb-2'>Top explorer's</h1>
            <div className='d-flex justify-content-evenly px-5'>
                <button className="btn-score-info slt btn btn-dark px-4" id="crnt" onClick={() => changeScore("crnt")}>Current Round</button>
                <button className="btn-score-info slt btn btn-dark px-5" id="ovrl" onClick={() => changeScore("ovrl")}>Overall</button>
            </div>
            <div className="list">
                {(exp !== null) && 
                    exp.map((explorer, index) => (dp === "crnt") ? (explorer.name !== result.oracle.name) && <h2 key={index} className='d-flex justify-content-evenly px-5'><span>{explorer.name}</span> <span>{explorer.score}</span></h2> : <h2 key={index}><span>{explorer.name}</span> <span>{explorer.total}</span></h2>)
                }
            </div> 
            
        </div>
        {host && 
            <div className="btns d-flex justify-content-evenly mt-3 col-md-4 offset-md-4 col-12">
                <button className="nextRound btn btn-lg btn-warning px-4" onClick={() => game("next")}>Next Round</button>
                <button className="endGame btn btn-lg btn-warning px-4" onClick={() => game("end")}>End Game</button>
            </div> }
    </div>
  );
}

export default Score;
