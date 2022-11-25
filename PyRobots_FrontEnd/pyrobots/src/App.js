import './css/App.css';
import { RequireToken, setupAxios } from './helpers/Auth'
import CreateUser from "./components/user/create_user";
import CreateMatch from './components/match/CreateMatch';
import Login from './components/login/Login';
import ListMatches from './components/match/ListMatches';
import Lobby from './components/match/Lobby';
import Logout from './components/login/Logout';
import Upload from './components/robot/upload';
import Simulation from "./components/simulation/Simulation";
import Navbar from "./components/navbar/navbar"
import ListRobots from './components/robot/ListRobots';
import VerifyUser from './components/user/VerifyUser';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  setupAxios();
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create_user" element={<CreateUser />} />
        <Route path="/matches" element={<RequireToken><ListMatches /></RequireToken>} />
        <Route path="/logout" element={<RequireToken><Logout /></RequireToken>} />
        <Route path="/create_match" element={<RequireToken><CreateMatch /></RequireToken>} />
        <Route path="/upload_robot" element={<RequireToken><Upload /></RequireToken>} />
        <Route path="/robots" element={<RequireToken><ListRobots /></RequireToken>} />
        <Route path="/simulation" element={<RequireToken><Simulation /></RequireToken>} />
        <Route path="/lobby/:id" element={<RequireToken><Lobby /></RequireToken>} />
        <Route path="/verify_user" element={<VerifyUser />} />
      </Routes>
    </Router>
  );
}

export default App;
