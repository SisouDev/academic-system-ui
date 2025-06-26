import { Card } from './Card';

type CardItem = {
    id: number;
    title: string;
    content: string;
};

type CardGridProps = {
    items: CardItem[];
};

export function CardGrid({ items }: CardGridProps) {
    return (
        <div
            className="uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m"
            data-uk-grid
        >
            {items.map((item) => (
                <Card key={item.id} title={item.title} content={item.content} />
            ))}
        </div>
    );
}