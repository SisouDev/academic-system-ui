type CardProps = {
    title: string;
    content: string;
};

export function Card({ title, content }: CardProps) {
    return (
        <div>
            <div className="uk-card uk-card-default uk-card-body uk-card-hover">
                <h3 className="uk-card-title">{title}</h3>
                <p>{content}</p>
                <div className="uk-text-right">
                    <button className="uk-button uk-button-primary uk-button-small">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    );
}