export function OffCanvasMenu() {
    return (
        <>
            <a className="uk-navbar-toggle" href="#" data-uk-toggle="target: #offcanvas-nav">
                <span data-uk-icon="icon: menu"></span>
            </a>
            <div id="offcanvas-nav" data-uk-offcanvas="overlay: true">
                <div className="uk-offcanvas-bar">
                    <ul className="uk-nav uk-nav-default">
                        <li><a href="#">Homepage</a></li>
                        <li><a href="#">Portfolio</a></li>
                        <li><a href="#">About</a></li>
                    </ul>
                </div>
            </div>
        </>
    );
}