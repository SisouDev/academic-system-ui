import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader } from '../../components/pageheader';
import { useAuth } from '../../hook/useAuth';
import { FiBook, FiUser } from 'react-icons/fi';


type Enrollment = {
    id: number;
    status: string;
    courseSectionInfo: {
        subjectName: string;
        courseName: string;
    };
    teacher: {
        id: number;
        fullName: string;
    };
};
type ApiResponse = { _embedded?: { enrollmentSummaryDtoList: Enrollment[] } };

const fetchMyEnrollments = async (): Promise<Enrollment[]> => {
    const response = await api.get<ApiResponse>('/api/v1/students/me/enrollments');
    return response.data._embedded?.enrollmentSummaryDtoList || [];
};

function StudentDashboard() {
    const { fullName } = useAuth();
    const { data: enrollments, isLoading, isError } = useQuery<Enrollment[], Error>({
        queryKey: ['myEnrollments'],
        queryFn: fetchMyEnrollments,
    });

    if (isLoading) return <div className="uk-text-center"><div data-uk-spinner></div></div>;
    if (isError) return <div className="uk-alert-danger">Erro ao carregar suas matrículas.</div>;

    return (
        <div className="page-container">
            <PageHeader title={`Bem-vindo(a), ${fullName || 'Aluno(a)'}!`} description="Aqui estão suas disciplinas matriculadas no período atual." />
            <div className="page-content">
                {enrollments && enrollments.length > 0 ? (
                    <div className="uk-grid-match uk-child-width-1-2@s uk-child-width-1-3@m" data-uk-grid>
                        {enrollments.map(enr => (
                            <div key={enr.id}>
                                <div className="uk-card uk-card-default uk-card-body uk-card-hover">
                                    <h3 className="uk-card-title uk-margin-remove-bottom">
                                        <FiBook className="uk-margin-small-right" />
                                        {enr.courseSectionInfo.subjectName}
                                    </h3>
                                    <p className="uk-text-meta uk-margin-remove-top">
                                        Curso: {enr.courseSectionInfo.courseName}
                                    </p>
                                    <p>
                                        <FiUser className="uk-margin-small-right" />
                                        Professor(a):
                                        {enr.teacher.id ? (
                                            <Link to={`/perfil/${enr.teacher.id}`} className="uk-link-text">
                                                {enr.teacher.fullName}
                                            </Link>
                                        ) : (
                                            <span>{enr.teacher.fullName}</span>
                                        )}
                                    </p>
                                    <Link to={`/student/class/${enr.id}/details`} className="uk-button uk-button-text">
                                        Ver notas e detalhes
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="uk-alert"><p>Você não está matriculado(a) em nenhuma disciplina no período atual.</p></div>
                )}
            </div>
        </div>
    );
}

const queryClient = new QueryClient();
export function StudentDashboardPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <StudentDashboard />
        </QueryClientProvider>
    );
}