import { useNavigate } from 'react-router-dom';


type SubjectInfo = {
    id: number;
    name: string;
};

type CourseInfoCardProps = {
    courseId: number;
    courseName: string;
    subjects: SubjectInfo[];
};

export function CourseInfoCard({ courseId, courseName, subjects }: CourseInfoCardProps) {
    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate(`/cursos/${courseId}`);
    };

    return (
        // O card em si
        <div className="uk-card uk-card-default uk-card-hover uk-card-body">

            <h3 className="uk-card-title uk-margin-small-bottom">{courseName}</h3>

            <p className="uk-text-meta uk-margin-remove-top">
                {subjects.length} {subjects.length === 1 ? 'disciplina' : 'disciplinas'} neste curso.
            </p>

            <ul className="uk-list uk-list-striped uk-margin-top">
                {subjects.slice(0, 4).map(subject => (
                    <li key={subject.id}>{subject.name}</li>
                ))}
                {subjects.length > 4 && (
                    <li className="uk-text-meta">... e mais {subjects.length - 4}.</li>
                )}
            </ul>

            <div className="uk-text-right uk-margin-top">
                <button
                    className="uk-button uk-button-primary uk-button-small"
                    onClick={handleDetailsClick}
                >
                    Ver Detalhes
                </button>
            </div>

        </div>
    );
}