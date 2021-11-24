import React, { useEffect, useState } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'
import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const handleMouseOver = (e, word) =>{
    let x = document.querySelector("#cloud div ");
    const text = document.createElement("p");
    text.setAttribute('id', 'players');
    text.innerHTML = word.players;
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    let right = e.target.getBoundingClientRect().right;
    let top = e.target.getBoundingClientRect().top +scrollTop;
    text.style.top = top + "px";
    text.style.left = right + "px";
    x.append(text);
}

const handleMouseOut = () => {
    document.querySelector("#players").remove();
}

function Result({socket}) {

    const [result, setResult] = useState(null);
    const [words, setWords] = useState(null);
    const [host, setHost] = useState(false);
    const [expArr, setExp] = useState(null);


    const organiseExplorers = (exp, orc) => {
        let max = 1, expArr = [];
        for (let i = 0; i < exp.length; i++) {
            if (exp[i].name === orc) continue;
            let uploaded = false;
            for (let j = 0; j < expArr.length; j++) {
                if (exp[i].answer.every(e => expArr[j].text.includes(e))) {
                    expArr[j].players.push(exp[i].name);
                    uploaded = true;
                }
            }
            if (uploaded === false) {
                expArr.push({
                    text: exp[i].answer,
                    players: [exp[i].name]
                });
            }
        }
        for(let i=0; i<expArr.length; i++){
            if(expArr[i].players.length > max) max=expArr[i].players.length;
            let code = 0;
            for(let j=0; j<4; j++){
                code = code * 10 + expArr[i].text[j];
            }
            expArr[i].text = code.toString();
        }
        for(let i=0; i<expArr.length; i++){
            expArr[i].value = 150 / max * expArr[i].players.length;
        }
        setExp(expArr);
    }
    useEffect(() => {
        let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
        if(gameOptions.game === "host") setHost(true);
        return () => setHost(false);
    }, [])

    useEffect(() => {
        if(result === null){
            socket.emit("results");
        }
        socket.on("results", (result) => {
            setResult(result);
            setWords(result.oracle.oracleWords);
            organiseExplorers(result.explorers, result.oracle.name);
        })
    }, [socket, setHost, result])

    useEffect(() => {
        let componentMounted = true;
        if(componentMounted){
            socket.on('gameProgress', () => {
                socket.emit("gameProgress", "result");
            });
        }

        return () => componentMounted = false;
    })
    
    const showScores = () => {
        socket.emit("scores");
    }
    const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);
  return (    
    <div className="bg container-fluid result">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <div className="game-info">
            <h1>Results</h1>
            <div className="round">Round <span id="rno">{ (result !== null) && result.round}</span></div>
        </div>
        <div className="board">
            <div className="scores">
                <h2>Explorers' Answer</h2>
                <div className="explorers" id="cloud">
                {(expArr !== null) && <WordCloud fontSize={(word)=> word.value } font="Times" fontWeight="bold" rotate={0} fill={(d, i) => schemeCategory10ScaleOrdinal(i)} data={expArr} onWordMouseOver={(e, word) => handleMouseOver(e, word)} onWordMouseOut={() => handleMouseOut()} />}
                </div>
            </div>
            <div className="word-answer">
                <div className="phrases">
                { (words !== null) && words.words.map((word, index) => 
                    <div className={`word ${(index+1 === words.trapNumber) && 'trap'} ${(words.codeNumbers.includes(index+1)) && 'treasure'} `} key={index}>
                        <span>{word}</span>
                        <div className="num">{index + 1}</div>
                    </div>
                )}
                </div>
                <div className="oracle">Oracle Name : <span>{ (result !== null) && result.oracle.name}</span></div>
            </div>
        </div>
        {host && <div className="btn btn-lg btn-warning px-4" onClick={() => showScores()}>Scores</div>}
    </div>
    
  );
}

export default Result;
/*
<div className="bg container-fluid result">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <div className="game-info">
            <h1>Results</h1>
            <div className="round">Round <span id="rno">{ (result !== null) && result.round}</span></div>
        </div>
        <div className="board">
            <div className="scores">
                <h2>Explorers' Answer</h2>
                <div className="explorers" id="cloud">
                {(expArr !== null) && <ReactWordcloud options={options} callbacks={callbacks} words={expArr} />}
                </div>
            </div>
            <div className="word-answer">
                <div className="phrases">
                { (words !== null) && words.words.map((word, index) => 
                    <div className={`word ${(index+1 === words.trapNumber) && 'trap'} ${(words.codeNumbers.includes(index+1)) && 'treasure'} `} key={index}>
                        <span>{word}</span>
                        <div className="num">{index + 1}</div>
                    </div>
                )}
                </div>
                <div className="oracle">Oracle Name : <span>{ (result !== null) && result.oracle.name}</span></div>
            </div>
        </div>
        {host && <div className="score btn btn-warning" onClick={() => showScores()}>Scores</div>}
    </div>
    */