import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import LoadingIcon from './LoadingIcon';

import './NavBar.scss';

import logoPict from '../../assets/logo.png';

/**
 * Intérêt pédaogique : lien vers route, intégration react-router-dom et react-bootstrap,
 * utilisation d'une image en pure JS.
 */
function NavBar() {
  return (
    <Navbar expand="md" fixed="top" bg="dark" variant="dark" className="py-1">
      <Navbar.Brand as={Link} to="/">
        <img
          src={logoPict}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt={`${APP_ENV.APP_TITLE} Logo`}
        />
        {' '}
        {APP_ENV.APP_TITLE}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="DemoReactSymfonyNavbar" />
      <Navbar.Collapse id="DemoReactSymfonyNavbar" className="mr-auto">
        <Nav>
          <Nav.Link as={NavLink} to="/sql">Liste stricte (SQL)</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <LoadingIcon />
    </Navbar>
  );
}

export default NavBar;
