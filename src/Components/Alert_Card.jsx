import React from 'react';

const Alert_Card = ({ Header, Info, Type, onDecision }) =>{

    if(Type === 'RED')
        return(
            <div className="Alert">
                <div className="title-holder">
                    <span>{Header}</span>
                </div>
                <div className='info-holder'>
                    <span>{Info}</span>
                </div>
                <div className="button-holder">
                    <button  onClick={() => onDecision(false)}>Back</button>
                    <button  onClick={() => onDecision(true)}>Confirm</button>
                </div>
            </div>
        );

     if(Type === 'GREEN')
        return(
            <div className="Alert">
                <div className="title-holder">
                    <span>{Header}</span>
                </div>
            </div>
        );

}

export default Alert_Card;