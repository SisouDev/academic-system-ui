import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader } from '../../components/pageheader';
import { FiX } from 'react-icons/fi';

type Assessment = { id: number; score: number; assessmentDate: string; type: string; title: string; };
type Attendance = { id: number; date: string; wasPresent: boolean; };
type EnrollmentDetailsData = {
    courseSection: { subjectInfo: { subjectName: string } };
    assessments: Assessment[];
    attendanceRecords: Attendance[];
    totalAbsences: number;
};

const fetchEnrollmentDetails = async (enrollmentId: string): Promise<EnrollmentDetailsData> => {
    const { data } = await api.get(`/api/v1/enrollments/${enrollmentId}`);
    return data;
};

function EnrollmentDetails() {
    const { enrollmentId } = useParams<{ enrollmentId: string }>();
    const { data, isLoading, isError } = useQuery({
        queryKey: ['enrollmentDetails', enrollmentId],
        queryFn: () => fetchEnrollmentDetails(enrollmentId!),
        enabled: !!enrollmentId,
    });

    if (isLoading) return <div className="uk-text-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
    if (isError) return <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar detalhes da matrícula.</p></div>;

    return (
        <div className="page-container">
            <PageHeader title={data?.courseSection.subjectInfo.subjectName || 'Detalhes da Disciplina'} />
            <div className="uk-grid-large" data-uk-grid>
                <div className="uk-width-2-3@m">
                    <div className="uk-card uk-card-default uk-card-body">
                        <h3 className="uk-card-title">Minhas Notas</h3>
                        <table className="uk-table uk-table-striped uk-table-middle uk-table-responsive">
                            <thead>
                            <tr>
                                <th>Avaliação</th>
                                <th>Tipo</th>
                                <th>Data</th>
                                <th className="uk-text-right">Nota</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.assessments.map(asm => (
                                <tr key={asm.id}>
                                    <td>{asm.title}</td>
                                    <td><span className="uk-badge">{asm.type}</span></td>
                                    <td>{new Date(asm.assessmentDate + 'T00:00:00').toLocaleDateString()}</td>
                                    <td className="uk-text-right uk-text-bold">{asm.score.toFixed(1)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {data?.assessments.length === 0 && <p>Nenhuma nota lançada até o momento.</p>}
                    </div>
                </div>
                <div className="uk-width-1-3@m">
                    <div className="uk-card uk-card-default uk-card-body">
                        <h3 className="uk-card-title">Frequência</h3>
                        <p className="uk-text-lead">Total de Faltas: {data?.totalAbsences}</p>
                        <ul className="uk-list uk-list-divider">
                            {data?.attendanceRecords.filter(att => !att.wasPresent).map(att => (
                                <li key={att.id}>
                                    <FiX className="uk-text-danger uk-margin-small-right" />
                                    Falta no dia {new Date(att.date + 'T00:00:00').toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

const queryClient = new QueryClient();
export function EnrollmentDetailsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <EnrollmentDetails />
        </QueryClientProvider>
    );
}