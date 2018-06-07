import React, { Component } from 'react';
//import { } from 'react-bootstrap';
import metrics from '../Images/metrics.jpg'

class Metrics extends Component {
    render() {
        return (
            <div className="container">
        <div className="jumbotron">
                <div style={{marginLeft: "2%"}}>
                <h2>Reports are coming!</h2>
                <img src={metrics} alt="metrics"/>
                </div>
            </div>
            </div>
        );
    }
}

export default Metrics;
