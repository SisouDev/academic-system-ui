import { Table, Button } from 'react-bootstrap';
import { Edit, Trash2 } from 'lucide-react';
import type { LibraryItemDetails } from '../../../types';

interface LibraryItemsTableProps {
    items: LibraryItemDetails[];
    onEdit: (item: LibraryItemDetails) => void;
    onDelete: (id: number) => void;
}

export const LibraryItemsTable = ({ items, onEdit, onDelete }: LibraryItemsTableProps) => (
    <Table striped bordered hover responsive>
        <thead>
        <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Tipo</th>
            <th className="text-center">Cópias (Disp./Total)</th>
            <th className="text-center">Ações</th>
        </tr>
        </thead>
        <tbody>
        {items.map(item => (
            <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.author || '-'}</td>
                <td>{item.type}</td>
                <td className="text-center">{item.availableCopies} / {item.totalCopies}</td>
                <td className="text-center">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(item)}>
                        <Edit size={16} />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
                        <Trash2 size={16} />
                    </Button>
                </td>
            </tr>
        ))}
        </tbody>
    </Table>
);