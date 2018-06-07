import React, { Component } from 'react';
//import { } from 'react-bootstrap';
import utilities from '../Images/utilities.png'

class Utilities extends Component {
    render() {
        return (
            <div className="container">
                <div className="jumbotron">
                    <div style={{ marginLeft: "2%" }}>
                        <h2>Utilities are coming!</h2>
                        <img src={utilities} alt="Utilities" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Utilities;
