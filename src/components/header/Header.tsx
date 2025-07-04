import { Heading } from '../Heading';
import { SchoolIcon } from 'lucide-react';
import * as React from 'react';

import { Link } from 'react-router-dom';
import { OffCanvasMenu } from './OffCanvasMenu';
import { SearchBar } from './SearchBar';
import { NotificationBell } from './NotificationBell';

type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function Header({ className, ...props }: HeaderProps) {
    return (
        <div className="uk-navbar-container app-header" {...props}>
            <nav className={`uk-container ${className}`} data-uk-navbar>

                <div className="uk-navbar-left">
                    <OffCanvasMenu />
                </div>

                <div className="uk-navbar-center">
                    <Link to="/" className="header-title-link">
                        <Heading level={1} className="uk-margin-remove-vertical" icon={<SchoolIcon size={30} />}>
                            Gestão Acadêmica
                        </Heading>
                    </Link>
                </div>

                <div className="uk-navbar-right">
                    <SearchBar />
                    <NotificationBell />
                </div>

            </nav>
        </div>
    );
}