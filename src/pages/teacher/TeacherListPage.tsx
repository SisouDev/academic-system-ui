import { PageHeader } from '../../components/pageheader';
import { DataTable, type ColumnDef } from '../../components/datatable';
import { Button } from '../../components/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { HalCollection } from '../../types/api';
import { useNavigate } from 'react-router-dom';
import UIkit from 'uikit';

type Professor = {
    id: number;
    fullName: string;
    email: string;
    status: string;
    personType: string;
};

const fetchTeachers = async (institutionId: number): Promise<Professor[]> => {
    const { data } = await api.get<HalCollection<Professor>>(`/api/v1/teachers?institutionId=${institutionId}`);
    const embedded = data?._embedded;
    if (!embedded || Object.keys(embedded).length === 0) {
        return [];
    }
    const key = Object.keys(embedded)[0];
    return embedded[key] || [];
};

const updateTeacherStatusRequest = async ({ teacherId, status }: { teacherId: number, status: string }) => {
    const { data } = await api.patch(`/api/v1/teachers/${teacherId}/status?status=${status}`);
    return data;
};

const colunas: ColumnDef<Professor>[] = [
    { key: 'fullName', label: 'Nome do Professor' },
    { key: 'email', label: 'Email' },
    {
        key: 'status',
        label: 'Status',
        render: (professor) => {
            const statusUpper = professor.status.toUpperCase();
            let statusClass = 'uk-label-warning';
            if (statusUpper === 'ACTIVE') {
                statusClass = 'uk-label-success';
            } else if (statusUpper === 'INACTIVE') {
                statusClass = 'uk-label-danger';
            }
            return <span className={`uk-label ${statusClass}`}>{professor.status}</span>;
        }
    },
];

export function TeacherListPage() {
    const { user } = useAuth();
    const institutionId = user?.institutionId;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: professores, isLoading, isError } = useQuery({
        queryKey: ['teachers', institutionId],
        queryFn: () => fetchTeachers(institutionId!),
        enabled: !!institutionId,
    });

    const statusMutation = useMutation({
        mutationFn: updateTeacherStatusRequest,
        onSuccess: () => {
            UIkit.notification({
                message: '<span data-uk-icon="icon: check"></span> Status do professor alterado com sucesso!',
                status: 'success',
                pos: 'top-right'
            });
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
        onError: () => {
            UIkit.notification({
                message: '<span data-uk-icon="icon: warning"></span> Erro ao alterar o status do professor.',
                status: 'danger',
                pos: 'top-right'
            });
        }
    });

    const handleCreate = () => {
        navigate('/professores/novo');
    };

    const handleEdit = (professor: Professor) => {
        navigate(`/professores/editar/${professor.id}`);
    };

    const handleToggleStatus = (professor: Professor) => {
        const isCurrentlyActive = professor.status.toUpperCase() === 'ACTIVE';
        const newStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';
        const actionText = isCurrentlyActive ? 'desativar' : 'ativar';

        UIkit.modal.confirm(`Tem certeza que deseja ${actionText} o professor(a) ${professor.fullName}?`).then(() => {
            statusMutation.mutate({ teacherId: professor.id, status: newStatus });
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
                    <p>Erro ao carregar a lista de professores.</p>
                </div>
            );
        }

        return (
            <DataTable
                columns={colunas}
                data={professores || []}
                renderActions={(professor: Professor) => {
                    const isCurrentlyActive = professor.status.toUpperCase() === 'ACTIVE';
                    const toggleButtonText = isCurrentlyActive ? 'Desativar' : 'Ativar';
                    const toggleButtonVariant = isCurrentlyActive ? 'danger' : 'success';

                    return (
                        <div className="uk-button-group">
                            <Button size="small" variant="default" onClick={() => handleEdit(professor)}>Editar</Button>
                            <Button size="small" variant={toggleButtonVariant} onClick={() => handleToggleStatus(professor)}>
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
            <PageHeader title="Gerenciamento de Professores">
                <Button variant="primary" onClick={handleCreate}>
                    + Adicionar Professor
                </Button>
            </PageHeader>

            <div className="uk-card uk-card-default uk-card-body">
                {renderTable()}
            </div>
        </div>
    );
}