import { Link, useSearchParams } from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../../services/api';
import { DataTable, type ColumnDef } from '../../components/datatable';
import { Button } from '../../components/button';
import { useAuth } from '../../hook/useAuth';
import { FiEdit, FiPlus, FiPower } from 'react-icons/fi';
import UIkit from 'uikit';
import { toast } from 'react-hot-toast';

type Teacher = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE';
    academicBackground?: string;
};

type ApiResponse = {
    _embedded?: { teacherSummaryDtoList: Teacher[] };
};

const fetchTeachers = async (searchTerm: string): Promise<Teacher[]> => {
    const response = await api.get<ApiResponse>('/api/v1/teachers', {
        params: { searchTerm, size: 200 }
    });
    return response.data._embedded?.teacherSummaryDtoList || [];
};

const updateTeacherStatus = async ({ teacherId, status }: { teacherId: number, status: 'ACTIVE' | 'INACTIVE' }) => {
    await api.patch(`/api/v1/teachers/${teacherId}/status`, { status });
};

export function TeacherListPage() {
    const { roles } = useAuth();
    const isAdmin = roles.includes('ROLE_ADMIN');
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const queryClient = useQueryClient();

    const { data: teachers, isLoading, isError } = useQuery({
        queryKey: ['teachers', searchTerm],
        queryFn: () => fetchTeachers(searchTerm),
    });

    const { mutate: toggleStatusMutation } = useMutation({
        mutationFn: updateTeacherStatus,
        onSuccess: () => {
            toast.success('Status do professor alterado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
        onError: () => toast.error('Erro ao alterar o status.'),
    });

    const handleToggleStatus = (teacher: Teacher) => {
        const newStatus = teacher.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const actionText = newStatus === 'ACTIVE' ? 'ativar' : 'desativar';
        const fullName = `${teacher.firstName} ${teacher.lastName}`;

        UIkit.modal.confirm(`Tem certeza que deseja ${actionText} o professor(a) ${fullName}?`).then(() => {
            toggleStatusMutation({ teacherId: teacher.id, status: newStatus });
        }, () => {});
    };

    const columns: ColumnDef<Teacher>[] = [
        {
            key: 'firstName',
            label: 'Nome Completo',
            render: (teacher) => `${teacher.firstName} ${teacher.lastName}`
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'status',
            label: 'Status',
            render: (teacher) => {
                const statusUpper = teacher.status?.toUpperCase();
                const isActive = statusUpper === 'ACTIVE';

                return (
                    <span className={`uk-label uk-label-${isActive ? 'success' : 'warning'}`}>
                {isActive ? 'Ativo' : 'Inativo'}
            </span>
                );
            }
        },
    ];

    const renderTeacherActions = (teacher: Teacher) => {
        if (!isAdmin) return null;

        const isCurrentlyActive = teacher.status === 'ACTIVE';
        const toggleButtonText = isCurrentlyActive ? 'Desativar' : 'Ativar';
        const toggleButtonVariant = isCurrentlyActive ? 'danger' : 'success';

        return (
            <div className="uk-button-group">
                <Link to={`/admin/teachers/edit/${teacher.id}`}>
                    <Button size="small" variant="default" title="Editar"><FiEdit /></Button>
                </Link>
                <Button size="small" variant={toggleButtonVariant} onClick={() => handleToggleStatus(teacher)} title={toggleButtonText}>
                    <FiPower />
                </Button>
            </div>
        );
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className="uk-heading-medium">{isAdmin ? 'Gerenciamento de Professores' : 'Corpo Docente'}</h1>
                {isAdmin && (
                    <Link to="/admin/teachers/novo" className="uk-button uk-button-primary">
                        <FiPlus className="uk-margin-small-right" />
                        Novo Professor
                    </Link>
                )}
            </header>
            <div className="page-content-card">
                {isError && <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar os professores.</p></div>}
                <DataTable
                    columns={columns}
                    data={teachers || []}
                    renderActions={renderTeacherActions}
                    isLoading={isLoading}
                    emptyMessage="Nenhum professor encontrado."
                />
            </div>
        </div>
    );
}