import "d3-transition";
import { select } from "d3-selection";
import React, { useEffect, useState } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'
import ReactWordcloud from "react-wordcloud";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";


const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    deterministic: true,
    fontFamily: "impact",
    fontSizes: [20, 150],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 0,
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 500
  };
  
  function getCallback(callback) {
    return function (word, event) {
      const element = event.target;
      const text = select(element);
      text
        .transition()
    };
  }
  
  const callbacks = {
    getWordTooltip: (word) =>
      `${word.players}`,
    onWordMouseOut: getCallback("onWordMouseOut"),
    onWordMouseOver: getCallback("onWordMouseOver")
  };
  

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
            expArr[i].text = code;
        }
        for(let i=0; i<expArr.length; i++){
            expArr[i].value = 50 / max * expArr[i].players.length;
        }
        setExp(expArr);
        // createCloud(expArr);
    }

    useEffect(() => {
        if(result === null){
            let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
            if(gameOptions.game === "host") setHost(true);
            socket.emit("results");
        }
        socket.on("results", (result) => {
            setResult(result);
            setWords(result.oracle.oracleWords);
            organiseExplorers(result.explorers, result.oracle.name);
        })
    }, [socket, setHost, result])

    const showScores = () => {
        socket.emit("scores");
    }

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
        

        {host && <div className="score" onClick={() => showScores()}>Scores</div>}
    </div>
  );
}

export default Result;
