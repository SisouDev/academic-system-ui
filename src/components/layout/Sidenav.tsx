import { NavLink, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth/AuthContext';
import {
    LayoutDashboard,
    BookCopy,
    GraduationCap,
    UserCheck,
    Settings,
    Users,
    BookOpenText,
    Building2, LifeBuoy
} from 'lucide-react';

const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: 'var(--bs-body-color)',
    transition: 'background-color 0.2s ease-in-out',
};

const activeNavLinkStyle = {
    ...navLinkStyle,
    fontWeight: '600',
    color: 'var(--bs-primary)',
    backgroundColor: 'var(--bs-primary-subtle)',
};


export const Sidenav = () => {
    const { user } = useAuthContext();

    return (
        <nav className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary shadow-sm" style={{ width: '280px' }}>
            <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none">
                <Building2 size={32} className="me-2" />
                <span className="fs-4" style={{ fontFamily: 'Raleway, sans-serif' }}>AcademicSystem</span>
            </Link>
            <hr />

            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <NavLink to="/dashboard" style={({isActive}) => isActive ? activeNavLinkStyle : navLinkStyle}>
                        <LayoutDashboard size={20} className="me-3" />
                        Meu Painel
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/my-support-tickets" style={({isActive}) => isActive ? activeNavLinkStyle : navLinkStyle}>
                        <LifeBuoy size={20} className="me-3" />
                        Suporte Técnico
                    </NavLink>
                </li>

                {user?.roles.includes('ROLE_STUDENT') && (
                    <>
                        <li className="nav-item">
                            <NavLink to="/my-subjects" style={({isActive}) => isActive ? activeNavLinkStyle : navLinkStyle}><BookOpenText size={20} className="me-3" />Minhas Matérias</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/grades" style={({isActive}) => isActive ? activeNavLinkStyle : navLinkStyle}><GraduationCap size={20} className="me-3" />Minhas Notas</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/attendance" style={({isActive}) => isActive ? activeNavLinkStyle : navLinkStyle}><UserCheck size={20} className="me-3" />Minha Frequência</NavLink>
                        </li>
                    </>
                )}

                {user?.roles.includes('ROLE_TEACHER') && (
                    <>
                        <li className="nav-item">
                            <NavLink to="/my-classes" style={({isActive}) => isActive ? activeNavLinkStyle : navLinkStyle}><BookCopy size={20} className="me-3" />Minhas Turmas</NavLink>
                        </li>
                    </>
                )}

                {user?.roles.includes('ROLE_ADMIN') && (
                    <>
                        <li className="nav-item mt-3">
                            <small className="text-muted ps-3">ADMINISTRAÇÃO</small>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/users" style={({isActive}) => isActive ? activeNavLinkStyle : navLinkStyle}><Users size={20} className="me-3" />Gerenciar Usuários</NavLink>
                        </li>
                    </>
                )}
            </ul>
            <hr />

            <div className="nav-item">
                <NavLink to="/settings" style={({isActive}) => isActive ? activeNavLinkStyle : navLinkStyle}>
                    <Settings size={20} className="me-3"/>
                    Configurações
                </NavLink>
            </div>
        </nav>
    );
};