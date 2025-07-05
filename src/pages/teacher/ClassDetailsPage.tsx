import {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../../services/api';
import {PageHeader} from '../../components/pageheader';
import {type ColumnDef, DataTable} from '../../components/datatable';
import {FiBarChart2, FiEdit, FiUserCheck, FiUserX} from 'react-icons/fi';
import {Button} from '../../components/button';
import {TeacherNotesModal} from '../../components/teacher/TeacherNotesModal';
import {toast} from 'react-hot-toast';

type ApiStudent = {
    enrollmentId: number;
    studentId: number;
    studentName: string;
    studentEmail: string;
    status: string;
    todaysAttendance: 'PRESENT' | 'ABSENT' | 'UNDEFINED';
};

type EnrolledStudent = {
    id: number;
    studentId: number;
    studentName: string;
    studentEmail: string;
    status: string;
    todaysAttendance: 'PRESENT' | 'ABSENT' | 'UNDEFINED';
};

type ApiResponse = {
    _embedded?: { classListStudentDtoList: ApiStudent[] };
};

const fetchEnrolledStudents = async (courseSectionId: string): Promise<EnrolledStudent[]> => {
    const response = await api.get<ApiResponse>(`/api/v1/enrollments/by-section/${courseSectionId}`);
    return response.data._embedded?.classListStudentDtoList.map(item => ({
        ...item,
        id: item.enrollmentId,
    })) || [];
};

const recordAttendanceRequest = async ({ enrollmentId, wasPresent }: { enrollmentId: number, wasPresent: boolean }) => {
    const payload = { enrollmentId, wasPresent, date: new Date().toISOString().split('T')[0] };
    await api.post('/api/v1/enrollments/attendance', payload);
};

function ClassDetails() {
    const { courseSectionId } = useParams<{ courseSectionId: string }>();
    const queryClient = useQueryClient();
    const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);

    const { data: students, isLoading, isError } = useQuery({
        queryKey: ['enrolledStudents', courseSectionId],
        queryFn: () => fetchEnrolledStudents(courseSectionId!),
        enabled: !!courseSectionId,
    });

    const { mutate: recordAttendance, isPending: isRecording } = useMutation({
        mutationFn: recordAttendanceRequest,
        onSuccess: () => {
            toast.success("Frequência registrada!");
            queryClient.invalidateQueries({ queryKey: ['enrolledStudents', courseSectionId] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Erro ao registrar frequência.");
        }
    });

    // Esta função agora SÓ muda o estado. O React cuida do resto.
    const openNotesModal = (student: EnrolledStudent) => {
        setSelectedStudent(student);
    };

    const columns: ColumnDef<EnrolledStudent>[] = [
        { key: 'studentName', label: 'Nome do Aluno' },
        { key: 'studentEmail', label: 'Email' },
        {
            key: 'status',
            label: 'Status da Matrícula',
            render: (s) => {
                const isActive = s.status?.toUpperCase() === 'ACTIVE';
                return <span className={`uk-label uk-label-${isActive ? 'success' : 'warning'}`}>{isActive ? 'Ativo' : 'Outro'}</span>;
            },
        },
    ];

    const renderActions = (student: EnrolledStudent) => (
        <div className="uk-button-group">
            <Link to={`/teacher/class/${courseSectionId}/grades`}>
                <Button size="small" variant="default" title="Lançar Notas"><FiBarChart2 /></Button>
            </Link>
            <Button
                size="small"
                variant={student.todaysAttendance === 'PRESENT' ? 'success' : 'default'}
                title="Marcar Presença"
                onClick={() => recordAttendance({ enrollmentId: student.id, wasPresent: true })}
                disabled={isRecording}
            >
                <FiUserCheck />
            </Button>
            <Button
                size="small"
                variant={student.todaysAttendance === 'ABSENT' ? 'danger' : 'default'}
                title="Marcar Falta"
                onClick={() => recordAttendance({ enrollmentId: student.id, wasPresent: false })}
                disabled={isRecording}
            >
                <FiUserX />
            </Button>
            <Button
                size="small"
                variant="default"
                title="Anotações"
                onClick={() => openNotesModal(student)}
            >
                <FiEdit />
            </Button>
        </div>
    );

    return (
        <div className="page-container">
            <PageHeader title="Diário de Classe" />
            <div className="page-content-card">
                {isError && <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar a lista de alunos.</p></div>}
                <DataTable
                    columns={columns}
                    data={students || []}
                    renderActions={renderActions}
                    isLoading={isLoading}
                    emptyMessage="Nenhum aluno matriculado nesta turma."
                />
            </div>

            {/* A renderização condicional agora é a única responsável por mostrar/esconder o modal */}
            {selectedStudent && (
                <TeacherNotesModal
                    enrollmentId={selectedStudent.id}
                    studentName={selectedStudent.studentName}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
}

const queryClient = new QueryClient();

export function ClassDetailsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <ClassDetails />
        </QueryClientProvider>
    );
}