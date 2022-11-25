import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import GameBoard from './GameBoard';

function Simulation() {

    const [rounds, setRounds] = useState(0);
    const [listRobots, setListRobots] = useState([])
    const [robots, setRobots] = useState([]);
    const [dataRounds, setDataRounds] = useState({});
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [show, setShow] = useState(false);

    const handleRounds = (event) => {
        setRounds(event.target.value);
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/robots`)
            .then(response => {
                setListRobots(response.data.robots);
            })
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage('');
        setError('')

        if (robots.length === 0) {
            setMessage('you must select at least one robot')
        }

        if (rounds === 0 || rounds > 200) {
            setMessage('please enter a number between 1 and 200')
        }

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/simulation`, {
            robots: robots,
            rounds: rounds,
        }).then(response => {
            setDataRounds(response.data);
            setShow(!show);
        }).catch(error => {
            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError('Server error');
            }

        })

    }

    const handleChecked = useCallback((event, id) => {
        if (event.target.checked) {
            setRobots(value => [...value, id])
        } else {
            setRobots(value => value.filter(it => it !== id))
        }
    }, [setRobots])

    return (
        <>
            <h2 className="mx-3 my-2">Simulation</h2>
            <div className='conteiner my-conteiner px-3'>
                <form>
                    <div>
                        <label className="form-label" >Number of rounds: </label>
                        <input className="form-control my-form-control" type='number' onChange={handleRounds} data-testid="rounds" />
                    </div>
                    <div>
                        <label className="form-label mt-3" data-testid="robots" >Select up to four robots:</label>
                        {listRobots.map((robot, index) => (
                            <div className="ms-2" key={index}>
                                <input
                                    type='checkbox'
                                    key={robot.id}
                                    id={robot.id}
                                    value={robot.name}
                                    onChange={(event) => handleChecked(event, robot.id)}
                                    data-testid={`checkbox_${robot.name}`}
                                />
                                <label className="form-label ms-2" key={robot.name}>{robot.name}</label>
                            </div>
                        ))}
                    </div>
                    <button className="my-btn mt-4" onClick={handleSubmit} data-testid="btnStartSimulation" >Start simulation</button>
                    <div className="mb-3">
                        {message ? <p>{message}</p> : null}
                        <p>{error}</p>
                    </div>
                </form>
                <div>
                    <GameBoard data={dataRounds} />
                </div>
            </div>
        </>
    )
}

export default Simulation;