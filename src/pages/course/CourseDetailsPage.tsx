import { useParams, Link } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../services/api';
import { PageHeader } from '../../components/pageheader';

type Subject = {
    id: number;
    name: string;
    workloadHours: number;
    teacherId?: number;
    teacherName: string;
};


type CourseDetails = {
    id: number;
    name: string;
    description: string;
    durationInSemesters: number;
    department?: { name: string };
    subjects: Subject[];
};

const fetchCourseDetails = async (courseId: string): Promise<CourseDetails> => {
    const { data } = await api.get(`/api/v1/courses/${courseId}`);
    return data;
};

function CourseDetails() {
    const { courseId } = useParams<{ courseId: string }>();

    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['courseDetails', courseId],
        queryFn: () => fetchCourseDetails(courseId!),
        enabled: !!courseId,
    });

    if (isLoading) {
        return <div className="uk-flex uk-flex-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
    }

    if (isError || !course) {
        return <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar os detalhes do curso.</p></div>;
    }

    return (
        <div>
            <div className="uk-card uk-card-default uk-margin">
                <div className="uk-card-header">
                    <h3 className="uk-card-title"><span data-uk-icon="icon: info" /> Informações Gerais</h3>
                </div>
                <div className="uk-card-body">
                    <dl className="uk-description-list uk-description-list-divider">
                        <dt>Departamento</dt>
                        <dd>{course.department?.name ?? 'Não informado'}</dd>
                        <dt>Duração</dt>
                        <dd>{course.durationInSemesters} semestres</dd>
                        <dt>Descrição</dt>
                        <dd className="uk-text-normal">{course.description || 'Nenhuma descrição fornecida.'}</dd>
                    </dl>
                </div>
            </div>

            <div className="uk-card uk-card-default">
                <div className="uk-card-header">
                    <h3 className="uk-card-title"><span data-uk-icon="icon: list" /> Disciplinas do Curso</h3>
                </div>
                <div className="uk-card-body">
                    <div className="uk-overflow-auto">
                        <table className="uk-table uk-table-hover uk-table-striped uk-table-middle">
                            <thead>
                            <tr>
                                <th className="uk-width-expand">Nome da Disciplina</th>
                                <th className="uk-width-medium">Professor(a)</th>
                                <th className="uk-width-small uk-text-center">Carga Horária</th>
                            </tr>
                            </thead>
                            <tbody>
                            {course.subjects.map(subject => (
                                <tr key={subject.id}>
                                    <td>{subject.name}</td>
                                    <td>
                                        {subject.teacherId ? (
                                            <Link to={`/perfil/${subject.teacherId}`}>
                                                {subject.teacherName}
                                            </Link>
                                        ) : (
                                            <span className="uk-text-muted">{subject.teacherName}</span>
                                        )}
                                    </td>
                                    <td className="uk-text-center">{subject.workloadHours}h</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const queryClient = new QueryClient();
export function CourseDetailsPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const { data: course, isLoading } = useQuery({
        queryKey: ['courseDetails', courseId],
        queryFn: () => fetchCourseDetails(courseId!),
        enabled: !!courseId,
    });

    return (
        <QueryClientProvider client={queryClient}>
            <PageHeader title={isLoading ? 'Carregando...' : course?.name ?? 'Detalhes do Curso'}>
                <Link to="/" className="uk-button uk-button-default uk-border-rounded">
                    <span data-uk-icon="arrow-left" /> Voltar
                </Link>
            </PageHeader>
            <CourseDetails />
        </QueryClientProvider>
    )
}