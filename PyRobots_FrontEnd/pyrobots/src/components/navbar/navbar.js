import '../../css/navbar.css';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  if (location.pathname === "/" || location.pathname === "/create_user" || location.pathname === "/verify_user") return;

  return (
    <nav className="navbar navbar-expand-lg navbar-color">
      <div className="container-fluid">
        <button className="navbar-toggler ml-auto custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link my-link-light" to="/matches">Matches</Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link my-link-light" to="/robots">Robots</Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link my-link-light" to="/simulation">Simulation</Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link my-link-light" to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;