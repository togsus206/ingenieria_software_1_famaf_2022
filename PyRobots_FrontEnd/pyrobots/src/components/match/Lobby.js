import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ButtonLobby from './ButtonLobby';
import Results from './Results';

const Lobby = () => {
    let { id } = useParams();
    const [robots, setRobots] = useState(null);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const ws = new WebSocket("ws://" + process.env.REACT_APP_BACKEND_URL.split("//")[1] + "/lobby/" + id);
        ws.onmessage = function (event) {
            if (event.data) {
                let data = JSON.parse(event.data);
                if (data.room) {
                    setRobots(data.room)
                }
                if (data.result) {
                    setResults(data.result);
                }
            }

        }
    }, [id]);

    if (!robots) return;

    let thereIsResults = false;
    if (!results) {
        thereIsResults = true;
    }

    return (
        <div className="container">
            <div className="row justify-content-between pt-5 mt-5 mr-1">
                <div className="col-6 mb-3">
                    <div className="box">
                        <h1>{robots.Creator.Owner} 👑</h1>
                        <h2>{robots.Creator.Robot_name}</h2>
                    </div>
                </div>
                {robots.Players.map((element) =>
                    <div className="col-6 mb-3" key={element.Player}>
                        <div className="box">
                            <h1 data-testid={`player_${element.Player}`}>{element.Player}</h1>
                            <h2 data-testid={`robot_${element.Robot_name}`}>{element.Robot_name}</h2>
                        </div>
                    </div>)
                }
            </div>
            <Results results={results} />
            {thereIsResults ? <ButtonLobby owner={robots.Creator.Owner} /> : null}
        </div>
    )
}

export default Lobby;