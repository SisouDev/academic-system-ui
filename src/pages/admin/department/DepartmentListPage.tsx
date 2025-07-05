import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api.ts';
import { DataTable, type ColumnDef } from '../../../components/datatable';
import { PageHeader } from '../../../components/pageheader';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { DepartmentFormModal } from '../../../components/admin/department/DepartmentFormModal.tsx';
import { useAuth } from '../../../hook/useAuth.ts';

type Department = { id: number; name: string; acronym: string; };
type ApiResponse = { _embedded?: { departmentSummaryDtoList: Department[] }; };

const fetchDepartments = async (): Promise<ApiResponse> => {
    const { data } = await api.get('/api/v1/departments', { params: { size: 200 } });
    return data;
};

const deleteDepartment = (id: number) => api.delete(`/api/v1/departments/${id}`);

export function DepartmentListPage() {
    const queryClient = useQueryClient();
    const { institutionId } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: fetchDepartments,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDepartment,
        onSuccess: () => {
            toast.success("Departamento deletado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['departments'] });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Não foi possível deletar o departamento."),
    });

    const handleOpenModal = (department: Department | null) => {
        setEditingDept(department);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDept(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Tem certeza? Deletar um departamento também removerá os cursos associados.")) {
            deleteMutation.mutate(id);
        }
    };

    const columns: ColumnDef<Department>[] = [
        { key: 'name', label: 'Nome do Departamento' },
        { key: 'acronym', label: 'Sigla', render: (dept) => <span className="uk-text-muted">{dept.acronym}</span> },
    ];

    const renderActions = (dept: Department) => (
        <div className="uk-button-group">
            <button className="uk-button uk-button-default uk-button-small" onClick={() => handleOpenModal(dept)}><FiEdit/></button>
            <button className="uk-button uk-button-danger uk-button-small" onClick={() => handleDelete(dept.id)}><FiTrash2/></button>
        </div>
    );

    return (
        <div className="page-container">
            <PageHeader title="Gerenciamento de Departamentos">
                <button className="uk-button uk-button-primary" onClick={() => handleOpenModal(null)}>
                    <FiPlus /> Novo Departamento
                </button>
            </PageHeader>
            <div className="page-content-card">
                <DataTable
                    columns={columns}
                    data={data?._embedded?.departmentSummaryDtoList || []}
                    renderActions={renderActions}
                    isLoading={isLoading}
                    emptyMessage="Nenhum departamento encontrado."
                />
            </div>

            {isModalOpen && institutionId && (
                <DepartmentFormModal
                    departmentToEdit={editingDept}
                    institutionId={institutionId}
                    onClose={handleCloseModal}
                    onSave={handleCloseModal}
                />
            )}
        </div>
    );
}