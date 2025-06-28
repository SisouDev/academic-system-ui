import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { PageHeader } from '../../components/pageheader';

type TeacherSummaryDto = {
    id: number;
    firstName: string;
    lastName: string;
};

type CourseSectionSummaryDto = {
    id: number;
    name: string;
    teacher: TeacherSummaryDto;
};

type SubjectDetailsDto = {
    id: number;
    name: string;
    workloadHours: number;
    courseSections: CourseSectionSummaryDto[];
};

type CourseDetailsDto = {
    id: number;
    name: string;
    description: string;
    durationInSemesters: number;
    department: { name: string; };
    subjects: { id: number; name: string; workloadHours: number; }[];
};

type EnrichedCourseDetails = Omit<CourseDetailsDto, 'subjects'> & {
    subjects: SubjectDetailsDto[];
};

const fetchEnrichedCourseDetails = async (courseId: string): Promise<EnrichedCourseDetails> => {
    const { data: courseData } = await api.get<CourseDetailsDto>(`/api/v1/courses/${courseId}`);

    if (!courseData.subjects || courseData.subjects.length === 0) {
        return { ...courseData, subjects: [] };
    }

    const subjectDetailsPromises = courseData.subjects.map(subjectSummary =>
        api.get<SubjectDetailsDto>(`/api/v1/subjects/${subjectSummary.id}`)
    );

    const subjectDetailsResponses = await Promise.all(subjectDetailsPromises);
    const detailedSubjects = subjectDetailsResponses.map(res => res.data);

    return { ...courseData, subjects: detailedSubjects };
};


export function CourseDetailsPage() {
    const { courseId } = useParams<{ courseId: string }>();

    const { data: course, isLoading, isError, error } = useQuery({
        queryKey: ['enrichedCourseDetails', courseId],
        queryFn: () => fetchEnrichedCourseDetails(courseId!),
        enabled: !!courseId,
    });

    const renderContent = () => {
        if (isLoading) {
            return <div className="uk-flex uk-flex-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
        }
        if (isError) {
            return (
                <div className="uk-alert-danger" data-uk-alert>
                    <p>Erro ao carregar os detalhes do curso: {error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'}</p>
                </div>
            );
        }
        if (course) {
            return (
                <div>
                    <div className="uk-card uk-card-default uk-margin">
                        <div className="uk-card-header">
                            <h3 className="uk-card-title"><span data-uk-icon="icon: info; ratio: 1.1" className="uk-margin-small-right"></span>Informações Gerais</h3>
                        </div>
                        <div className="uk-card-body">
                            <dl className="uk-description-list uk-description-list-divider">
                                <dt>Departamento</dt>
                                <dd>{course.department.name}</dd>
                                <dt>Duração</dt>
                                <dd>{course.durationInSemesters} semestres</dd>
                                <dt>Descrição</dt>
                                <dd className="uk-text-normal">{course.description || 'Nenhuma descrição fornecida.'}</dd>
                            </dl>
                        </div>
                    </div>

                    <div className="uk-card uk-card-default">
                        <div className="uk-card-header">
                            <h3 className="uk-card-title"><span data-uk-icon="icon: list; ratio: 1.1" className="uk-margin-small-right"></span>Disciplinas do Curso</h3>
                        </div>
                        <div className="uk-card-body">
                            <div className="uk-overflow-auto">
                                <table className="uk-table uk-table-hover uk-table-striped uk-table-middle custom-table">
                                    <thead>
                                    <tr>
                                        <th className="uk-width-expand">Nome da Disciplina</th>
                                        <th className="uk-width-medium">Professor(a)</th>
                                        <th className="uk-width-small uk-text-center">Carga Horária</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {course.subjects.map(subject => {
                                        const firstSection = subject.courseSections?.[0];
                                        const teacher = firstSection?.teacher;

                                        return (
                                            <tr key={subject.id}>
                                                <td>{subject.name}</td>
                                                <td>
                                                    {teacher ? (
                                                        <Link to={`/perfil/${teacher.id}`}>
                                                            {teacher.firstName} {teacher.lastName}
                                                        </Link>
                                                    ) : (
                                                        <span className="uk-text-muted">A definir</span>
                                                    )}
                                                </td>
                                                <td className="uk-text-center">{subject.workloadHours}h</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <PageHeader title={isLoading ? 'Carregando...' : course?.name || 'Detalhes do Curso'}>
                <Link to="/" className="uk-button uk-button-default uk-border-rounded">
                    <span data-uk-icon="arrow-left"></span>
                    <span className="uk-margin-small-left">Voltar ao Painel</span>
                </Link>
            </PageHeader>
            {renderContent()}
        </div>
    );
}