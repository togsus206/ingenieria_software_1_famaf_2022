import React, { useRef, useEffect, useState } from "react";
import '../../css/Simulation.css';

const colors = ["red", "green", "blue", "yellow"];

const winnersInSimu = (robots) => {
    let winners = [];

    for (let i = 0; i < robots.length; i++){
        if(robots[i].life > 0){
            winners.push(robots[i].id)
        }
    }

    if(winners.length === 0){
        return "Nobody has won!"
    }else if(winners.length > 1){
        return alert("the winners are " + winners);
    }else{
        return alert("the winners is " + winners);
    }
}

const drawRobots = (context, robot) => {
    context.beginPath()
    context.arc(robot.x, robot.y, 10, 0, Math.PI * 2);
    context.fillStyle = robot.color;
    context.fill();
    context.closePath();
}

const drawMissiles = (context, missiles) => {
    context.beginPath()
    context.arc(missiles.x, missiles.y, 5, 0, Math.PI * 2);
    context.fillStyle = missiles.color;
    context.fill();
    context.closePath();
}

let intervalId;
let roundNumber = 0;


function GameBoard(props) {
    const [canvasContext, setCanvasContext] = useState(null);
    const canvasRef = useRef(null);
    const [isFinished, setIsFinished] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 1000;
        canvas.height = 1000;
        const context = canvas.getContext("2d");
        setCanvasContext(context);

        if (props.data.rounds !== undefined) {
            roundNumber = 0;
            intervalId = setInterval(drawRound, 100, context, props.data.rounds);
        }
    }, [canvasRef, canvasContext, props.data.rounds]);

    const drawRound = (context, rounds) => {
        setIsFinished(false);
        context.clearRect(0, 0, 1000, 1000);
        for (let j = 0; j < rounds[roundNumber].robots.length; j++) {

            rounds[roundNumber].robots[j].life === 0 ? rounds[roundNumber].robots[j].color = "white" : rounds[roundNumber].robots[j].color = colors[j % rounds[roundNumber].robots.length]
            drawRobots(context, rounds[roundNumber].robots[j]);
            const robotBar = document.getElementById(rounds[roundNumber].robots[j].id)
            if(robotBar !== null){
                robotBar.style.width=`${rounds[roundNumber].robots[j].life}%`;
                robotBar.style.backgroundColor=colors[j % rounds[roundNumber].robots.length];

            }
        }

        for (let j = 0; j < rounds[roundNumber].missiles.length; j++) {
            let shooter = rounds[roundNumber].missiles[j].shooter;

            if(rounds[roundNumber].missiles[j].exploded === true){
                rounds[roundNumber].missiles[j].color = "black";
            }
            
            for (let index = 0; index < rounds[roundNumber].robots.length; index++) {
                if (rounds[roundNumber].robots[index].id === shooter){
                    rounds[roundNumber].missiles[j].color = rounds[roundNumber].robots[index].color
                }
            }

            drawMissiles(context, rounds[roundNumber].missiles[j]);
        }


        roundNumber++;
        if (roundNumber === rounds.length) {
            clearInterval(intervalId);
            setIsFinished(true);
            winnersInSimu(rounds[roundNumber-1].robots);
        }
    }

    return (
        <>
            <canvas id="gameBoard" ref={canvasRef} />
            {!isFinished && (props.data.rounds[0].robots.map((element) =>
                <div className="my-3" key={element.id}>
                    <label key={element.id}>{element.id}</label>
                    <div className="progress my-progress">
                        <div
                            id={element.id}
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            color="red"
                            aria-label="Animated striped example"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: `${element.life}%`, backgroundColor:"black"}}
                        />
                    </div>
                </div>
            ))}
        </>
    );
}

export default GameBoard;

GameBoard.defaultProps = {
    data: {},
};