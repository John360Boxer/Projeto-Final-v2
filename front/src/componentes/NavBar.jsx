import '../styles/navbar.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function NavBar() {
    return (
        <>
            <Navbar className="custom-navbar" expand="lg">
                <Container>
                    <Navbar.Brand href="/home">RedEx</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/home">Perfil</Nav.Link>
                            <Nav.Link href="/home">Processo Seletivo</Nav.Link>
                            <NavDropdown title="Adicionar" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/home" className="nav-dropdown-item">Membro</NavDropdown.Item>
                                <NavDropdown.Item href="/addPost" className="nav-dropdown-item">
                                    Post
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="/home"><i className="bi bi-universal-access-circle"></i></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
