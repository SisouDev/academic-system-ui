import { PageHeader } from '../../components/pageheader';
import { DataTable, type ColumnDef } from '../../components/datatable';
import { Button } from '../../components/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { HalCollection } from '../../types/api';
import { useNavigate } from 'react-router-dom';
import UIkit from 'uikit';

type Aluno = {
    id: number;
    fullName: string;
    email: string;
    status: string;
    personType: string;
};

const fetchStudents = async (institutionId: number): Promise<Aluno[]> => {
    const { data } = await api.get<HalCollection<Aluno>>(`/api/v1/students?institutionId=${institutionId}`);
    const embedded = data?._embedded;
    if (!embedded || Object.keys(embedded).length === 0) {
        return [];
    }
    const key = Object.keys(embedded)[0];
    return embedded[key] || [];
};

const updateStudentStatusRequest = async ({ studentId, status }: { studentId: number, status: string }) => {
    const { data } = await api.patch(`/api/v1/students/${studentId}/status?status=${status}`);
    return data;
};

const colunas: ColumnDef<Aluno>[] = [
    { key: 'fullName', label: 'Nome do Aluno' },
    { key: 'email', label: 'Email' },
    {
        key: 'status',
        label: 'Status',
        render: (aluno) => {
            const statusUpper = aluno.status.toUpperCase();
            let statusClass = 'uk-label-warning';
            if (statusUpper === 'ACTIVE') {
                statusClass = 'uk-label-success';
            } else if (statusUpper === 'INACTIVE') {
                statusClass = 'uk-label-danger';
            }
            return <span className={`uk-label ${statusClass}`}>{aluno.status}</span>;
        }
    },
];

export function StudentListPage() {
    const { user } = useAuth();
    const institutionId = user?.institutionId;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: alunos, isLoading, isError } = useQuery({
        queryKey: ['students', institutionId],
        queryFn: () => fetchStudents(institutionId!),
        enabled: !!institutionId,
    });

    const statusMutation = useMutation({
        mutationFn: updateStudentStatusRequest,
        onSuccess: () => {
            UIkit.notification({
                message: '<span data-uk-icon="icon: check"></span> Status do aluno alterado com sucesso!',
                status: 'success',
                pos: 'top-right'
            });
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
        onError: () => {
            UIkit.notification({
                message: '<span data-uk-icon="icon: warning"></span> Erro ao alterar o status do aluno.',
                status: 'danger',
                pos: 'top-right'
            });
        }
    });

    const handleCreate = () => {
        navigate('/alunos/novo');
    };

    const handleEdit = (aluno: Aluno) => {
        navigate(`/alunos/editar/${aluno.id}`);
    };

    const handleToggleStatus = (aluno: Aluno) => {
        const isCurrentlyActive = aluno.status.toUpperCase() === 'ACTIVE';
        const newStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';
        const actionText = isCurrentlyActive ? 'desativar' : 'ativar';

        UIkit.modal.confirm(`Tem certeza que deseja ${actionText} o aluno ${aluno.fullName}?`).then(() => {
            statusMutation.mutate({ studentId: aluno.id, status: newStatus });
        }, () => {
        });
    };

    const renderTable = () => {
        if (isLoading) {
            return (
                <div className="uk-flex uk-flex-center uk-padding">
                    <div data-uk-spinner="ratio: 2"></div>
                </div>
            );
        }

        if (isError) {
            return (
                <div className="uk-alert-danger" data-uk-alert>
                    <p>Erro ao carregar a lista de alunos.</p>
                </div>
            );
        }

        return (
            <DataTable
                columns={colunas}
                data={alunos || []}
                renderActions={(aluno: Aluno) => {
                    const isCurrentlyActive = aluno.status.toUpperCase() === 'ACTIVE';
                    const toggleButtonText = isCurrentlyActive ? 'Desativar' : 'Ativar';
                    const toggleButtonVariant = isCurrentlyActive ? 'danger' : 'success';

                    return (
                        <div className="uk-button-group">
                            <Button size="small" variant="default" onClick={() => handleEdit(aluno)}>Editar</Button>
                            <Button size="small" variant={toggleButtonVariant} onClick={() => handleToggleStatus(aluno)}>
                                {toggleButtonText}
                            </Button>
                        </div>
                    );
                }}
            />
        );
    }

    return (
        <div>
            <PageHeader title="Gerenciamento de Alunos">
                <Button variant="primary" onClick={handleCreate}>
                    + Adicionar Aluno
                </Button>
            </PageHeader>

            <div className="uk-card uk-card-default uk-card-body">
                {renderTable()}
            </div>
        </div>
    );
}