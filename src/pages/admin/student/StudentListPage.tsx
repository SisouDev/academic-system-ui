import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type PaginationState,
} from '@tanstack/react-table';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../../services/api.ts';
import { FiEdit, FiPlus } from 'react-icons/fi';

type Student = {
    id: number;
    fullName: string;
    email: string;
    status: string;
};
type ApiResponse = {
    _embedded?: { studentSummaryDtoList: Student[] };
    page?: { totalPages: number; number: number };
};
const fetchStudents = async (pagination: PaginationState, searchTerm: string): Promise<ApiResponse> => {
    const { pageIndex, pageSize } = pagination;
    const response = await api.get('/api/v1/students', {
        params: {
            page: pageIndex,
            size: pageSize,
            sort: 'firstName,asc',
            searchTerm: searchTerm,
        }
    });
    return response.data;
};


function StudentTable() {
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
        queryKey: ['students', pagination, searchTerm],
        queryFn: () => fetchStudents(pagination, searchTerm),
        placeholderData: (prevData) => prevData,
    });

    const columnHelper = createColumnHelper<Student>();
    const columns = useMemo(() => [
        columnHelper.accessor('fullName', { header: 'Nome Completo' }),
        columnHelper.accessor('email', { header: 'Email' }),
        columnHelper.accessor('status', { header: 'Status', cell: info => <span className={`uk-label uk-label-${info.getValue() === 'ACTIVE' ? 'success' : 'warning'}`}>{info.getValue()}</span> }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="uk-text-center">Ações</div>,
            cell: ({ row }) => (
                <div className="actions-cell">
                    <Link to={`/admin/students/edit/${row.original.id}`}>
                        <button className="uk-button uk-button-default uk-button-small" title="Editar Aluno"><FiEdit /></button>
                    </Link>
                </div>
            )
        })
    ], [columnHelper]);

    const table = useReactTable({
        data: data?._embedded?.studentSummaryDtoList ?? [],
        columns,
        pageCount: data?.page?.totalPages ?? -1,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    if (isLoading) return <div className="uk-text-center uk-padding"><div data-uk-spinner></div></div>;
    if (isError) return <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar dados dos alunos.</p></div>;

    return (
        <div>
            <div className="uk-overflow-auto">
                <table className="uk-table uk-table-hover uk-table-middle uk-table-divider">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination-controls uk-margin-top uk-flex uk-flex-center uk-flex-middle">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="uk-button uk-button-default">Anterior</button>
                <span className="uk-margin-small-left uk-margin-small-right">Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de <strong>{table.getPageCount()}</strong></span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="uk-button uk-button-default">Próxima</button>
            </div>
        </div>
    );
}


export function StudentListPage() {
    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className="uk-heading-medium">Gerenciamento de Alunos</h1>
                <Link to="/admin/students/novo" className="uk-button uk-button-primary">
                    <FiPlus className="uk-margin-small-right" />
                    Novo Aluno
                </Link>
            </header>
            <div className="page-content-card">
                <StudentTable />
            </div>
        </div>
    );
}