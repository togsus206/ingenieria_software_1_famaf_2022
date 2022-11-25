import { useState } from "react";
import axios from "axios";
import '../../css/forms.css';
import { useNavigate } from "react-router-dom";

function Create_user() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    avatar: ""
  });

  const [message, setMessage] = useState('')
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUser({ ...user, [e.target.name]: reader.result })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/create_user`, {
      email: user.email,
      username: user.name,
      password: user.password,
      avatar: user.avatar
    }).then(response => {
      if (response.status === 200) {
        window.alert(response.data.message);
        navigate("/verify_user");
      }
    }).catch(error => {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Server error');
      }

    })
  }

  const goLogin = () => {
    navigate('/')
  }

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5 mr-1">
          <div className="col-md-6 my-form">
            <div className="form-group mt-1 mx-3">
              <h2 className="text-center">Sign Up</h2>
              <hr></hr>
              <div className="form-group">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className='form-label'>Name: </label>
                    <input className='form-control my-form-control' type="text" name="name" placeholder="enter your name" onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className='form-label'>Email: </label>
                    <input className='form-control my-form-control' type="text" name="email" placeholder="enter your email" onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className='form-label'>Password: </label>
                    <input className='form-control my-form-control' type="password" name="password" placeholder="enter your password" onChange={handleChange} required />
                  </div>
                  <div className="mb-3" >
                    <label className='form-label' >Avatar (optional): </label>
                    <input className='form-control my-form-control' type="file" name="avatar" accept="image/png, image/jpeg" placeholder="robot_avatar" onChange={handleImageChange} />
                  </div>
                  <div className="mx-auto mt-4">
                    <button type="button" className="my-btn" onClick={goLogin} >Go back to Login</button>
                    <button className="my-btn" type='submit'>Register</button>
                  </div>
                  {message ? <p>{message}</p> : null}
                  <p>{error}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Create_user;