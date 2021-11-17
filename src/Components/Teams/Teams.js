import React from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function Teams() {
  return (
    <div className="bg container-fluid teamsComp">
        <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <div className="container col-md-10 offset-md-1 col-12">
            <div className="row text-center bg-light p-3 rounded">
                <div className="h3">Teams</div>
            </div>
            <div className="row p-3 d-flex justify-content-center align-items-center">
                <div className="col-10 col-md-3 bg-light team rounded">
                    <div className="row p-2 text-center head d-flex justify-content-center align-items-center flex-row">
                        <div className="fs-3 col text-start ps-3">Team1</div>
                        <div className="btn-sm btn-info col-3">Join</div>
                    </div>
                    <div className="row p-1">
                        <div className="player d-flex justify-content-center align-items-center rounded mb-2">
                            <div className="icon rounded-circle fs-3">D</div>
                            <div className="name d-flex justify-content-start align-items-center rounded border-dark border-2 border p-1 ps-4 col">Dhruv</div>
                        </div>
                        <div className="player d-flex justify-content-center align-items-center rounded mb-2">
                            <div className="icon rounded-circle fs-3">D</div>
                            <div className="name d-flex justify-content-start align-items-center rounded border-dark border-2 border p-1 ps-4 col">Dhruv</div>
                        </div>
                        <div className="player d-flex justify-content-center align-items-center rounded mb-2">
                            <div className="icon rounded-circle fs-3">D</div>
                            <div className="name d-flex justify-content-start align-items-center rounded border-dark border-2 border p-1 ps-4 col">Dhruv</div>
                        </div>
                        <div className="player d-flex justify-content-center align-items-center rounded mb-2">
                            <div className="icon rounded-circle fs-3">D</div>
                            <div className="name d-flex justify-content-start align-items-center rounded border-dark border-2 border p-1 ps-4 col">Dhruv</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Teams;
