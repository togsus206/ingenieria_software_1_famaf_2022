import { useState, useEffect } from 'react'
import { setToken, fetchToken } from '../../helpers/Auth'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../css/forms.css';

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const [error, setErrors] = useState('');

  useEffect(() => {
    if (fetchToken()) {
      navigate("/matches");
    }
  })

  const handleInputChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const login = (event) => {
    event.preventDefault();
    if (user.email === '' || user.password === '') {
      setErrors("empty field");
    } else {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        email: user.email,
        password: user.password
      })
        .then(function (response) {
          if (response.data.token) {
            setToken(response.data.token);
            navigate("/");
          }
          else if (response.data.error) {
            setErrors(response.data.error);
          }
        })
        .catch(function (error) {
          setErrors(error.message);
        });
    }

  }
  return (
    <div className="container">
      <div className="row justify-content-center pt-5 mt-5 mr-1">
        <div className="col-md-4 my-form">
          <div className="form-group mt-1 mx-3">
            <h2 className="text-center">Login</h2>
              <div className="form-group">
                <form onSubmit={login}>
                  <div className="mb-3">
                    <label className="form-label">Email: </label>
                    <input className="form-control my-form-control" type='email' name="email" onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password: </label>
                    <input className="form-control my-form-control" type='password' name="password" onChange={handleInputChange} />
                  </div>
                  <div className="d-grid gap-2 col-2 mx-auto">
                    <button className="my-btn" type='submit'>Login</button>
                  </div>
                  <div className="mt-5">
                    <div>Don't have account?</div>
                    <a className="my-link-light" href="/create_user">Register</a>
                  </div>
                  {error && <div>{error}</div>}
                </form>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;