import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuthContext } from '../../contexts/auth/AuthContext';

export const Topnav = () => {
    const { user, signOut } = useAuthContext();

    return (
        <Navbar bg="body-tertiary" className="border-bottom">
            <Container fluid>
                <Nav className="ms-auto">
                    <NavDropdown
                        title={
                            <div className="d-flex align-items-center">
                                <span className="me-2">Olá, {user?.fullName.split(' ')[0]}</span>
                                <User size={20} />
                            </div>
                        }
                        id="user-topnav-dropdown"
                        align="end"
                    >
                        <NavDropdown.Item as={Link} to="/profile">Meu Perfil</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={signOut} className="text-danger d-flex align-items-center">
                            <LogOut size={16} className="me-2"/>
                            Sair
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
};