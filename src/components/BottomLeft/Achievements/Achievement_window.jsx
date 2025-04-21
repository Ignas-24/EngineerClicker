import React from "react";
import "./Achievement_window.css"

const Achievement_window = ({ onClick }) =>{

    function handleClick() {
        onClick();
      }


    // TODO - paversti achivement warp i achievement klase  
    return (
        <div className="Backdrop">
            

            
            <div className="Window_Container">
            <button className="closeButton" onClick={handleClick}>X</button>

                <div className="Achievement_wrap">
                    <div className="Achievement">
                    <p>Welcome to the workforce!</p>
                    <button>Claim</button>
                    </div>
                <p>Complete 10 projects</p>
                </div>
                <div className="Achievement_wrap">
                    <div className="Achievement">
                    <p>Welcome to the workforce!</p>
                    <button>Claim</button>
                    </div>
                <p>Complete 10 projects</p>
                </div>
            </div>
        </div>
    );
};

export default Achievement_window;
