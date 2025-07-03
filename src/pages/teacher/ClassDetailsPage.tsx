import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../services/api';
import { PageHeader } from '../../components/pageheader';
import { DataTable, type ColumnDef } from '../../components/datatable';
import { FiEdit, FiCheckSquare, FiBarChart2 } from 'react-icons/fi';
import { Button } from '../../components/button';
import { TeacherNotesModal } from '../../components/teacher/TeacherNotesModal';
import UIkit from 'uikit';


type ApiStudent = {
    enrollmentId: number;
    studentId: number;
    studentName: string;
    studentEmail: string;
    status: string;
};

type EnrolledStudent = {
    id: number;
    studentId: number;
    studentName: string;
    studentEmail: string;
    status: string;
};

type ApiResponse = {
    _embedded?: { classListStudentDtoList: ApiStudent[] };
};


const fetchEnrolledStudents = async (courseSectionId: string): Promise<EnrolledStudent[]> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.get<ApiResponse>(`/api/v1/enrollments/by-section/${courseSectionId}`);


        const dtoList = response.data._embedded?.classListStudentDtoList;

        if (!dtoList) {
            return [];
        }

        return dtoList.map(apiItem => ({
            id: apiItem.enrollmentId,
            studentId: apiItem.studentId,
            studentName: apiItem.studentName,
            studentEmail: apiItem.studentEmail,
            status: apiItem.status,
        }));
    } catch (err) {

        throw err;
    }
};

function ClassDetails() {
    const { courseSectionId } = useParams<{ courseSectionId: string }>();
    const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);

    const { data: students, isLoading, isError } = useQuery({
        queryKey: ['enrolledStudents', courseSectionId],
        queryFn: () => fetchEnrolledStudents(courseSectionId!),
        enabled: !!courseSectionId,
    });

    const openNotesModal = (student: EnrolledStudent) => {
        setSelectedStudent(student);
        UIkit.modal("#notes-modal").show();
    };

    const columns: ColumnDef<EnrolledStudent>[] = [
        { key: 'studentName', label: 'Nome do Aluno' },
        { key: 'studentEmail', label: 'Email' },
        {
            key: 'status',
            label: 'Status da Matrícula',
            render: (s) => {
                const isActive = s.status?.toUpperCase() === 'ACTIVE';
                return (
                    <span className={`uk-label uk-label-${isActive ? 'success' : 'warning'}`}>
                        {isActive ? 'Ativo' : 'Outro'}
                    </span>
                );
            },
        },
    ];

    const renderActions = (student: EnrolledStudent) => (
        <div className="uk-button-group">
            <Link to={`/teacher/class/${courseSectionId}/grades/${student.id}`}>
                <Button size="small" title="Lançar Notas"><FiBarChart2 /></Button>
            </Link>
            <Button size="small" title="Registrar Frequência"><FiCheckSquare /></Button>
            <Button size="small" title="Anotações" onClick={() => openNotesModal(student)}>
                <FiEdit />
            </Button>
        </div>
    );

    return (
        <div className="page-container">
            <PageHeader title="Alunos da Turma" />
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