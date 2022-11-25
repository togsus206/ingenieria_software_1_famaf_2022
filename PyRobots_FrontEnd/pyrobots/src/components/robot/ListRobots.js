import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./../../css/robot/ListRobots.css"

function ListRobots() {
  const navigate = useNavigate();
  const [robots, setRobots] = useState([]);

  const getRobots = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/robots`)
      .then(function (response) {
        setRobots(response.data.robots);
      })
      .catch(function (error) {
        setRobots([]);
      });
  }

  useEffect(() => {
    getRobots();
  }, []);

  function handleClick() {
    navigate("/upload_robot");
  }

  return (
      <div className="container">
        <div className="row justify-content-center pt-5 mt-5 mr-1">
          <div className="col-md-6 box">
            <h2 className="text-center" >Your robots</h2>
            <hr></hr>
            <div className="robots-list">
              {robots.map((element) =>
                <div className="robot-item" key={element.id} data-testid={`robot_${element.name}`} >
                  <div className="row" >
                    <div className="col-md-2 col-sm-2" >
                      <img src={element.avatar} alt="user" className="profile-photo-lg" ></img>
                    </div>
                    <div className="col-md-6 col-sm-6" >
                      <h5>{element.name}</h5>
                    </div>
                    <div className="col-md-4 col-sm-4" >
                      <div>Played matches: {element.games_played} </div>
                    </div>
                  </div>
                  <hr></hr>
                </div>
              )}
            </div>
            <div className="d-grid gap-2 col-3 mx-auto mt-4">
              <button className="my-btn" onClick={handleClick} data-testid="upload" >Add a new robot</button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ListRobots;