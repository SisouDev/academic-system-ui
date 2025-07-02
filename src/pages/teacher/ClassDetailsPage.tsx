import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
    _embedded?: { classlistStudentDtoList: ApiStudent[] };
};

const fetchEnrolledStudents = async (courseSectionId: string): Promise<EnrolledStudent[]> => {
    const response = await api.get<ApiResponse>(`/api/v1/enrollments/by-section/${courseSectionId}`);

    return response.data._embedded?.classlistStudentDtoList.map(item => ({
        ...item,
        id: item.enrollmentId,
    })) || [];
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
            }
        },
    ];

    const renderActions = (student: EnrolledStudent) => (
        <div className="uk-button-group">
            <Button size="small" title="Lançar Notas/Ver Histórico"><FiBarChart2 /></Button>
            <Button size="small" title="Registrar Frequência"><FiCheckSquare /></Button>
            <Button size="small" title="Ver/Adicionar Anotações" onClick={() => openNotesModal(student)}>
                <FiEdit />
            </Button>
        </div>
    );

    return (
        <div className="page-container">
            <PageHeader title="Alunos da Turma" />
            <div className="page-content-card">
                {isError && <div className="uk-alert-danger">Erro ao carregar a lista de alunos.</div>}
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