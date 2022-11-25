import { useEffect } from 'react'
import { deleteToken } from '../../helpers/Auth'
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        deleteToken();
        navigate("/");
    });
}

export default Logout;