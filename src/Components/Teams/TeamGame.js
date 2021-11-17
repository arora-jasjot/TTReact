import React from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function TeamGame() {
  return (
    <div className="bg container-fluid teamGame">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <div className="game-display col-12 col-md-6 offset-md-3">

            <div className="phrases py-2">
            
            </div>
        </div>
        <div className="oracle-info p-2 rounded mb-3">
            <div className="name">Oracle : <span>rsh</span></div>
            <div className="clues">Oracle's Clue : <span id="c1"></span> <span id="c2"></span></div>
        </div>
        <div className="fixed-bottom mb-5 col-12 p-4 d-flex justify-content-end align-items-center">
            <div className="btn btn-warning rounded-circle" id="chatbtn"><i className="bi bi-chat"></i></div>
            <div className="chatbox col-md-2 col-8 bg-light rounded text-dark">
                <div className="head text-center p-2">Team Chat <div className="close_chat"><i className="bi bi-x-lg"></i></div></div>
                <div className="chat p-1">

                </div>
                    <div className="fixes-bottom d-flex border">
                    <input type="text" className="input col-10 p-2" placeholder="Type Here..." />
                    <div className="send col-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15.964.686a.5.5 0 0 0-.65-.65l-.095.038L.767 5.854l-.001.001-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.563 2.903.432.275.275.432 2.903 4.563.002.002.26.41a.5.5 0 0 0 .886-.083l.181-.453L15.926.78l.038-.095Zm-1.833 1.89.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154l.215.338 7.494-7.494Z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div id="timer"><span id="sec">180</span> seconds left.</div>
    </div>
  );
}

export default TeamGame;
