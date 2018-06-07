import React, { PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import dce from './images/Logo_dash.png';
import img from '';
import './Header.css';

const Header = ({ environment }) => {
    return (
        <div>
            <div className='row divbar'>
                <a href="[SERVER_NAME]">
                    <div className='col-md-1 col-md-offset-1'><img src="" alt="logo" />
                    </div>
                </a>
                <div className='col-md-4 col-md-offset-4' style={{ display: "inline-block", marginTop: "1.5%", direction: "rtl" }}>Your current environment: <strong>{environment.lifecycle}</strong></div>
            </div>
            <Navbar collapseOnSelect className="navbar navbar-default navbar-static-top">
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="./"><img src={dce} alt="logo" /></a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="./convert">
                            <NavItem eventKey={1}>Convert</NavItem>
                        </LinkContainer>
                        <LinkContainer to="./metrics">
                            <NavItem eventKey={2}>Metrics</NavItem>
                        </LinkContainer>
                        <LinkContainer to="./utilities">
                            <NavItem eventKey={3}>Utilities</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavDropdown eventKey={5} title="Help" id="basic-nav-dropdown">
                            <MenuItem eventKey={5.1} href="[SERVER_NAME]">User Guide</MenuItem>
                        </NavDropdown>
                        <NavDropdown eventKey={6} title="Contacts" id="basic-nav-dropdown">
                            <MenuItem eventKey={6.1} href="[EMAIL_ADDRESS]">App Support</MenuItem>
                            <MenuItem eventKey={6.2} href="[EMAIL_ADDRESS]">Dev Support</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={6.3} href="[EMAIL_ADDRESS]">Contact Neo</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

Header.propTypes = {
    environment: PropTypes.object.isRequired
}

export default Header;



