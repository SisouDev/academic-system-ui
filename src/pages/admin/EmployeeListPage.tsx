import { useMemo, useState } from 'react';
import {useQuery, QueryClient, QueryClientProvider, useMutation} from '@tanstack/react-query';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type PaginationState,
} from '@tanstack/react-table';
import api from '../../services/api';
import {FiEdit, FiKey, FiPlus} from "react-icons/fi";
import {Link} from "react-router-dom";
import './EmployeeListPage.scss';
import {ConfirmationModal} from "../../components/common/ConfirmationModal.tsx";
import UIkit from "uikit";
import { toast } from 'react-hot-toast';

type Employee = {
    id: number;
    fullName: string;
    email: string;
    jobPosition: string;
}

type ApiResponse = {
    _embedded: {
        employeeSummaryDtoList: Employee[];
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

const resetPasswordMutationFn = (userId: number) => {
    return api.post(`/api/v1/admin/users/${userId}/reset-password`);
};

const fetchEmployees = async (pagination: PaginationState): Promise<ApiResponse> => {
    const { pageIndex, pageSize } = pagination;
    const response = await api.get('/api/v1/employees', {
        params: {
            page: pageIndex,
            size: pageSize,
            sort: 'firstName,asc'
        }
    });
    return response.data;
};

function EmployeeTable() {

    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
        queryKey: ['employees', pagination],
        queryFn: () => fetchEmployees(pagination),
        placeholderData: (prevData) => prevData,
    });

    const { mutate: resetPassword, isPending: isResetting } = useMutation({
        mutationFn: resetPasswordMutationFn,
        onSuccess: () => {
            toast.success(`Senha de ${selectedEmployee?.fullName} resetada com sucesso!`);
            UIkit.modal('#reset-password-modal').hide();
        },
        onError: () => {
            toast.error('Falha ao resetar a senha.');
            UIkit.modal('#reset-password-modal').hide();
        },
    });


    const handleResetClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        UIkit.modal('#reset-password-modal').show();
    };

    const columnHelper = createColumnHelper<Employee>();
    const columns = useMemo(() => [
        columnHelper.accessor('fullName', { header: 'Nome Completo' }),
        columnHelper.accessor('email', { header: 'Email' }),
        columnHelper.accessor('jobPosition', { header: 'Cargo', cell: info => <span className="uk-badge">{info.getValue()}</span> }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="uk-text-center">Ações</div>,
            cell: ({ row }) => (
                <div className="actions-cell">
                    <Link to={`/admin/employees/edit/${row.original.id}`}>
                        <button className="uk-button uk-button-default uk-button-small" title="Editar Funcionário">
                            <FiEdit />
                        </button>
                    </Link>
                    <button
                        className="uk-button uk-button-danger uk-button-small"
                        title="Resetar Senha"
                        onClick={() => handleResetClick(row.original)}
                    >
                        <FiKey />
                    </button>
                </div>
            )
        })
    ], [columnHelper]);

    const table = useReactTable({
        data: data?._embedded?.employeeSummaryDtoList ?? [],
        columns,
        pageCount: data?.page.totalPages ?? -1,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    if (isLoading && !data) return <div className="uk-text-center"><div data-uk-spinner="ratio: 2"></div></div>;
    if (isError) return <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar dados.</p></div>;

    return (
        <div>
            <div className="uk-overflow-auto">
                <table className="uk-table uk-table-hover uk-table-middle uk-table-divider">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (<tr key={headerGroup.id}>{headerGroup.headers.map(header => <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (<tr key={row.id}>{row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>))}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="uk-button uk-button-default">Anterior</button>
                <span>Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de <strong>{table.getPageCount()}</strong></span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="uk-button uk-button-default">Próxima</button>
            </div>

            {selectedEmployee && (
                <ConfirmationModal
                    id="reset-password-modal"
                    title="Confirmar Reset de Senha"
                    message={<span>Você tem certeza que deseja resetar a senha de <strong>{selectedEmployee.fullName}</strong>?</span>}
                    onConfirm={() => resetPassword(selectedEmployee.id)}
                    confirmLabel={isResetting ? 'Resetando...' : 'Sim, Resetar'}
                    isConfirming={isResetting}
                />
            )}
        </div>
    );
}

const queryClient = new QueryClient();

export function EmployeeListPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="page-container">
                <header className="page-header">
                    <h1 className="uk-heading-medium">Gerenciamento de Funcionários</h1>
                    <Link to="/admin/employees/novo" className="uk-button uk-button-primary">
                        <FiPlus className="uk-margin-small-right" />
                        Novo Funcionário
                    </Link>
                </header>
                <div className="page-content-card">
                    <EmployeeTable />
                </div>
            </div>
        </QueryClientProvider>
    );
}