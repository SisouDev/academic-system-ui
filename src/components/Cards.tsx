const AppCard = ({ title, content }: { title: string, content: string }) => (
    <div>
        <div className="uk-card uk-card-default uk-card-body uk-card-hover">
            <h3 className="uk-card-title">{title}</h3>
            <p>{content}</p>
            <div className="uk-text-right">
                <button className="uk-button uk-button-primary uk-button-small">Buy Now</button>
            </div>
        </div>
    </div>
);


export function Cards() {
    return (
        <div
            className="uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m"
            data-uk-grid
        >
            <AppCard title="Card 1" content="Conteúdo do card" />
            <AppCard title="Card 2" content="Lorem" />
            <AppCard title="Card 3" content="Conteúdo do card" />
        </div>
    );
}