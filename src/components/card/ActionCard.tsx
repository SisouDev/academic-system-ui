
type ActionCardProps = {
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
};

export function ActionCard({ icon, title, description, onClick, disabled = false }: ActionCardProps) {
    const cardClasses = [
        'uk-card',
        'uk-card-default',
        'uk-card-body',
        'uk-text-center',
        'uk-flex',
        'uk-flex-column',
        'uk-flex-middle',
        'app-action-card',
        disabled ? 'uk-disabled' : 'uk-card-hover'
    ].join(' ');

    return (
        <div onClick={!disabled ? onClick : undefined} className={cardClasses} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
            <span data-uk-icon={`icon: ${icon}; ratio: 2`}></span>
            <h4 className="uk-margin-small-top uk-margin-remove-bottom">{title}</h4>
            <p className="uk-text-small uk-text-muted uk-margin-remove-top">{description}</p>
        </div>
    );
}