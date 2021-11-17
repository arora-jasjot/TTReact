import React, { useState, useEffect} from "react";
import navImg from '../../Media/mascotBrandLogo.png'
import headImg from '../../Media/tt1.svg'

function Join({socket, moveGame}) {

  const [inCode, updateCode] = useState("");
  const [inName, updateName] = useState("");
  const [error, setError] = useState("");

  const joinGame = () => {
      let x = {
        code : inCode,
        name : inName
      };
      let joinInfo = {
        game : "play",
        code : inCode,
        name : inName
      }
      window.sessionStorage.setItem("tt-game", JSON.stringify(joinInfo));
      if (inName !== "" && inCode !== "") {
        socket.emit("verifyCode", (x));
      }
    }

  useEffect(() => {
    const handleVerify = (message) => {
      switch (message){
        case "Joined" : {
            setError("");
            moveGame("lobby");
            break;
        }
        case "Already Exists" : {
            setError("Player with this name already exists.");
            break;
        }
        case "Not Found" : {
            setError("Game Not Found ! Please enter the correct game code.");
            break;
        }
        case "Already Started" : {
            setError("Game has already been started.");
            break;
        }
        default : console.log("Error");
      } 
    }

    socket.on("verified", handleVerify);
  }, [socket, moveGame]);

  return (
    <div className="bg container-fluid join">
    <nav id="home-nav" className="d-flex justify-content-between align-items-center p-3">
            <img src={navImg} alt="" />
            <img src={headImg} alt="" />
        </nav>
        <h1>Ready to Play?</h1>
        <div className="join-form container">
            <div>
                <label htmlFor="code">Game Code</label>
                <input type="text" id="code" name="code" autoComplete="off" onChange={(e) => updateCode(e.target.value)} value={inCode} />
            </div>
            <div>
                <label htmlFor="name">Nick Name</label>
                <input type="text" id="name" name="name" autoComplete="off" onChange={(e) => updateName(e.target.value)} value={inName} />
            </div>
            <p id="error">{error}</p>
            <button className="btn btn-lg btn-info" onClick={() => joinGame()}>Join</button>
        </div>
</div>
  );
}

export default Join;
