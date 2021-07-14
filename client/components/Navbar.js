import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'

export default function Navbar () {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="/home">Lincoln Donations</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="/upload">Upload</Nav.Link>
                <Nav.Link href="/donations">Donation</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    )
}