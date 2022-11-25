import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../css/forms.css';

function CreateMatch() {
  const navigate = useNavigate();

  const [robots, setRobots] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/robots`)
      .then(function (response) {
        setRobots(response.data.robots);
      })
      .catch(function (error) {
        setRobots([]);
      });
  }, []);

  const [match, setMatch] = useState({
    name: "",
    min_players: 2,
    max_players: 4,
    number_of_rounds: 50,
    number_of_games: 10,
    id_robot: "",
    password: "",
  });

  const [error, setErrors] = useState("");

  const handleInputChange = (event) => {
    setMatch({
      ...match,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/create_match`, match)
      .then(function (response) {
        if (response.data.match_id) {
          navigate(`/lobby/${response.data.match_id}`);
        } else if (response.data.error) {
          setErrors(response.data.error);
        }
      })
      .catch(function (error) {
        setErrors(error.message);
      });
  };

  const goMatches = () => {
    navigate('/matches')
  }

  return (
    <div className="container">
      <div className="row justify-content-center pt-5 mt-5 mr-1">
        <div className="col-md-10 box">
          <h2 className="text-center" >Create Match</h2>
          <hr></hr>
          <div className="row justify-content-center">
            <form className="col-10 mx-5 my-4" onSubmit={onSubmit}>
              <label className="form-label">Name: </label>
              <input className="form-control my-form-control"
                data-testid="name-input"
                type="text"
                name="name"
                onChange={handleInputChange}
                required
              />

              <div className="container text-center">
                <div className="row">
                  <div className="col-6 my-5 pe-4">
                    <p>Number of players to begin match</p>
                    <label className="form-label">Min: </label>
                    <input className="form-control my-form-control"
                      data-testid="min_players-input"
                      type="number"
                      name="min_players"
                      placeholder={match.min_players}
                      onChange={handleInputChange}
                    />
                    <label className="form-label mt-4">Max: </label>
                    <input className="form-control my-form-control"
                      data-testid="max_players-input"
                      type="number"
                      name="max_players"
                      placeholder={match.max_players}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 my-5 ps-4">

                    <label className="form-label">Number of Rounds: </label>
                    <input className="form-control my-form-control"
                      data-testid="number_rounds-input"
                      type="number"
                      name="number_rounds"
                      placeholder={match.number_of_rounds}
                      onChange={handleInputChange}
                    />
                    <label className="form-label mt-4">Number of Games: </label>
                    <input className="form-control my-form-control"
                      data-testid="number_games-input"
                      type="number"
                      name="number_games"
                      placeholder={match.number_of_games}
                      onChange={handleInputChange}
                    />

                    <select className="form-select my-form-control mt-5"
                      data-testid="robot-select"
                      key="robots"
                      name="id_robot"
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-select your robot-</option>
                      {robots.map((element, index) => (
                        <option key={element.id} value={element.id}>
                          {element.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button type="button" className="my-btn" onClick={goMatches} >Go back to matches</button>
              <button className="my-btn" type="submit">Create Match</button>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateMatch;
