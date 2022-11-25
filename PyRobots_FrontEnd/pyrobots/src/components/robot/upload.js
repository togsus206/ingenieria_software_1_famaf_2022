import '../../css/forms.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./../../css/robot/UploadRobot.css"

function Upload() {

  const navigate = useNavigate();

  const [robot, setRobot] = useState({
    name: '',
    avatar: '',
    script: '',
    fileName: ''
  });
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("")
    if (robot.name === '') {
      setError("A name is required");
      return
    } else if (robot.script === '') {
      setError("A script is required");
      return
    }
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload_robot`, robot)
      .then((response) => {
        if (response.status === 200) {
          alert(response.data.detail);
          navigate("/robots");
        };
      }).catch((error) => {
        if (error.response?.data?.detail) {
          setError(error.response.data.detail);
        } else {
          setError('Server error');
        }
      })
  }

  const handleFileChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setRobot({ ...robot, [e.target.name]: reader.result, fileName: file.name })
    }
    reader.onerror = () => {
      console.log("file error", reader.error)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setRobot({ ...robot, [e.target.name]: reader.result })
    }
  }

  const handleInputChange = (event) => {
    setRobot({
      ...robot,
      [event.target.name]: event.target.value
    })
  }

  const handleClick = () => {
    navigate("/robots");
  }

  return (
    <>
      <div className="container">
        <div className="row justify-content-center pt-5 mt-5 mr-1">
          <div className="col-md-6 box">
            <h2 className="text-center" >Upload robot</h2>
            <hr></hr>
            <form className="row justify-content-center" onSubmit={handleSubmit}>
              <div className="col-10">
                <div className="mb-4">
                  <label className="form-label">Name: </label>
                  <input className="form-control my-form-control" placeholder="robot_name" onChange={handleInputChange} name="name" type="text" />
                </div>
                <div className="mb-4" >
                  <label className="form-label" >Avatar (optional): </label>
                  <input className="form-control my-form-control" type="file" name="avatar" accept="image/png, image/jpeg" placeholder="robot_avatar" onChange={handleImageChange} />
                </div>
                <div className="mb-4">
                  <label className="form-label" >Robot code: </label>
                  <input className="form-control my-form-control" type="file" name="script" placeholder="robot_file" accept=".py" onChange={handleFileChange} />
                </div>
                <div >
                  <button className="my-btn" type='button' onClick={handleClick} >Go back to robots</button>
                  <button className="my-btn" type='submit'>Upload</button>
                </div>
                {error && <div className='alert-error' align="center"  >
                  <strong>Error: </strong> {error}
                </div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Upload;