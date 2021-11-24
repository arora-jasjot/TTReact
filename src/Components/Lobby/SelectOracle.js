import React, { useState, useEffect } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function SelectOracle({ socket }) {

  const [mode, setMode] = useState("indi");
  const [oracle, setOracle] = useState("");
  const [players, setPlayers] = useState([]);
  const [sOracle, setSOracle] = useState("");

  useEffect(() => {
    let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
    if (gameOptions.mode === 'team') setMode('team');
    setPlayers(gameOptions.players);

    return () => setMode("indi");
  }, [])

  useEffect(() => {
    if (players.length !== 0) socket.emit("selectOracle", players);
    socket.on("oracle", (oracle) => {
      setOracle(oracle);
    })
    socket.on('gameProgress', () => {
      socket.emit("gameProgress", "selectOracle");
    });
  }, [socket, players])

  useEffect(() => {
    let componentMounted = true;
    if (componentMounted) {
      socket.on('disconnected', (name) => {
        let x = [...players];
        let index = x.indexOf(name);
        x.splice(index, 1);
        setPlayers(x);
        if (oracle === name) socket.emit("selectOracle", x);
      })

      socket.on('rejoined', (name) => {
        let x = [...players];
        if (x.includes(name) === false) {
          x.push(name);
          setPlayers(x);
        }
      })
    }

    return () => componentMounted = false;
  })



  const select = (nextOracle) => {
    if (nextOracle !== "") socket.emit("selectOracle", [nextOracle]);
  }

  const startGame = () => {
    let gameOptions = JSON.parse(window.sessionStorage.getItem("tt-game"));
    gameOptions.oracle = oracle;
    window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
    socket.emit("started", oracle);
  }

  return (
    <div className="bg container-fluid selectOracle">
      <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
        <img src={navImg} alt="" />
        <img src={headImg} alt="" />
      </nav>
      <div className="bg-light p-2 col-md-4 offset-md-4 col-12 rounded mb-3 text-dark pb-3 text-center">
        <div className="h2 border-bottom border-dark mb-4">Current Oracle</div>
        <h2 id="current"><span>{oracle}</span></h2>
      </div>
      <div className="container bg-light text-dark rounded col-md-4 col-12 p-2">
        <h2 className="h2 border-bottom border-dark mb-4 text-center">Select New Oracle</h2>
        <div id="select">
          {players.map((player, index) =>
            <div id="radioOracle" key={index}> <input type="radio" name="newOracle" value={player} onChange={(e) => setSOracle(e.target.value)} /> <span>{player}</span> </div>
          )}
        </div>
        <button id="choose" className="btn-lg btn btn-info" onClick={() => select(sOracle)}>Select Oracle</button>
      </div>
      {mode === 'team' && <button id="assign_teams" className="btn-lg btn btn-warning d-block">Assign Teams</button>}
      <button id="start" className="btn-lg btn btn-warning d-block" onClick={() => startGame()}>Start game</button>
    </div>
  );
}

export default SelectOracle;
