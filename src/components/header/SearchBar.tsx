export function SearchBar() {
    return (
        <>
            <a className="uk-navbar-toggle" href="#" data-uk-search-icon></a>
            <div className="uk-drop" data-uk-drop="mode: click; pos: left-center; offset: 0">
                <form className="uk-search uk-search-navbar uk-width-1-1">
                    <input className="uk-search-input" type="search" placeholder="Search" autoFocus />
                </form>
            </div>
        </>
    );
}