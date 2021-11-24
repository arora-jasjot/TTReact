import React, { useState } from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function Home({moveGame}) {


    const [mode, setMode] = useState('indi');
    const [time, setTime] = useState(3);
    const [team, setTeam] = useState('auto');
    const [teamCount, setCount] = useState(2);

    const changeMode = (newMode) => {
        if(newMode === 'indi' && mode!== newMode){
            document.getElementById('team').classList.remove('bg-light')
            document.getElementById('team').classList.add('text-light')
            document.querySelectorAll(".teams")[0].style.height = "0px";
            document.querySelectorAll(".teams")[1].style.height = "0px";
            setMode('indi');
            
        }else if(newMode === 'team' && mode!== newMode){
            document.getElementById('indi').classList.remove('bg-light')
            document.getElementById('indi').classList.add('text-light')
            document.querySelectorAll(".teams")[0].style.height = "auto";
            document.querySelectorAll(".teams")[1].style.height = "auto";
            setMode('team');
        }
        document.getElementById(newMode).classList.add('bg-light')
        document.getElementById(newMode).classList.remove('text-light')
        
    }

    const changeTime = (timeUpdate) => {
        if(timeUpdate === '+' && time < 5){
            let x = time + 1;
            setTime(x);
            document.getElementById('time').innerText = x +' min';
        }
        if(timeUpdate === '-' && time > 2){
            let x = time - 1;
            setTime(x);
            document.getElementById('time').innerText = x +' min';
        }
    }

    const changeTeam = (newMode) => {
        if(newMode === 'auto' && team!== newMode){
            document.getElementById('manual').classList.remove('bg-light')
            document.getElementById('manual').classList.add('text-light')
            setTeam('auto')
            
        }else if(newMode === 'manual' && team!== newMode){
            document.getElementById('auto').classList.remove('bg-light')
            document.getElementById('auto').classList.add('text-light')
            setTeam('manual')
        }
        document.getElementById(newMode).classList.add('bg-light')
        document.getElementById(newMode).classList.remove('text-light')
    }

    const count = (countUpdate) => {
        if(countUpdate === '+' && teamCount < 5){
            let x = teamCount + 1;
            setCount(x);
            document.getElementById('team_count').innerText = x;
        }
        if(countUpdate === '-' && teamCount > 2){
            let x = teamCount- 1;
            setCount(x);
            document.getElementById('team_count').innerText = x;
        }
    }

    const getPlayers = () => {
        let gameOptions = {
            game : "host",
            mode : mode,
            time : time,
            round : 1,
            players : []
        }
        if(mode === "team"){
           gameOptions.select = team;
           gameOptions.count = teamCount;
        }
        window.sessionStorage.setItem("tt-game", JSON.stringify(gameOptions));
        moveGame("lobby")
    }

  return (
    <div className="bg container-fluid home">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3 px-5">
                <img src={navImg} alt="" />
                <img src={headImg}alt="" />
            </nav>
        <div className="settings container mt-2">
            <div className="row bg-light rounded col-md-4 offset-md-4 col-10 offset-1 py-3 px-1">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col">Play Mode</div>
                    <div className="col bg-brown rounded d-flex justify-content-evenly align-items-center p-1" >
                        <div className="col bg-light p-1 rounded text-center btn" id="indi" onClick={() => changeMode('indi')}>Individual</div>
                        <div className="col text-light p-1 rounded text-center btn" id="team" onClick={() => changeMode('team')}>Team</div>
                    </div>
                </div>
                <div className="row d-flex justify-content-center align-items-center mt-2">
                    <div className="col">Time</div>
                    <div className="col d-flex justify-content-evenly align-items-center p-1">
                        <div className="col bg-brown text-light p-1 rounded-start text-center teamcountbtn" onClick={() => changeTime('-') } >-</div>
                        <div className="col bg-light px-4 text-center" id="time">3 min</div>
                        <div className="col bg-brown text-light p-1 rounded-end text-center teamcountbtn" onClick={() => changeTime('+')}>+</div>
                    </div>
                </div>
                <div className="row d-flex justify-content-center align-items-center mt-2 teams">
                    <div className="col">Team Selection</div>
                    <div className="col bg-brown rounded d-flex justify-content-evenly align-items-center p-1">
                        <div className="col bg-light p-1 rounded text-center btn" id="auto" onClick={() => changeTeam('auto')}>Automatic</div>
                        <div className="col text-light p-1 rounded text-center btn" id="manual" onClick={() => changeTeam('manual')}>Manual</div>
                    </div>
                </div>
                <div className="row d-flex justify-content-center align-items-center mt-2 teams">
                    <div className="col">Teams</div>
                    <div className="col d-flex justify-content-evenly align-items-center p-1">
                        <div className="col bg-brown text-light p-1 rounded-start text-center teamcountbtn" onClick={() => count('-')} >-</div>
                        <div className="col bg-light px-4 text-center" id="team_count">2</div>
                        <div className="col bg-brown text-light p-1 rounded-end   text-center teamcountbtn" onClick={() => count('+')}>+</div>
                    </div>
                    <div className="col-12 text-center p-3">
                        Minimum 3 players per team required
                    </div>
                </div>
                <div className="col-12 text-center">
                    <div className="btn btn-warning rounded-pill fw-bold px-4 py-2" id="get_players" onClick={() => getPlayers()}>Get Players</div>
                </div>
            </div>

        </div>
    </div>
  );
}

export default Home;
