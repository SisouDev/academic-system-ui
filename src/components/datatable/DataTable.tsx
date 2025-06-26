import * as React from 'react';
import './DataTable.scss';

export type ColumnDef<T> = {
    key: keyof T;
    label: string;
};

type DataTableProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    renderActions?: (item: T) => React.ReactNode; 
    isLoading?: boolean;
    emptyMessage?: string;
};

export function DataTable<T extends { id: string | number }>({
                                                     columns,
                                                     data,
                                                     renderActions,
                                                     isLoading = false,
                                                     emptyMessage = "Nenhum dado encontrado.",
                                                 }: DataTableProps<T>) {

    if (isLoading) {
        return <div className="datatable-state"><div data-uk-spinner></div></div>;
    }

    if (data.length === 0) {
        return <div className="datatable-state">{emptyMessage}</div>;
    }

    return (
        <div className="uk-overflow-auto">
            <table className="datatable uk-table uk-table-hover uk-table-divider">
                <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={String(col.key)}>{col.label}</th>
                    ))}
                    {renderActions && <th>Ações</th>}
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {columns.map((col) => (
                            <td key={`${item.id}-${String(col.key)}`}>
                                {String(item[col.key])}
                            </td>
                        ))}
                        {renderActions && (
                            <td className="datatable-actions">
                                {renderActions(item)}
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}