import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../avatar';
import UIkit from 'uikit';

const navLinks = [
    { path: '/', label: 'Painel Principal', icon: 'home' },
    { path: '/alunos', label: 'Alunos', icon: 'users', adminOnly: true },
    { path: '/professores', label: 'Professores', icon: 'user', adminOnly: true },
];

export function OffCanvasMenu() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        UIkit.offcanvas('#offcanvas-nav').hide();
        logout();
    };

    const handleNavigate = (path: string) => {
        UIkit.offcanvas('#offcanvas-nav').hide();
        navigate(path);
    };

    return (
        <>
            <a className="uk-navbar-toggle" href="#" data-uk-toggle="target: #offcanvas-nav">
                <span data-uk-icon="icon: menu"></span>
            </a>
            <div id="offcanvas-nav" data-uk-offcanvas="overlay: true">
                <div className="uk-offcanvas-bar">
                    {user && (
                        <div className="uk-flex uk-flex-middle uk-padding-small uk-light">
                            <Avatar name={user.fullName} size="medium" />
                            <div className="uk-margin-left">
                                <div className="uk-text-bold">{user.fullName}</div>
                                <div className="uk-text-meta">{user.roles.join(', ').replace('ROLE_', '')}</div>
                            </div>
                        </div>
                    )}

                    <hr />

                    <ul className="uk-nav uk-nav-default">
                        {navLinks.map(link => {
                            const isAdminOnly = link.adminOnly ?? false;
                            const hasAdminRole = user?.roles.includes('ROLE_ADMIN') ?? false;

                            if (isAdminOnly && !hasAdminRole) {
                                return null;
                            }

                            return (
                                <li key={link.path}>
                                    <a onClick={() => handleNavigate(link.path)}>
                                        <span className="uk-margin-small-right" data-uk-icon={`icon: ${link.icon}`}></span>
                                        {link.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="uk-position-bottom uk-padding-small">
                        <ul className="uk-nav uk-nav-default">
                            {user && (
                                <li>
                                    <Link to={`/perfil/${user.id}`} onClick={() => UIkit.offcanvas('#offcanvas-nav').hide()}>
                                        <span className="uk-margin-small-right" data-uk-icon="icon: user"></span>
                                        Meu Perfil
                                    </Link>
                                </li>
                            )}
                            <li>
                                <a onClick={handleLogout}>
                                    <span className="uk-margin-small-right" data-uk-icon="icon: sign-out"></span>
                                    Sair
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}