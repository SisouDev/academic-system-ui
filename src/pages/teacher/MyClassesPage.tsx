import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader } from '../../components/pageheader';
import { FiBookOpen, FiUsers, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../hook/useAuth';


type TaughtClass = {
    id: number;
    name: string;
    subjectInfo: {
        subjectName: string;
        courseName: string;
    };
};

const fetchMyClasses = async (): Promise<TaughtClass[]> => {
    const response = await api.get('/api/v1/teachers/me/sections');
    return response.data || [];
};

function MyClasses() {
    const { fullName } = useAuth();

    const { data: classes, isLoading, isError } = useQuery<TaughtClass[], Error>({
        queryKey: ['myClasses'],
        queryFn: fetchMyClasses,
    });

    if (isLoading) {
        return <div className="uk-text-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
    }

    if (isError) {
        return <div className="uk-alert-danger" data-uk-alert><p>Ocorreu um erro ao carregar suas turmas.</p></div>;
    }

    return (
        <div className="page-container">
            <PageHeader title={`Bem-vindo(a), Prof. ${fullName || ''}`} description="Selecione uma de suas turmas abaixo para começar."/>

            <div className="page-content-card">
                {classes && classes.length > 0 ? (
                    <div className="uk-grid-match uk-child-width-1-2@s uk-child-width-1-3@m" data-uk-grid>
                        {classes.map(cls => (
                            <div key={cls.id}>
                                <div className="uk-card uk-card-default uk-card-hover uk-card-body">
                                    <div className="uk-card-badge uk-label">Em Andamento</div>
                                    <h3 className="uk-card-title uk-margin-remove-bottom">
                                        <FiBookOpen className="uk-margin-small-right" />
                                        {cls.subjectInfo.subjectName}
                                    </h3>
                                    <p className="uk-text-meta uk-margin-remove-top">{cls.name}</p>
                                    <p>Curso: {cls.subjectInfo.courseName}</p>
                                    <div className="uk-flex uk-flex-column uk-flex-left">
                                        {/* Link para a lista de alunos (próximo passo!) */}
                                        <Link to={`/teacher/class/${cls.id}/students`} className="uk-button uk-button-text uk-text-primary">
                                            <FiUsers className="uk-margin-small-right" /> Ver Alunos e Lançar Notas
                                        </Link>
                                        {/* Link para o plano de aula */}
                                        <Link to={`/teacher/class/${cls.id}/lesson-plan`} className="uk-button uk-button-text uk-margin-small-top">
                                            <FiFileText className="uk-margin-small-right" /> Gerenciar Plano de Aula
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Você não está alocado em nenhuma turma no período letivo atual.</p>
                )}
            </div>
        </div>
    );
}

const queryClient = new QueryClient();
export function MyClassesPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <MyClasses />
        </QueryClientProvider>
    );
}