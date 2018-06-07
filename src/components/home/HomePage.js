// Was App.js
import React from 'react';
import { Button, Glyphicon, OverlayTrigger, Image } from 'react-bootstrap';
import { Link } from 'react-router';
import './App.css';
import homeImage from '../images/DceLogo_dash_thin2.png';
import * as tooltips from './HomePageToolTips';

const HomePage = () => {
  return (
    <div className="App container">
      <div className="jumbotron">
        <Image src={homeImage} alt="logo" rounded responsive />
        <div className="row">
          <div className="col-md-4">
            <Link to="./Convert">
              <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={tooltips.convertTip}>
                <Button className="homeButton" bsStyle="primary" bsSize="large">Convert
                  <p><Glyphicon className="homePageGlyphicon" glyph="refresh" /></p>
                </Button>
              </OverlayTrigger>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="./Metrics">
              <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={tooltips.metricsTip}>
                <Button className="homeButton" bsStyle="primary" bsSize="large">Metrics
                  <p><Glyphicon className="homePageGlyphicon" glyph="signal" /></p>
                </Button>
              </OverlayTrigger>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="./Utilities">
              <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={tooltips.utilitiesTip}>
                <Button className="homeButton" bsStyle="primary" bsSize="large">Utilities
                  <p><Glyphicon className="homePageGlyphicon" glyph="cog" /></p>
                </Button>
              </OverlayTrigger>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
