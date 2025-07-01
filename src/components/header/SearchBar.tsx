import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <div className="uk-navbar-item">
            <a className="uk-navbar-toggle" href="#" data-uk-search-icon></a>
            <div className="uk-drop" data-uk-drop="mode: click; pos: left-center; offset: 0">
                <form
                    className="uk-search uk-search-navbar uk-width-1-1"
                    onSubmit={handleSearchSubmit}
                >
                    <input
                        className="uk-search-input"
                        type="search"
                        placeholder="Buscar pessoas..."
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
}