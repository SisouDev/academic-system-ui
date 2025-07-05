import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { PageHeader } from '../../components/pageheader';


type Grade = { assessmentId?: number; score: number | null };
type StudentRow = { enrollmentId: number; studentName: string; grades: Record<string, Grade> };
type GradebookData = { headers: { assessmentDefinitionId: number; title: string }[], studentRows: StudentRow[] };


const fetchGradebook = async (courseSectionId: string): Promise<GradebookData> => {
    const { data } = await api.get(`/api/v1/gradebooks?courseSectionId=${courseSectionId}`);
    return data;
};

const saveGrade = async ({ enrollmentId, assessmentDefinitionId, score }: { enrollmentId: number, assessmentDefinitionId: number, score: number | null }) => {
    await api.post('/api/v1/assessments', {
        enrollmentId,
        assessmentDefinitionId,
        score,
        assessmentDate: new Date().toISOString().split('T')[0],
        type: 'EXAM'
    });
};

function Gradebook() {
    const { courseSectionId } = useParams<{ courseSectionId: string }>();
    const queryClient = useQueryClient();

    const { data: gradebook, isLoading } = useQuery({
        queryKey: ['gradebook', courseSectionId],
        queryFn: () => fetchGradebook(courseSectionId!),
        enabled: !!courseSectionId,
    });

    const { mutate: updateGrade } = useMutation({
        mutationFn: saveGrade,
        onSuccess: () => toast.success("Nota salva!"),
        onError: () => toast.error("Erro ao salvar nota."),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['gradebook', courseSectionId] });
        }
    });

    const handleGradeChange = (enrollmentId: number, assessmentDefinitionId: number, score: string) => {
        const numericScore = parseFloat(score);
        if (!isNaN(numericScore) || score === '') {
            updateGrade({ enrollmentId, assessmentDefinitionId, score: score === '' ? null : numericScore });
        }
    };

    if (isLoading) return <div className="uk-text-center"><div data-uk-spinner></div></div>;

    return (
        <div className="page-container">
            <PageHeader title="Lançamento de Notas" />
            <div className="page-content-card uk-overflow-auto">
                <table className="uk-table uk-table-hover uk-table-striped uk-table-middle">
                    <thead>
                    <tr>
                        <th className="uk-table-shrink">Aluno</th>
                        {gradebook?.headers.map(header => (
                            <th key={header.assessmentDefinitionId} className="uk-text-center">{header.title}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {gradebook?.studentRows.map(student => (
                        <tr key={student.enrollmentId}>
                            <td>{student.studentName}</td>
                            {gradebook.headers.map(header => (
                                <td key={header.assessmentDefinitionId}>
                                    <input
                                        type="number"
                                        className="uk-input uk-form-small uk-text-center"
                                        defaultValue={student.grades[header.assessmentDefinitionId]?.score ?? ''}
                                        onBlur={(e) => handleGradeChange(student.enrollmentId, header.assessmentDefinitionId, e.target.value)}
                                        step="0.1" min="0" max="10"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const queryClient = new QueryClient();
export function GradebookPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <Gradebook />
        </QueryClientProvider>
    )
}