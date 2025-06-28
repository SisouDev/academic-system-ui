import { CardGrid } from './CardGrid';

type SubjectCardData = {
    id: number;
    title: string;
    content: string;
};

type CourseCardGroupProps = {
    title: string;
    subjects: SubjectCardData[];
};

export function CourseCardGroup({ title, subjects }: CourseCardGroupProps) {
    if (!subjects || subjects.length === 0) {
        return null;
    }

    return (
        <section className="uk-margin-large-bottom">

            <h2 className="uk-heading-divider uk-margin-medium-bottom">{title}</h2>

            <CardGrid items={subjects} />

        </section>
    );
}