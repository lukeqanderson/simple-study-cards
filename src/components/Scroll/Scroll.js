import React from "react";

// implements a scroll feature for lists
const Scroll = (props) => {
    return (
        <div style={{
            overflowY: 'scroll', maxHeight: '400px'
        }}>
            {props.children}
        </div >
    );
}

export default Scroll;