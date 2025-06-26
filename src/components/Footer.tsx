export function Footer() {
    return (
        <footer className="uk-section uk-section-small uk-background-muted uk-text-center">
            <div className="uk-container">
                <p className="uk-text-meta">
                    Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd
                </p>
            </div>
        </footer>
    );
}