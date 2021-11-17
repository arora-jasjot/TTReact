import React from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'
import gridImg from '../../Media/grid.svg'

function Landing({moveGame}) {
  return (
      <div className="bg container-fluid">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3 px-5">
            <img src={navImg} alt="" />
        </nav>

        <div className="tt-logo col-12">
          <img src={headImg} className="img-fluid" alt="" />
        </div>

        <div className="home-desc container row d-flex justify-content-center align-items-center">
          <div className="col-md-3 offset-md-0 p-3 col-8 d-flex justify-content-center align-items-center">
            <img src={gridImg} alt="" />
          </div>
          <p className="fs-5 col-md-9 col-12 text-light text-center">
            There are tunnels with precious treasures, and you are guided by a
            wise Oracle. You need to think creatively, evaluate critically,
            communicate empathetically by understanding people’s perspectives
            and collaborate effectively, to come out of the tunnels successfully
            with valuable treasures.
          </p>
        </div>

        <div className="container p-5 rounded col-12 col-md-4 offset-md-4 d-flex justify-content-evenly align-items-center">
          <button className="btn btn-lg game-btn" onClick={ () => moveGame("host")}>HOST GAME</button>
          <button className="btn btn-lg game-btn" onClick={ () => moveGame("join")}>JOIN GAME</button>
        </div>
      </div>
  );
}

export default Landing;
