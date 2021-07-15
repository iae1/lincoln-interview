import React from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
// import Container from 'react-bootstrap/Container'
// import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'

export default function Navigation () {
    return (
      // <div className="navigation_background">
      //   <nav className="navigation__nav">
      //     <Link to="/" className="navigation__link">
      //       Home
      //     </Link>
      //     <Link to="/upload" className="navigation__link">
      //       Upload
      //     </Link>
      //     <Link to="/donations" className="navigation__link">
      //       Donations
      //     </Link>
      //   </nav>
      // </div>
      
        <Navbar bg="dark" variant="dark">
            <Container>
            <LinkContainer to="/"><Navbar.Brand >Lincoln Donations</Navbar.Brand></LinkContainer>
            <Nav className="me-auto">
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/upload">
                  <Nav.Link>Upload</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/donations">
                  <Nav.Link >Donations</Nav.Link>
                </LinkContainer>
            </Nav>
            </Container>
        </Navbar>
    )
}