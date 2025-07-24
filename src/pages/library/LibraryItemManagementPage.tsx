import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { PlusCircle } from 'lucide-react';
import { getLibraryItems, createLibraryItem, updateLibraryItem, deleteLibraryItem } from '../../services/employee/libraryApi';
import { LibraryItemsTable } from '../../features/library/components/LibraryItemsTable';
import { LibraryItemForm } from '../../features/library/components/LibraryItemForm';
import type { CreateLibraryItemData, LibraryItemDetails, PagedResponse } from '../../types';

export const LibraryItemManagementPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<LibraryItemDetails | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery<PagedResponse<LibraryItemDetails>, Error>({
        queryKey: ['libraryItems'],
        queryFn: () => getLibraryItems(0, 100), // Para simplificar, buscamos 100 itens. Pode ser paginado.
    });

    const items = data?._embedded?.libraryItemDetailsDtoList ?? [];

    const mutation = useMutation({
        mutationFn: (itemData: { id?: number } & CreateLibraryItemData) => {
            return itemData.id
                ? updateLibraryItem({ id: itemData.id, ...itemData })
                : createLibraryItem(itemData);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['libraryItems'] });
            setShowModal(false);
            setEditingItem(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteLibraryItem,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['libraryItems'] });
        }
    });

    const handleShowModal = (item: LibraryItemDetails | null = null) => {
        setEditingItem(item);
        setShowModal(true);
    };

    const handleFormSubmit = (data: CreateLibraryItemData) => {
        const submissionData = editingItem ? { id: editingItem.id, ...data } : data;
        mutation.mutate(submissionData);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Gerenciamento do Acervo</h1>
                <Button onClick={() => handleShowModal()}>
                    <PlusCircle size={18} className="me-2" /> Adicionar Item
                </Button>
            </div>

            <Card className="shadow-sm">
                <Card.Body>
                    {isLoading && <div className="text-center p-5"><Spinner /></div>}
                    {isError && <Alert variant="danger">Não foi possível carregar o acervo.</Alert>}
                    {items.length > 0 && <LibraryItemsTable items={items} onEdit={handleShowModal} onDelete={handleDelete} />}
                </Card.Body>
            </Card>

            <LibraryItemForm
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleFormSubmit}
                isSubmitting={mutation.isPending}
                initialData={editingItem}
            />
        </Container>
    );
};