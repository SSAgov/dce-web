import React from 'react';
import { Grid } from 'react-bootstrap';

/*eslint-disable no-undef */
const Footer = () => {
        return (
            <Grid className="footer">
                <hr />
                <footer>
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3 text-center">
                            <p>Document Conversion Engine - Dashboard SSA.gov 2017 - Build Version {process.env.REACT_APP_VERSION}</p>
                        </div>
                    </div>
                </footer>
            </Grid>
        )
    }

export default Footer;